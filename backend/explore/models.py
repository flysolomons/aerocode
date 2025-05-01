from core.models import BasePage
from modelcluster.fields import ParentalManyToManyField
from wagtail.fields import RichTextField, StreamField
from wagtail.admin.panels import FieldPanel, MultiFieldPanel
from grapple.models import (
    GraphQLString,
    GraphQLStreamfield,
    GraphQLForeignKey,
    GraphQLCollection,
)
from core.blocks import SectionBlock, TravelRequirementBlock
from grapple.helpers import register_query_field
from django.db import models
from django.core.exceptions import ValidationError
from django import forms


class ExploreIndexPage(BasePage):
    max_count = 1

    description = RichTextField(
        features=["bold", "italic", "link"],
        blank=True,
        help_text="A short description of the page",
    )
    content_panels = BasePage.content_panels + [
        FieldPanel("description", heading="Description"),
    ]
    graphql_fields = BasePage.graphql_fields + [
        GraphQLString("description"),
    ]
    parent_page_types = ["home.HomePage"]

    class Meta:
        verbose_name = "Explore Index Page"


class DestinationIndexPage(BasePage):
    max_count = 1

    description = RichTextField(
        features=["bold", "italic", "link"],
        blank=True,
        help_text="A short description of the page",
    )
    content_panels = BasePage.content_panels + [
        FieldPanel("description", heading="Description"),
    ]
    graphql_fields = BasePage.graphql_fields + [
        GraphQLString("description"),
    ]
    parent_page_types = ["explore.ExploreIndexPage"]

    class Meta:
        verbose_name = "Destination Index Page"


@register_query_field("destination")
class Destination(BasePage):
    country = models.CharField(
        max_length=255, blank=True, help_text="Name of Country/Destination"
    )

    reasons_to_visit = StreamField(
        [
            ("section", SectionBlock()),
        ],
        blank=True,
    )

    travel_requirements = StreamField(
        [
            ("travel_requirement", TravelRequirementBlock()),
        ],
        blank=True,
    )

    content_panels = BasePage.content_panels + [
        FieldPanel("country", heading="Country"),
        FieldPanel("reasons_to_visit", heading="Reasons to Visit"),
        FieldPanel("travel_requirements", heading="Travel Requirements"),
    ]

    graphql_fields = BasePage.graphql_fields + [
        GraphQLStreamfield("reasons_to_visit"),
        GraphQLStreamfield("travel_requirements"),
        GraphQLCollection(GraphQLForeignKey, "routes", "explore.Route"),
        GraphQLString("country"),
    ]

    parent_page_types = ["explore.DestinationIndexPage"]

    class Meta:
        verbose_name = "Destination Page"


@register_query_field("route")
class Route(BasePage):
    destination_country = models.ForeignKey(
        Destination,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="routes",
    )

    departure_airport = models.CharField(
        max_length=255, blank=True, help_text="Departure airport for the route"
    )
    arrival_airport = models.CharField(
        max_length=255, blank=True, help_text="Arrival airport for the route"
    )
    departure_airport_code = models.CharField(
        max_length=3, blank=True, help_text="IATA code for the departure airport"
    )
    arrival_airport_code = models.CharField(
        max_length=3, blank=True, help_text="IATA code for the arrival airport"
    )

    name = models.CharField(max_length=20, null=True, blank=True)

    content_panels = BasePage.content_panels + [
        FieldPanel("destination_country", heading="Destination"),
        FieldPanel("departure_airport", heading="Departure Airport"),
        FieldPanel("arrival_airport", heading="Arrival Airport"),
        FieldPanel("departure_airport_code", heading="Departure Airport Code"),
        FieldPanel("arrival_airport_code", heading="Arrival Airport Code"),
    ]

    graphql_fields = BasePage.graphql_fields + [
        GraphQLString("departure_airport", name="departureAirport"),
        GraphQLString("arrival_airport", name="arrivalAirport"),
        GraphQLString("departure_airport_code", name="departureAirportCode"),
        GraphQLString("arrival_airport_code", name="arrivalAirportCode"),
        GraphQLForeignKey("destination_country", "explore.Destination"),
        GraphQLString("name", name="routeName"),
    ]

    parent_page_types = ["explore.Destination"]

    def save(self, *args, **kwargs):
        self.name = f"{self.departure_airport_code}-{self.arrival_airport_code}"
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Route Page"


class SpecialsIndexPage(BasePage):
    max_count = 1

    description = RichTextField(
        features=["bold", "italic", "link"],
        blank=True,
        help_text="A short description of the page",
    )
    content_panels = BasePage.content_panels + [
        FieldPanel("description", heading="Description"),
    ]
    graphql_fields = BasePage.graphql_fields + [
        GraphQLString("description"),
    ]
    parent_page_types = ["explore.ExploreIndexPage"]

    class Meta:
        verbose_name = "Specials Index Page"


@register_query_field("special")
class Special(BasePage):
    start_date = models.DateField(
        null=True, blank=True, help_text="Start date of the flight special"
    )
    end_date = models.DateField(
        null=True, blank=True, help_text="End date of the flight special"
    )

    terms_and_conditions = RichTextField(
        features=["bold", "italic", "link"],
        blank=True,
        help_text="Terms and conditions for the flight special",
    )

    routes = ParentalManyToManyField(
        Route,
        related_name="specials",
    )

    content_panels = BasePage.content_panels + [
        FieldPanel("start_date", heading="Start Date"),
        FieldPanel("end_date", heading="End Date"),
        FieldPanel("terms_and_conditions", heading="Terms and Conditions"),
        MultiFieldPanel(
            [
                FieldPanel("routes", widget=forms.CheckboxSelectMultiple),
            ],
            heading="Associated Routes",
            help_text="Select one or more routes associated with this special (required)",
        ),
    ]

    graphql_fields = BasePage.graphql_fields + [
        GraphQLString("start_date", name="startDate"),
        GraphQLString("end_date", name="endDate"),
        GraphQLString("terms_and_conditions", name="termsAndConditions"),
        GraphQLCollection(GraphQLForeignKey, "routes", "explore.Route"),
    ]

    parent_page_types = ["explore.SpecialsIndexPage"]

    class Meta:
        verbose_name = "Specials Page"


class WhereWeFly(BasePage):
    max_count = 1

    description = RichTextField(
        features=["bold", "italic", "link"],
        blank=True,
        help_text="A short description of the page",
    )
    content_panels = BasePage.content_panels + [
        FieldPanel("description", heading="Description"),
    ]
    graphql_fields = BasePage.graphql_fields + [
        GraphQLString("description"),
    ]
    parent_page_types = ["explore.ExploreIndexPage"]

    class Meta:
        verbose_name = "Where We Fly Page"


class FlightSchedule(BasePage):
    max_count = 1

    description = RichTextField(
        features=["bold", "italic", "link"],
        blank=True,
        help_text="A short description of the page",
    )
    content_panels = BasePage.content_panels + [
        FieldPanel("description", heading="Description"),
    ]
    graphql_fields = BasePage.graphql_fields + [
        GraphQLString("description"),
    ]
    parent_page_types = ["explore.ExploreIndexPage"]

    class Meta:
        verbose_name = "Flight Schedule Page"
