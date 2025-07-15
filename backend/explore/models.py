from core.models import BasePage
from wagtail.search import index
from modelcluster.fields import ParentalManyToManyField, ParentalKey
from wagtail.fields import RichTextField, StreamField
from wagtail.admin.panels import FieldPanel, MultiFieldPanel, InlinePanel, FieldRowPanel
from wagtail.models import Orderable
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
from django.utils import timezone
import pytz
from .blocks import PeriodBlock


class ExploreIndexPage(BasePage):
    max_count = 1

    # description = RichTextField(
    #     features=["bold", "italic", "link"],
    #     blank=True,
    #     help_text="A short description of the page",
    # )
    content_panels = BasePage.content_panels + [
        # FieldPanel("description", heading="Description"),
    ]
    graphql_fields = BasePage.graphql_fields + [
        # GraphQLString("description"),
    ]
    parent_page_types = ["home.HomePage"]

    class Meta:
        verbose_name = "Explore Index Page"


class DestinationIndexPage(BasePage):
    max_count = 1

    # description = RichTextField(
    #     features=["bold", "italic", "link"],
    #     blank=True,
    #     help_text="A short description of the page",
    # )
    content_panels = BasePage.content_panels + [
        # FieldPanel("description", heading="Description"),
    ]
    graphql_fields = BasePage.graphql_fields + [
        # GraphQLString("description"),
    ]
    parent_page_types = ["explore.ExploreIndexPage"]

    class Meta:
        verbose_name = "Destination Index Page"


@register_query_field("destination")
class Destination(BasePage):
    country = models.CharField(
        max_length=255, blank=False, help_text="Name of Country/Destination"
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
        InlinePanel(
            "ranked_routes",
            label="Route Display Order",
            help_text="Drag and drop to reorder how routes appear on this destination page. Routes are automatically populated based on routes to this destination.",
            panels=None,  # Use default panels from DestinationRoute.panels
        ),
    ]

    graphql_fields = BasePage.graphql_fields + [
        GraphQLStreamfield("reasons_to_visit"),
        GraphQLStreamfield("travel_requirements"),
        GraphQLCollection(GraphQLForeignKey, "routes", "explore.Route"),
        GraphQLCollection(
            GraphQLForeignKey, "ranked_routes", "explore.DestinationRoute"
        ),
        GraphQLString("country"),
    ]

    parent_page_types = ["explore.DestinationIndexPage"]

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Auto-populate route rankings for all routes to this destination
        self.populate_route_rankings()

    def populate_route_rankings(self):
        """Auto-create DestinationRoute entries for all routes to this destination"""
        # Get all routes that go to this destination
        routes_to_destination = Route.objects.filter(destination_country=self)

        # Create DestinationRoute entries for any missing routes
        for index, route in enumerate(routes_to_destination):
            destination_route, created = DestinationRoute.objects.get_or_create(
                destination=self,
                route=route,
                defaults={
                    "sort_order": DestinationRoute.objects.filter(
                        destination=self
                    ).count()
                },
            )
            # If this is a new route ranking and we have existing ones,
            # make sure sort_order is properly set
            if created:
                max_sort_order = (
                    DestinationRoute.objects.filter(destination=self)
                    .exclude(pk=destination_route.pk)
                    .aggregate(max_order=models.Max("sort_order"))["max_order"]
                    or -1
                )
                destination_route.sort_order = max_sort_order + 1
                destination_route.save()

    class Meta:
        verbose_name = "Destination Page"


class DestinationRoute(Orderable):
    """Intermediate model for ranking routes within destinations"""

    destination = ParentalKey(
        "explore.Destination", on_delete=models.CASCADE, related_name="ranked_routes"
    )
    route = models.ForeignKey(
        "explore.Route", on_delete=models.CASCADE, related_name="destination_rankings"
    )

    panels = [
        FieldPanel("route", read_only=True),
    ]

    graphql_fields = [
        GraphQLForeignKey("route", "explore.Route"),
        GraphQLString("sort_order", name="sortOrder"),
    ]

    class Meta:
        verbose_name = "Destination Route"
        verbose_name_plural = "Destination Routes"
        ordering = ["sort_order"]
        unique_together = ["destination", "route"]

    def __str__(self):
        return f"{self.route.name_full}"


