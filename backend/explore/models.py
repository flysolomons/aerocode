from core.models import BasePage
from wagtail.search import index
from modelcluster.fields import ParentalManyToManyField
from wagtail.fields import RichTextField, StreamField
from wagtail.admin.panels import FieldPanel, MultiFieldPanel
from grapple.models import (
    GraphQLString,
    GraphQLStreamfield,
    GraphQLForeignKey,
    GraphQLCollection,
    GraphQLImage,
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
        "explore.Destination",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="routes",
        help_text="Destination country for the route",
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

    name = models.CharField(max_length=20, null=True, blank=True, unique=True)
    name_full = models.CharField(
        max_length=255, null=True, blank=True, help_text="Full name of the route"
    )

    content_panels = BasePage.content_panels + [
        FieldPanel("departure_airport", heading="Departure Airport"),
        FieldPanel("arrival_airport", heading="Arrival Airport"),
        FieldPanel("departure_airport_code", heading="Departure Airport Code"),
        FieldPanel("arrival_airport_code", heading="Arrival Airport Code"),
    ]

    search_fields = BasePage.search_fields + [
        index.SearchField("arrival_airport", partial_match=True),
        index.SearchField("arrival_airport_code", partial_match=True),
    ]

    graphql_fields = BasePage.graphql_fields + [
        GraphQLString("departure_airport", name="departureAirport"),
        GraphQLString("arrival_airport", name="arrivalAirport"),
        GraphQLString("departure_airport_code", name="departureAirportCode"),
        GraphQLString("arrival_airport_code", name="arrivalAirportCode"),
        GraphQLForeignKey("destination_country", "explore.Destination"),
        GraphQLString("name", name="routeName"),
        GraphQLString("name_full", name="routeNameFull"),
        GraphQLCollection(GraphQLForeignKey, "specials", "explore.Special"),
        GraphQLCollection(GraphQLForeignKey, "fares", "fares.Fare"),
    ]

    parent_page_types = ["explore.Destination"]

    def clean(self):
        """
        Validate that the combination of departure_airport_code and arrival_airport_code
        is unique before saving.
        """
        super().clean()
        if self.departure_airport_code and self.arrival_airport_code:
            # Generate the name for validation
            generated_name = (
                f"{self.departure_airport_code}-{self.arrival_airport_code}"
            )
            # Check for existing routes with the same name, excluding the current instance
            existing_routes = Route.objects.filter(name=generated_name).exclude(
                pk=self.pk
            )
            if existing_routes.exists():
                raise ValidationError(
                    {
                        "departure_airport_code": f"A route with {generated_name} already exists.",
                        "arrival_airport_code": f"A route with {generated_name} already exists.",
                    }
                )

    def save(self, *args, **kwargs):
        # Set destination_country to parent Destination page upon saving
        if not self.destination_country and self.get_parent():
            parent = self.get_parent().specific
            if parent.__class__.__name__ == "Destination":
                self.destination_country = parent

        # Generate name and name_full
        if self.departure_airport_code and self.arrival_airport_code:
            self.name = f"{self.departure_airport_code}-{self.arrival_airport_code}"
        if self.departure_airport and self.arrival_airport:
            self.name_full = f"{self.departure_airport} to {self.arrival_airport}"

        # Run full validation (including clean) before saving
        self.full_clean()
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Route Page"
        unique_together = [["departure_airport_code", "arrival_airport_code"]]


@register_query_field("special")
class Special(BasePage):
    name = models.CharField(max_length=20, null=True, blank=True)
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
        MultiFieldPanel(
            [
                FieldPanel("name", heading="Special Name"),
                FieldPanel("start_date", heading="Start Date"),
                FieldPanel("end_date", heading="End Date"),
                FieldPanel("terms_and_conditions", heading="Terms and Conditions"),
            ],
            heading="Special Details",
        ),
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
        GraphQLString("name", name="specialName"),
    ]

    parent_page_types = ["explore.SpecialsIndexPage"]

    class Meta:
        verbose_name = "Specials Page"


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


class WhereWeFly(BasePage):
    max_count = 1

    description = RichTextField(
        features=["bold", "italic", "link"],
        blank=True,
        help_text="A short description of the page",
    )

    domestic_routes = models.ForeignKey(
        "wagtailimages.Image",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
        help_text="Image of your domestic routes",
    )

    international_routes = models.ForeignKey(
        "wagtailimages.Image",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
        help_text="Image of your international routes",
    )

    content_panels = BasePage.content_panels + [
        FieldPanel("description", heading="Description"),
        FieldPanel("domestic_routes", heading="Domestic Routes"),
        FieldPanel("international_routes", heading="International Routes"),
    ]

    graphql_fields = BasePage.graphql_fields + [
        GraphQLString("description"),
        GraphQLImage("domestic_routes", name="domesticRoutes"),
        GraphQLImage("international_routes", name="internationalRoutes"),
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
