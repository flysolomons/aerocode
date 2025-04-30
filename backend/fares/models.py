from django.db import models
from wagtail.snippets.models import register_snippet
from grapple.models import GraphQLString, GraphQLFloat
from grapple.helpers import register_query_field


@register_snippet
@register_query_field("fare")
class Fare(models.Model):
    fare_family = models.CharField(max_length=50)  # e.g., "Economy", "Business"
    price = models.DecimalField(max_digits=10, decimal_places=2)  # e.g., 199.99
    currency = models.CharField(max_length=3)  # e.g., "USD", "EUR"
    trip_type = models.CharField(max_length=10, default="One Way")  # Always "one way"
    origin = models.CharField(max_length=10)  # e.g., "JFK"
    destination = models.CharField(max_length=10)  # e.g., "LAX"
    route = models.CharField(max_length=20)  # e.g., "JFK-LAX"

    graphql_fields = [
        GraphQLString("fare_family"),
        GraphQLFloat("price"),
        GraphQLString("currency"),
        GraphQLString("trip_type"),
        GraphQLString("origin"),
        GraphQLString("destination"),
        GraphQLString("route"),
    ]

    def __str__(self):
        return f"{self.fare_family} {self.route}: {self.price} {self.currency}"

    class Meta:
        verbose_name = "Fare"
        verbose_name_plural = "Fares"