@register_query_field("route")
class Route(BasePage):
    destination_country = models.ForeignKey(
        "explore.Destination",
        null=True,
        blank=False,
        on_delete=models.SET_NULL,
        related_name="routes",
        help_text="Destination country for the route",
    )

    flight_scope = models.CharField(
        max_length=20,
        choices=[
            ("international route", "International Route"),
            ("domestic route", "Domestic Route"),
        ],
        default="international route",
        blank=False,
        help_text="Scope of the flight route (International or Domestic)",
    )

    departure_airport = models.CharField(
        max_length=255, blank=False, help_text="Departure airport for the route"
    )
    arrival_airport = models.CharField(
        max_length=255, blank=False, help_text="Arrival airport for the route"
    )
    departure_airport_code = models.CharField(
        max_length=3, blank=False, help_text="IATA code for the departure airport"
    )
    arrival_airport_code = models.CharField(
        max_length=3, blank=False, help_text="IATA code for the arrival airport"
    )

    name = models.CharField(max_length=20, null=True, blank=True, unique=True)
    name_full = models.CharField(
        max_length=255, null=True, blank=True, help_text="Full name of the route"
    )

    content_panels = BasePage.content_panels + [
        FieldPanel("flight_scope", heading="Flight Scope"),
        FieldPanel("departure_airport", heading="Departure Airport"),
        FieldPanel("arrival_airport", heading="Arrival Airport"),
        FieldPanel("departure_airport_code", heading="Departure Airport Code"),
        FieldPanel("arrival_airport_code", heading="Arrival Airport Code"),
    ]

    search_fields = BasePage.search_fields + [
        index.SearchField("arrival_airport", partial_match=True),
        index.SearchField("arrival_airport_code", partial_match=True),
        index.RelatedFields(
            "destination_country",
            [
                index.SearchField("country", partial_match=True),
            ],
        ),
        index.SearchField("flight_scope", partial_match=True),
    ]

    graphql_fields = BasePage.graphql_fields + [
        GraphQLString("departure_airport", name="departureAirport"),
        GraphQLString("arrival_airport", name="arrivalAirport"),
        GraphQLString("departure_airport_code", name="departureAirportCode"),
        GraphQLString("arrival_airport_code", name="arrivalAirportCode"),
        GraphQLForeignKey("destination_country", "explore.Destination"),
        GraphQLString("name", name="routeName"),
        GraphQLString("name_full", name="routeNameFull"),
        # GraphQLCollection(GraphQLForeignKey, "specials", "explore.Special"),
        GraphQLCollection(GraphQLForeignKey, "fares", "fares.Fare"),
        GraphQLCollection(GraphQLForeignKey, "special_routes", "explore.SpecialRoute"),
        GraphQLString("flight_scope", name="flightScope"),
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

        # Auto-create DestinationRoute ranking if destination_country is set
        if self.destination_country:
            destination_route, created = DestinationRoute.objects.get_or_create(
                destination=self.destination_country,
                route=self,
                defaults={"sort_order": 0},
            )
            # If this is a new route ranking, set proper sort_order
            if created:
                max_sort_order = (
                    DestinationRoute.objects.filter(
                        destination=self.destination_country
                    )
                    .exclude(pk=destination_route.pk)
                    .aggregate(max_order=models.Max("sort_order"))["max_order"]
                    or -1
                )
                destination_route.sort_order = max_sort_order + 1
                destination_route.save()

    class Meta:
        verbose_name = "Route Page"
        unique_together = [["departure_airport_code", "arrival_airport_code"]]


@register_query_field("special")
class Special(BasePage):
    name = models.CharField(
        max_length=20,
        null=True,
        blank=False,
        help_text="Name of this special.",
    )

    start_date = models.DateField(
        null=True, blank=False, help_text="Start date of the flight special"
    )

    end_date = models.DateField(
        null=True, blank=False, help_text="End date of the flight special"
    )

    travel_periods = StreamField(
        [
            ("travel_period", PeriodBlock()),
        ],
        blank=True,
        help_text="Periods during which this special is valid. Specify start and end dates.",
        use_json_field=True,
    )

    discount = models.CharField(max_length=20, null=True, blank=False)

    booking_class = models.CharField(
        max_length=20,
        null=True,
        blank=False,
        # help_text="Class of booking for this flight special",
    )

    trip_type = models.CharField(
        max_length=20,
        choices=[
            ("one way", "One Way"),
            ("return", "Return"),
        ],
        default="Return",
    )

    flight_scope = models.CharField(
        max_length=20,
        choices=[
            ("international routes", "International Routes"),
            ("domestic routes", "Domestic Routes"),
        ],
        default="international routes",
    )

    special_code = models.CharField(
        max_length=50,
        null=True,
        blank=False,
        unique=True,
        help_text="Unique ID for this flight special - used for tracking purposes only.",
    )

    terms_and_conditions = RichTextField(
        features=["bold", "italic", "link"],
        blank=True,
        help_text="Terms and conditions for the flight special",
    )

    content_panels = BasePage.content_panels + [
        MultiFieldPanel(
            [
                FieldRowPanel(
                    [
                        FieldPanel("name", heading="Special Name"),
                        FieldPanel("special_code", heading="Special ID"),
                    ]
                ),
                FieldRowPanel(
                    [
                        FieldPanel("start_date", heading="Start Date"),
                        FieldPanel("end_date", heading="End Date"),
                    ]
                ),
                FieldPanel("travel_periods", heading="Travel Periods"),
                FieldRowPanel(
                    [
                        FieldPanel("trip_type", heading="Trip Type"),
                        FieldPanel("flight_scope", heading="Flight Scope"),
                    ]
                ),
                FieldRowPanel(
                    [
                        FieldPanel("booking_class", heading="Booking Class"),
                        FieldPanel("discount", heading="Discount"),
                    ]
                ),
                FieldPanel("terms_and_conditions", heading="Terms and Conditions"),
            ],
            heading="Special Details",
        ),
        InlinePanel(
            "special_routes",
            label="Associated Routes and their Starting Prices",
            panels=[
                FieldPanel("route", widget=forms.Select),
                FieldPanel("trip_type"),
                FieldPanel("starting_price"),
                FieldPanel("currency", widget=forms.Select),
            ],
            help_text="Specify starting prices for routes associated with this special.",
        ),
    ]

    @property
    def is_expired(self):
        """Check if this special has expired based on its end date using Solomon Islands timezone."""
        if self.end_date:
            # Use Solomon Islands timezone (Pacific/Guadalcanal)
            solomon_tz = pytz.timezone("Pacific/Guadalcanal")
            solomon_now = timezone.now().astimezone(solomon_tz).date()
            return solomon_now > self.end_date
        return False

    graphql_fields = BasePage.graphql_fields + [
        GraphQLString("start_date", name="startDate"),
        GraphQLString("end_date", name="endDate"),
        GraphQLStreamfield("travel_periods", name="travelPeriods"),
        GraphQLString("discount"),
        GraphQLString("trip_type", name="tripType"),
        GraphQLString("booking_class", name="bookingClass"),
        GraphQLString("flight_scope", name="flightScope"),
        GraphQLString("terms_and_conditions", name="termsAndConditions"),
        GraphQLCollection(GraphQLForeignKey, "special_routes", "explore.SpecialRoute"),
        GraphQLString("name", name="specialName"),
        GraphQLString("is_expired", name="isExpired"),
    ]

    parent_page_types = ["explore.SpecialsIndexPage"]

    class Meta:
        verbose_name = "Specials Page"


class SpecialRoute(models.Model):
    special = ParentalKey(
        Special,
        null=True,
        blank=True,
        related_name="special_routes",
        on_delete=models.CASCADE,
    )

    route = ParentalKey(
        Route,
        null=True,
        blank=True,
        related_name="special_routes",
        on_delete=models.CASCADE,
    )

    starting_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Starting price for this special on this route",
    )

    trip_type = models.CharField(
        max_length=20,
        choices=[
            ("one way", "One Way"),
            ("return", "Return"),
        ],
        default="one way",
    )

    currency = models.ForeignKey(
        "core.Currency",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="special_routes",
        help_text="Currency for the starting price",
    )

    panels = [
        FieldPanel("route", widget=forms.Select),
        FieldPanel("starting_price"),
        FieldPanel("currency", widget=forms.Select),
        FieldPanel("trip_type"),
    ]

    def get_trip_type_display(self):
        """Return the human-readable trip type."""
        return dict(self._meta.get_field("trip_type").choices).get(
            self.trip_type, self.trip_type
        )

    @property
    def is_expired(self):
        """Check if this special route has expired based on the special's end date using Solomon Islands timezone."""
        if self.special and self.special.end_date:
            # Use Solomon Islands timezone (Pacific/Guadalcanal)
            solomon_tz = pytz.timezone("Pacific/Guadalcanal")
            solomon_now = timezone.now().astimezone(solomon_tz).date()
            return solomon_now > self.special.end_date
        return False

    graphql_fields = [
        GraphQLString("starting_price", name="startingPrice"),
        GraphQLForeignKey("currency", "core.Currency"),
        GraphQLForeignKey("route", "explore.Route"),
        GraphQLForeignKey("special", "explore.Special"),
        GraphQLString("is_expired", name="isExpired"),
    ]

    def __str__(self):
        return f"{self.special.name} - ({self.route.name_full}) at {self.currency.currency_code} {self.starting_price}"

    class Meta:
        verbose_name = "Special Route"
        unique_together = [["special", "route"]]


