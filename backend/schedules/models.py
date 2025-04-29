from django.db import models
from django.core.validators import RegexValidator
from wagtail.snippets.models import register_snippet
from grapple.models import (
    GraphQLString,
    GraphQLForeignKey,
    GraphQLCollection,
)


@register_snippet
class Schedule(models.Model):
    start_date = models.DateField()
    end_date = models.DateField()

    graphql_fields = [
        GraphQLString("start_date"),
        GraphQLString("end_date"),
        GraphQLCollection(GraphQLForeignKey, "flights", "schedules.Flight"),
    ]

    def __str__(self):
        return f"Schedule: {self.start_date} to {self.end_date}"

    class Meta:
        verbose_name = "Schedule"
        verbose_name_plural = "Schedules"
        unique_together = ["start_date", "end_date"]


class Flight(models.Model):
    schedule = models.ForeignKey(
        Schedule, on_delete=models.CASCADE, related_name="flights"
    )
    day = models.CharField(max_length=10)
    flight_number = models.CharField(max_length=10)
    departure_port = models.CharField(max_length=20)  # e.g., "JFK"
    arrival_port = models.CharField(max_length=20)  # e.g., "LAX"
    departure_time = models.CharField(
        max_length=4,
        validators=[
            RegexValidator(r"^\d{4}$", "Time must be in HHMM format (e.g., 0800).")
        ],
    )
    arrival_time = models.CharField(
        max_length=4,
        validators=[
            RegexValidator(r"^\d{4}$", "Time must be in HHMM format (e.g., 1100).")
        ],
    )
    flight_scope = models.CharField(max_length=50)  # e.g., "Domestic", "International"

    graphql_fields = [
        GraphQLString("day"),
        GraphQLString("flight_number"),
        GraphQLString("departure_port"),
        GraphQLString("arrival_port"),
        GraphQLString("departure_time"),
        GraphQLString("arrival_time"),
        GraphQLString("flight_scope"),
        GraphQLForeignKey("schedule", "schedules.Schedule"),
    ]

    def __str__(self):
        return f"{self.flight_number}: {self.departure_port} to {self.arrival_port}"

    class Meta:
        verbose_name = "Flight"
        verbose_name_plural = "Flights"
