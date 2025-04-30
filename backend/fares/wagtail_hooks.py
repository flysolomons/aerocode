from wagtail import hooks
from wagtail.admin.menu import MenuItem
from django.urls import path, reverse
from django.shortcuts import render, redirect
from django.contrib import messages
from django.views.generic import View
import pandas as pd
import logging
from .models import Fare

logger = logging.getLogger(__name__)


class FareUploadView(View):
    def post(self, request):
        excel_file = request.FILES.get("excel_file")
        if not excel_file.name.endswith((".xlsx", ".xls")):
            messages.error(request, "Please upload a valid Excel file (.xlsx or .xls).")
            return redirect(request.path)

        try:
            df = pd.read_excel(excel_file)
            logger.info(f"Excel file columns: {df.columns.tolist()}")
            logger.info(f"Excel file data:\n{df.to_string()}")

            expected_columns = [
                "Fare Family",
                "Price",
                "Currency",
                "Trip Type",
                "Origin",
                "Destination",
            ]
            if not all(col in df.columns for col in expected_columns):
                missing_cols = [
                    col for col in expected_columns if col not in df.columns
                ]
                messages.error(request, f"Missing columns: {', '.join(missing_cols)}")
                return redirect(request.path)

            # Parse price as numeric
            df["Price"] = pd.to_numeric(df["Price"], errors="coerce")

            created_fares = 0
            skipped_rows = []

            for index, row in df.iterrows():
                # Check for invalid fields
                invalid_fields = []
                if pd.isna(row["Fare Family"]):
                    invalid_fields.append("Fare Family")
                if pd.isna(row["Price"]) or not isinstance(row["Price"], (int, float)):
                    invalid_fields.append("Price")
                if pd.isna(row["Currency"]):
                    invalid_fields.append("Currency")
                if pd.isna(row["Trip Type"]) or row["Trip Type"].lower() != "one way":
                    invalid_fields.append("Trip Type")
                if pd.isna(row["Origin"]):
                    invalid_fields.append("Origin")
                if pd.isna(row["Destination"]):
                    invalid_fields.append("Destination")

                if invalid_fields:
                    skipped_rows.append(index)
                    logger.warning(
                        f"Skipped row {index}: Invalid or missing fields: {', '.join(invalid_fields)}"
                    )
                    continue

                # Compute route
                route = f"{row['Origin']}-{row['Destination']}"

                try:
                    Fare.objects.create(
                        fare_family=row["Fare Family"],
                        price=row["Price"],
                        currency=row["Currency"],
                        trip_type="one way",  # Enforce "one way"
                        origin=row["Origin"],
                        destination=row["Destination"],
                        route=route,
                    )
                    created_fares += 1
                    logger.info(
                        f"Created fare: {row['Fare Family']} {route} at row {index}"
                    )
                except Exception as e:
                    logger.error(f"Error creating fare at row {index}: {str(e)}")
                    skipped_rows.append(index)

            if created_fares > 0:
                messages.success(request, f"Uploaded {created_fares} fares.")
            else:
                messages.warning(request, "No fares uploaded. Check data formats.")
            if skipped_rows:
                messages.warning(
                    request, f"Skipped rows {skipped_rows} due to invalid data."
                )

        except Exception as e:
            logger.error(f"Error processing Excel file: {str(e)}")
            messages.error(request, f"Error processing file: {str(e)}")
            return redirect(request.path)

        fares = Fare.objects.order_by("route")
        logger.info(f"Returning {fares.count()} fares for admin display")
        return render(request, "fares/upload_fare.html", {"fares": fares})

    def get(self, request):
        fares = Fare.objects.order_by("route")
        logger.info(f"Returning {fares.count()} fares for admin display")
        return render(request, "fares/upload_fare.html", {"fares": fares})


def register_fare_upload_menu_item():
    return MenuItem(
        label="Year Round Fares",
        url=reverse("fare_upload"),
        name="fare_upload",
        icon_name="upload",
        order=10001,
    )


hooks.register("register_admin_menu_item", register_fare_upload_menu_item)


def register_fare_upload_urls():
    return [
        path("fare-upload/", FareUploadView.as_view(), name="fare_upload"),
    ]


hooks.register("register_admin_urls", register_fare_upload_urls)