class SpecialsIndexPage(BasePage):
    max_count = 1

    # description = RichTextField(
    #     features=["bold", "italic", "link"],
    #     blank=True,
    #     help_text="A short description of the page",
    # )
    content_panels = BasePage.content_panels + [
        # FieldPanel("description", heading="Description"),
    ]
    graphql_fields = BasePage.graphql_fields + [
        # GraphQLString("description"),
    ]
    parent_page_types = ["explore.ExploreIndexPage"]

    class Meta:
        verbose_name = "Specials Index Page"


class WhereWeFly(BasePage):
    max_count = 1

    # description = RichTextField(
    #     features=["bold", "italic", "link"],
    #     blank=True,
    #     help_text="A short description of the page",
    # )

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
        # FieldPanel("description", heading="Description"),
        FieldPanel("domestic_routes", heading="Domestic Routes"),
        FieldPanel("international_routes", heading="International Routes"),
    ]

    graphql_fields = BasePage.graphql_fields + [
        # GraphQLString("description"),
        GraphQLImage("domestic_routes", name="domesticRoutes"),
        GraphQLImage("international_routes", name="internationalRoutes"),
    ]

    parent_page_types = ["explore.ExploreIndexPage"]

    class Meta:
        verbose_name = "Where We Fly Page"


class FlightSchedule(BasePage):
    max_count = 1

    # description = RichTextField(
    #     features=["bold", "italic", "link"],
    #     blank=True,
    #     help_text="A short description of the page",
    # )
    content_panels = BasePage.content_panels + [
        # FieldPanel("description", heading="Description"),
    ]
    graphql_fields = BasePage.graphql_fields + [
        # GraphQLString("description"),
    ]
    parent_page_types = ["explore.ExploreIndexPage"]

    class Meta:
        verbose_name = "Flight Schedule Page"
