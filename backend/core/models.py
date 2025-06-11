from django.db import models
from wagtail.models import Page
from wagtail.admin.panels import FieldPanel
from grapple.models import (
    GraphQLImage,
    GraphQLStreamfield,
    GraphQLString,
)
from grapple.helpers import register_query_field
from wagtail.fields import StreamField
from .blocks import (
    TextBlock,
    ImageBlock,
    SectionBlock,
    GridCardSectionBlock,
    HeadingTextBlock,
    MegaMenuBlock,
    MegaMenuColumnBlock,
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

    description = models.CharField(
        max_length=255,
        blank=True,
        help_text="A short description of the page.",
    )

    content_panels = Page.content_panels + [
        FieldPanel("hero_image", heading="Hero Image"),
        FieldPanel("description", heading="Description"),
    ]

    graphql_fields = [
        GraphQLString("hero_title", name="heroTitle"),
        GraphQLImage("hero_image", name="heroImage"),
        GraphQLString("description", name="description"),
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
            ("section", SectionBlock()),
            ("grid_card_section", GridCardSectionBlock()),
            ("heading_text", HeadingTextBlock()),
        ],
        use_json_field=True,
        blank=True,
        help_text="Add and arrange content blocks to build the page.",
    )

    content_panels = BasePage.content_panels + [
        FieldPanel("content"),
    ]

    graphql_fields = BasePage.graphql_fields + [
        GraphQLStreamfield("content"),
    ]

    subpage_types = [
        "core.GenericPage",
    ]

    parent_page_types = [
        "explore.ExploreIndexPage",
        "experience.ExperienceIndexPage",
    ]

    class Meta:
        verbose_name = "Generic Page"
        verbose_name_plural = "Generic Pages"


# header
@register_snippet
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
@register_snippet
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


# snippet currency

# Name of the Contry
# Name of the currency
# Currency code
# Currency symbol
# Country flag


@register_snippet
@register_query_field("currency", "currencies")
class Currency(models.Model):
    country_name = models.CharField(max_length=100, help_text="Name of the country")
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
        FieldPanel("currency_name"),
        FieldPanel("currency_code"),
        FieldPanel("currency_symbol"),
        FieldPanel("flag_image"),
    ]

    graphql_fields = [
        GraphQLString("country_name", name="countryName"),
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
