from django.db import models
from wagtail.models import Page
from wagtail.admin.panels import FieldPanel, FieldRowPanel
from grapple.models import (
    GraphQLImage,
    GraphQLStreamfield,
    GraphQLString,
    GraphQLBoolean,
)
from grapple.helpers import register_query_field
from wagtail.fields import StreamField, RichTextField
from .blocks import (
    TextBlock,
    ImageBlock,
    FullWidthImageBlock,
    SectionBlock,
    GridCardSectionBlock,
    HeadingTextBlock,
    DataTableBlock,
    MegaMenuBlock,
    MegaMenuColumnBlock,
    AccordionBlock,
    SimpleDropdownBlock,
)
from wagtail.blocks import ListBlock

from grapple.helpers import register_query_field
from wagtail.snippets.models import register_snippet
from django.core.exceptions import ValidationError


class BasePage(Page):
    hero_title = models.CharField(
        max_length=255, blank=False, help_text="Page title or tagline for hero section"
    )
    hero_image = models.ForeignKey(
        "wagtailimages.Image",
        null=True,
        blank=False,
        on_delete=models.SET_NULL,
        related_name="+",
        help_text="Image that will be displayed on this page's hero section",
    )

    svg_icon = models.ForeignKey(
        "wagtailimages.Image",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
        help_text="SVG icon for the page, used in other sections.",
    )

    sub_title = models.CharField(
        max_length=100,
        blank=True,
        help_text="A short subtitle for the page.",
    )

    description = RichTextField(
        features=["bold", "italic"],
        blank=True,
        help_text="A description of the page.",
    )

    content_panels = Page.content_panels + [
        FieldRowPanel(
            [
                FieldPanel("hero_image", heading="Hero Image"),
                FieldPanel("svg_icon", heading="SVG Icon"),
            ]
        ),
        FieldPanel("description", heading="Description"),
        FieldPanel("sub_title", heading="Subtitle"),
    ]

    graphql_fields = [
        GraphQLString("hero_title", name="heroTitle"),
        GraphQLImage("hero_image", name="heroImage"),
        GraphQLImage("svg_icon", name="svgIcon"),
        GraphQLString("description", name="description"),
        GraphQLString("sub_title", name="subTitle"),
    ]

    def clean(self):
        self.hero_title = self.title
        super().clean()

    # def save(self, *args, **kwargs):
    #     # Set hero_title to match title before saving
    #     self.hero_title = self.title
    #     super().save(*args, **kwargs)

    class Meta:
        abstract = True


@register_query_field("generic_page")
class GenericPage(BasePage):
    content = StreamField(
        [
            ("text", TextBlock()),
            ("image", ImageBlock()),
            ("full_width_image", FullWidthImageBlock()),
            ("section", SectionBlock()),
            ("grid_card_section", GridCardSectionBlock()),
            ("heading_text", HeadingTextBlock()),
            ("table", DataTableBlock()),
            ("accordion", AccordionBlock()),
            ("simple_dropdown", SimpleDropdownBlock()),
        ],
        use_json_field=True,
        blank=True,
        help_text="Add and arrange content blocks to build the page.",
    )

    # Widget inclusion fields - only one can be true at a time
    include_manage_booking_widget = models.BooleanField(
        default=False,
    )

    include_flight_upgrade_widget = models.BooleanField(
        default=False,
    )

    content_panels = BasePage.content_panels + [
        FieldRowPanel(
            [
                FieldPanel(
                    "include_manage_booking_widget",
                    heading="Include Manage My Booking Widget",
                ),
                FieldPanel(
                    "include_flight_upgrade_widget",
                    heading="Include Flight Upgrade Widget",
                ),
            ],
            heading="Widget Options (Only one can be selected)",
        ),
        FieldPanel("content"),
    ]

    graphql_fields = BasePage.graphql_fields + [
        GraphQLStreamfield("content"),
        GraphQLBoolean(
            "include_manage_booking_widget", name="includeManageBookingWidget"
        ),
        GraphQLBoolean(
            "include_flight_upgrade_widget", name="includeFlightUpgradeWidget"
        ),
    ]

    def clean(self):
        super().clean()
        # Validate that only one widget can be selected at a time
        if self.include_manage_booking_widget and self.include_flight_upgrade_widget:
            raise ValidationError(
                {
                    "include_manage_booking_widget": "Only one widget type can be selected at a time.",
                    "include_flight_upgrade_widget": "Only one widget type can be selected at a time.",
                }
            )

    subpage_types = [
        "core.GenericPage",
    ]

    parent_page_types = [
        "explore.ExploreIndexPage",
        "experience.ExperienceIndexPage",
        "core.GenericPage",
    ]

    class Meta:
        verbose_name = "Generic Page"
        verbose_name_plural = "Generic Pages"


