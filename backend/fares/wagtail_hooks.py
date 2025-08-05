from wagtail import hooks
from wagtail.admin.menu import MenuItem
from django.urls import path, reverse
from django.shortcuts import render, redirect
from django.contrib import messages
from django.views.generic import View
import pandas as pd
import logging
from django.db import IntegrityError
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
            duplicate_fares = []

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
                    continue  # Compute route name to find the route object
                route_name = f"{row['Origin']}-{row['Destination']}"

                try:
                    # Attempt to get the Route object
                    from explore.models import Route

                    try:
                        route_obj = Route.objects.get(name=route_name)
                    except Route.DoesNotExist:
                        logger.error(f"Route {route_name} does not exist")
                        skipped_rows.append(index)
                        continue

                    # Check if a fare with this fare_family and route already exists
                    existing_fare = Fare.objects.filter(
                        fare_family=row["Fare Family"], route=route_obj
                    )

                    if existing_fare.exists():
                        duplicate_fares.append(
                            f"{row['Fare Family']} for route {route_name}"
                        )
                        logger.warning(
                            f"Duplicate fare: {row['Fare Family']} for route {route_name}"
                        )
                        continue

                    Fare.objects.create(
                        fare_family=row["Fare Family"],
                        price=row["Price"],
                        currency=row["Currency"],
                        trip_type="One way",
                        origin=row["Origin"],
                        destination=row["Destination"],
                        route=route_obj,
                    )
                    created_fares += 1
                    logger.info(
                        f"Created fare: {row['Fare Family']} {route_name} at row {index}"
                    )
                except IntegrityError as ie:
                    # Handle the case where unique_together constraint fails
                    logger.error(f"Duplicate fare at row {index}: {str(ie)}")
                    duplicate_fares.append(
                        f"Row {index+1}: {row['Fare Family']} for route {route_name}"
                    )
                except Exception as e:
                    logger.error(f"Error creating fare at row {index}: {str(e)}")
                    skipped_rows.append(index)

            if created_fares > 0:
                messages.success(request, f"Uploaded {created_fares} fares.")
            else:
                messages.warning(request, "No fares uploaded. Check data.")

            if duplicate_fares:
                messages.error(
                    request,
                    f"Duplicate fares found: {'; '.join(duplicate_fares)}. Each fare family must be unique for a given route.",
                )

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


@hooks.register("before_edit_page")
def handle_fare_validation(request, instance):
    """Handle validation for Fare snippets in the admin interface"""
    if isinstance(instance, Fare) and request.method == "POST":
        # Extract the POST data
        fare_family = request.POST.get("fare_family")
        route_id = request.POST.get("route")

        if fare_family and route_id:
            # Check for duplicates
            existing_fares = Fare.objects.filter(
                fare_family=fare_family, route_id=route_id
            )

            # Exclude the current instance if updating
            if instance.pk:
                existing_fares = existing_fares.exclude(pk=instance.pk)

            if existing_fares.exists():
                from explore.models import Route

                try:
                    route_name = Route.objects.get(id=route_id).name
                except Route.DoesNotExist:
                    route_name = "Unknown Route"

                messages.error(
                    request,
                    f'A fare for "{fare_family}" already exists for route "{route_name}". Each fare family must be unique for a given route.',
                )
                return


# Individual menu item replaced with grouped submenu in explore/wagtail_hooks.py
# def register_fare_upload_menu_item():
#     return MenuItem(
#         label="Year Round Fares",
#         url=reverse("fare_upload"),
#         name="fare_upload",
#         icon_name="upload",
#         order=10001,
#     )
# hooks.register("register_admin_menu_item", register_fare_upload_menu_item)


def register_fare_upload_urls():
    return [
        path("fare-upload/", FareUploadView.as_view(), name="fare_upload"),
    ]


hooks.register("register_admin_urls", register_fare_upload_urls)
