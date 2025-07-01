from wagtail import hooks
from wagtail.admin.menu import MenuItem
from django.urls import path, reverse
from django.shortcuts import render, redirect
from django.contrib import messages
from django.views.generic import View
import pandas as pd
import logging
from django.db import IntegrityError
from .models import SpecialRoute, Special, Route
from core.models import Currency

logger = logging.getLogger(__name__)


class SpecialRouteUploadView(View):
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
                "Special ID",
                "Route",
                "Starting Price",
                "Trip Type",
                "Currency",
            ]
            if not all(col in df.columns for col in expected_columns):
                missing_cols = [
                    col for col in expected_columns if col not in df.columns
                ]
                messages.error(request, f"Missing columns: {', '.join(missing_cols)}")
                return redirect(request.path)

            # Parse price as numeric
            df["Starting Price"] = pd.to_numeric(df["Starting Price"], errors="coerce")

            created_special_routes = 0
            skipped_rows = []
            duplicate_special_routes = []

            for index, row in df.iterrows():
                # Check for invalid fields
                invalid_fields = []
                if pd.isna(row["Special ID"]):
                    invalid_fields.append("Special ID")
                if pd.isna(row["Route"]):
                    invalid_fields.append("Route")
                if pd.isna(row["Starting Price"]) or not isinstance(
                    row["Starting Price"], (int, float)
                ):
                    invalid_fields.append("Starting Price")
                if pd.isna(row["Trip Type"]) or row["Trip Type"].lower() not in [
                    "one way",
                    "return",
                ]:
                    invalid_fields.append("Trip Type")
                if pd.isna(row["Currency"]):
                    invalid_fields.append("Currency")

                if invalid_fields:
                    skipped_rows.append(index)
                    logger.warning(
                        f"Skipped row {index}: Invalid or missing fields: {', '.join(invalid_fields)}"
                    )
                    continue

                try:
                    # Find the Special by special_code
                    try:
                        special_obj = Special.objects.get(
                            special_code=row["Special ID"]
                        )
                    except Special.DoesNotExist:
                        logger.error(
                            f"Special with ID {row['Special ID']} does not exist"
                        )
                        skipped_rows.append(index)
                        continue

                    # Find the Route by name
                    try:
                        route_obj = Route.objects.get(name=row["Route"])
                    except Route.DoesNotExist:
                        logger.error(f"Route {row['Route']} does not exist")
                        skipped_rows.append(index)
                        continue

                    # Find the Currency by currency_code
                    try:
                        currency_obj = Currency.objects.get(
                            currency_code=row["Currency"]
                        )
                    except Currency.DoesNotExist:
                        logger.error(f"Currency code {row['Currency']} does not exist")
                        skipped_rows.append(index)
                        continue

                    # Check if a special fare with this special and route already exists
                    existing_special_route = SpecialRoute.objects.filter(
                        special=special_obj, route=route_obj
                    )

                    if existing_special_route.exists():
                        duplicate_special_routes.append(
                            f"{special_obj.name} for route {route_obj.name}"
                        )
                        logger.warning(
                            f"Duplicate special fare: {special_obj.name} for route {route_obj.name}"
                        )
                        continue

                    SpecialRoute.objects.create(
                        special=special_obj,
                        route=route_obj,
                        starting_price=row["Starting Price"],
                        trip_type=row["Trip Type"].lower(),
                        currency=currency_obj,
                    )
                    created_special_routes += 1
                    logger.info(
                        f"Created special fare: {special_obj.name} {route_obj.name} at row {index}"
                    )
                except IntegrityError as ie:
                    # Handle the case where unique_together constraint fails
                    logger.error(f"Duplicate special fare at row {index}: {str(ie)}")
                    duplicate_special_routes.append(
                        f"Row {index+1}: {special_obj.name} for route {route_obj.name}"
                    )
                except Exception as e:
                    logger.error(
                        f"Error creating special fare at row {index}: {str(e)}"
                    )
                    skipped_rows.append(index)

            if created_special_routes > 0:
                messages.success(
                    request, f"Uploaded {created_special_routes} special fares."
                )
            else:
                messages.warning(request, "No special fares uploaded. Check data.")

            if duplicate_special_routes:
                messages.error(
                    request,
                    f"Duplicate special fares found: {'; '.join(duplicate_special_routes)}. Each special must be unique for a given route.",
                )

            if skipped_rows:
                messages.warning(
                    request, f"Skipped rows {skipped_rows} due to invalid data."
                )

        except Exception as e:
            logger.error(f"Error processing Excel file: {str(e)}")
            messages.error(request, f"Error processing file: {str(e)}")
            return redirect(request.path)

        special_routes = SpecialRoute.objects.select_related(
            "special", "route"
        ).order_by("special__name", "route__name")
        logger.info(
            f"Returning {special_routes.count()} special fares for admin display"
        )
        return render(
            request,
            "explore/upload_special_route.html",
            {"special_routes": special_routes},
        )

    def get(self, request):
        special_routes = SpecialRoute.objects.select_related(
            "special", "route"
        ).order_by("special__name", "route__name")
        logger.info(
            f"Returning {special_routes.count()} special fares for admin display"
        )
        return render(
            request,
            "explore/upload_special_route.html",
            {"special_routes": special_routes},
        )


@hooks.register("before_edit_page")
def handle_special_route_validation(request, instance):
    """Handle validation for SpecialRoute in the admin interface"""
    if isinstance(instance, SpecialRoute) and request.method == "POST":
        # Extract the POST data
        special_id = request.POST.get("special")
        route_id = request.POST.get("route")

        if special_id and route_id:
            # Check for duplicates
            existing_special_routes = SpecialRoute.objects.filter(
                special_id=special_id, route_id=route_id
            )

            # Exclude the current instance if updating
            if instance.pk:
                existing_special_routes = existing_special_routes.exclude(
                    pk=instance.pk
                )

            if existing_special_routes.exists():
                try:
                    special_name = Special.objects.get(id=special_id).name
                    route_name = Route.objects.get(id=route_id).name
                except (Special.DoesNotExist, Route.DoesNotExist):
                    special_name = "Unknown Special"
                    route_name = "Unknown Route"

                messages.error(
                    request,
                    f'A special fare for "{special_name}" already exists for route "{route_name}". Each special must be unique for a given route.',
                )
                return


def register_special_route_upload_menu_item():
    return MenuItem(
        label="Special Fares",
        url=reverse("special_route_upload"),
        name="special_route_upload",
        icon_name="upload",
        order=10002,
    )


hooks.register("register_admin_menu_item", register_special_route_upload_menu_item)


def register_special_route_upload_urls():
    return [
        path(
            "special-route-upload/",
            SpecialRouteUploadView.as_view(),
            name="special_route_upload",
        ),
    ]


hooks.register("register_admin_urls", register_special_route_upload_urls)
