from wagtail import hooks
from wagtail.admin.menu import MenuItem
from django.urls import path, reverse
from django.shortcuts import render, redirect
from django.contrib import messages
from django.views.generic import View
import pandas as pd
import logging
from .models import Schedule, Flight

logger = logging.getLogger(__name__)


class ScheduleUploadView(View):
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
                "Start Date",
                "End Date",
                "Day",
                "Flight Number",
                "Departure Port",
                "Arrival Port",
                "Departure Time",
                "Arrival Time",
                "Flight Scope",
            ]
            if not all(col in df.columns for col in expected_columns):
                missing_cols = [
                    col for col in expected_columns if col not in df.columns
                ]
                messages.error(request, f"Missing columns: {', '.join(missing_cols)}")
                return redirect(request.path)

            # Parse dates in MM/DD/YYYY format
            df["Start Date"] = pd.to_datetime(
                df["Start Date"], format="%m/%d/%Y", errors="coerce"
            ).dt.date
            df["End Date"] = pd.to_datetime(
                df["End Date"], format="%m/%d/%Y", errors="coerce"
            ).dt.date

            # Parse times to HHMM format
            def to_hhmm(time_str):
                if pd.isna(time_str):
                    return None
                try:
                    # Try specific formats first
                    for fmt in ["%H:%M", "%I:%M %p", "%H:%M:%S", "%I:%M:%S %p", "%H%M"]:
                        try:
                            parsed = pd.to_datetime(
                                time_str, format=fmt, errors="raise"
                            )
                            hhmm = parsed.strftime("%H%M")
                            logger.debug(
                                f"Parsed time '{time_str}' to '{hhmm}' using format '{fmt}'"
                            )
                            return hhmm
                        except ValueError:
                            continue
                    # Fallback to infer_datetime_format
                    parsed = pd.to_datetime(
                        time_str, errors="coerce", infer_datetime_format=True
                    )
                    if parsed is pd.NaT:
                        logger.warning(
                            f"Failed to parse time '{time_str}': Invalid format"
                        )
                        return None
                    hhmm = parsed.strftime("%H%M")
                    logger.debug(f"Parsed time '{time_str}' to '{hhmm}' using fallback")
                    return hhmm
                except Exception as e:
                    logger.warning(f"Failed to parse time '{time_str}': {str(e)}")
                    return None

            df["Departure Time"] = df["Departure Time"].apply(to_hhmm)
            df["Arrival Time"] = df["Arrival Time"].apply(to_hhmm)

            created_schedules = 0
            created_flights = 0
            skipped_rows = []

            # Group by start_date and end_date
            grouped = df.groupby(["Start Date", "End Date"])
            for (start_date, end_date), group in grouped:
                if pd.isna(start_date) or pd.isna(end_date):
                    skipped_rows.extend(group.index.tolist())
                    logger.warning(
                        f"Skipped rows {group.index.tolist()}: Invalid Start Date or End Date"
                    )
                    continue

                # Create or get Schedule
                schedule, created = Schedule.objects.get_or_create(
                    start_date=start_date, end_date=end_date
                )
                if created:
                    created_schedules += 1
                    logger.info(f"Created schedule: {start_date} to {end_date}")

                # Create Flights
                for index, row in group.iterrows():
                    # Check for invalid fields
                    invalid_fields = []
                    if pd.isna(row["Day"]):
                        invalid_fields.append("Day")
                    if pd.isna(row["Flight Number"]):
                        invalid_fields.append("Flight Number")
                    if pd.isna(row["Departure Port"]):
                        invalid_fields.append("Departure Port")
                    if pd.isna(row["Arrival Port"]):
                        invalid_fields.append("Arrival Port")
                    if pd.isna(row["Departure Time"]):
                        invalid_fields.append("Departure Time")
                    if pd.isna(row["Arrival Time"]):
                        invalid_fields.append("Arrival Time")
                    if pd.isna(row["Flight Scope"]):
                        invalid_fields.append("Flight Scope")

                    if invalid_fields:
                        skipped_rows.append(index)
                        logger.warning(
                            f"Skipped row {index}: Invalid or missing fields: {', '.join(invalid_fields)}"
                        )
                        continue

                    try:
                        Flight.objects.create(
                            schedule=schedule,
                            day=row["Day"],
                            flight_number=row["Flight Number"],
                            departure_port=row["Departure Port"],
                            arrival_port=row["Arrival Port"],
                            departure_time=row["Departure Time"],
                            arrival_time=row["Arrival Time"],
                            flight_scope=row["Flight Scope"],
                        )
                        created_flights += 1
                        logger.info(
                            f"Created flight: {row['Flight Number']} at row {index}"
                        )
                    except Exception as e:
                        logger.error(f"Error creating flight at row {index}: {str(e)}")
                        skipped_rows.append(index)

            if created_schedules > 0 or created_flights > 0:
                messages.success(
                    request,
                    f"Uploaded {created_schedules} schedules and {created_flights} flights.",
                )
            else:
                messages.warning(
                    request, "No schedules or flights uploaded. Check data formats."
                )
            if skipped_rows:
                messages.warning(
                    request, f"Skipped rows {skipped_rows} due to invalid data."
                )

        except Exception as e:
            logger.error(f"Error processing Excel file: {str(e)}")
            messages.error(request, f"Error processing file: {str(e)}")
            return redirect(request.path)

        schedules = Schedule.objects.prefetch_related("flights").order_by("start_date")
        logger.info(f"Returning {schedules.count()} schedules for admin display")
        return render(
            request, "schedules/upload_schedule.html", {"schedules": schedules}
        )

    def get(self, request):
        schedules = Schedule.objects.prefetch_related("flights").order_by("start_date")
        logger.info(f"Returning {schedules.count()} schedules for admin display")
        return render(
            request, "schedules/upload_schedule.html", {"schedules": schedules}
        )


def register_schedule_upload_menu_item():
    return MenuItem(
        label="Flight Schedules",
        url=reverse("schedule_upload"),
        name="schedule_upload",
        icon_name="upload",
        order=10000,
    )


hooks.register("register_admin_menu_item", register_schedule_upload_menu_item)


def register_schedule_upload_urls():
    return [
        path("schedule-upload/", ScheduleUploadView.as_view(), name="schedule_upload"),
    ]


hooks.register("register_admin_urls", register_schedule_upload_urls)