# header
@register_query_field("header_menu")
class HeaderMenu(models.Model):
    name = models.CharField(
        max_length=100, help_text="Name of the menu (e.g., Main Menu)"
    )
    menu_items = StreamField(
        [
            ("mega_menu_item", MegaMenuBlock()),
        ],
        use_json_field=True,
        blank=True,
    )

    panels = [
        FieldPanel("name"),
        FieldPanel("menu_items"),
    ]

    graphql_fields = [
        GraphQLString("name"),
        GraphQLStreamfield("menu_items"),
    ]

    def clean(self):
        # Ensure only one HeaderMenu instance exists
        if HeaderMenu.objects.exclude(id=self.id).exists():
            raise ValidationError(
                "Only one HeaderMenu instance is allowed. Please edit the existing Header Menu instead of creating a new one."
            )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Header Menu"
        verbose_name_plural = "Header Menu"


# footer
@register_query_field("footer_menu")
class FooterMenu(models.Model):
    name = models.CharField(
        max_length=100, help_text="Name of the footer menu (e.g., Footer Menu)"
    )
    menu_items = StreamField(
        [
            ("mega_menu_item", ListBlock(MegaMenuColumnBlock())),
        ],
        use_json_field=True,
        blank=True,
    )

    panels = [
        FieldPanel("name"),
        FieldPanel("menu_items"),
    ]

    graphql_fields = [
        GraphQLString("name"),
        GraphQLStreamfield("menu_items"),
    ]

    def clean(self):
        # Ensure only one FooterMenu instance exists
        if FooterMenu.objects.exclude(id=self.id).exists():
            raise ValidationError(
                "Only one FooterMenu instance is allowed. Please edit the existing Footer Menu instead of creating a new one."
            )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Footer Menu"
        verbose_name_plural = "Footer Menu"


@register_query_field("currency", "currencies")
class Currency(models.Model):
    country_name = models.CharField(max_length=100, help_text="Name of the country")
    country_code = models.CharField(
        max_length=10, help_text="Country code (e.g., SB, AU, NZ)"
    )
    currency_name = models.CharField(max_length=100, help_text="Name of the currency")
    currency_code = models.CharField(
        max_length=10, help_text="Currency code (e.g., USD, EUR)"
    )
    currency_symbol = models.CharField(
        max_length=10, help_text="Symbol for the currency (e.g., $, €)"
    )
    flag_image = models.ForeignKey(
        "wagtailimages.Image",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
        help_text="Flag icon for the country",
    )

    panels = [
        FieldPanel("country_name"),
        FieldPanel("country_code"),
        FieldPanel("currency_name"),
        FieldPanel("currency_code"),
        FieldPanel("currency_symbol"),
        FieldPanel("flag_image"),
    ]

    graphql_fields = [
        GraphQLString("country_name", name="countryName"),
        GraphQLString("country_code", name="countryCode"),
        GraphQLString("currency_name", name="currencyName"),
        GraphQLString("currency_code", name="currencyCode"),
        GraphQLString("currency_symbol", name="currencySymbol"),
        GraphQLImage("flag_image", name="flagImage"),
    ]

    def __str__(self):
        return f"{self.country_name} - {self.currency_name} ({self.currency_code})"

    class Meta:
        verbose_name = "Currency"
        verbose_name_plural = "Currencies"
