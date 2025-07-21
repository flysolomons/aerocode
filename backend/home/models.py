from django.db import models
from wagtail.models import Page
from wagtail.admin.panels import FieldPanel
from grapple.models import (
    GraphQLImage,
    GraphQLCollection,
    GraphQLForeignKey,
    GraphQLString,
    GraphQLInt,
)
from core.models import BasePage
from wagtail.admin.panels import PageChooserPanel
from modelcluster.fields import ParentalKey
from wagtail.admin.panels import InlinePanel
from datetime import date
from wagtail.fields import RichTextField
from wagtail.snippets.models import register_snippet


@register_snippet
class CarouselSlide(models.Model):
    title = models.CharField(max_length=200, help_text="Title for the carousel slide")
    image = models.ForeignKey(
        "wagtailimages.Image",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
        help_text="Background image for the carousel slide",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    panels = [
        FieldPanel("title"),
        FieldPanel("image"),
    ]

    graphql_fields = [
        GraphQLString("title"),
        GraphQLImage("image"),
    ]

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Carousel Slide"
        verbose_name_plural = "Carousel Slides"
        ordering = ["-created_at"]


class HomePageCarouselSlide(models.Model):
    homepage = ParentalKey(
        "home.HomePage",
        related_name="carousel_slides",
        on_delete=models.CASCADE,
    )
    slide = models.ForeignKey(
        "home.CarouselSlide",
        on_delete=models.CASCADE,
        related_name="homepage_associations",
    )
    sort_order = models.PositiveIntegerField(
        default=0,
        help_text="Order in which the slide appears in the carousel (lower numbers appear first)",
    )

    panels = [
        FieldPanel("slide"),
        FieldPanel("sort_order"),
    ]

    graphql_fields = [
        GraphQLForeignKey("slide", "home.CarouselSlide"),
        GraphQLInt("sort_order", name="sortOrder"),
    ]

    class Meta:
        unique_together = ("homepage", "slide")
        ordering = ["sort_order"]


class AllYouNeedPage(models.Model):
    homepage = ParentalKey(
        "home.HomePage",
        related_name="all_you_need_items",
        on_delete=models.CASCADE,
    )
    page = models.ForeignKey(
        "wagtailcore.Page", on_delete=models.CASCADE, related_name="+"
    )
    panels = [
        PageChooserPanel("page", heading="Page"),
    ]

    @property
    def page_description(self):
        # Use .specific to get the subclass instance, then access description
        return getattr(self.page.specific, "description", None)

    @property
    def page_url(self):
        return self.page.specific.url if hasattr(self.page.specific, "url") else None

    @property
    def page_hero_title(self):
        return getattr(self.page.specific, "hero_title", None)

    @property
    def page_svg_icon(self):
        return getattr(self.page.specific, "svg_icon", None)

    graphql_fields = [
        GraphQLString("page_description", name="pageDescription"),
        GraphQLString("page_url", name="pageUrl"),
        GraphQLString("page_hero_title", name="pageHeroTitle"),
        GraphQLImage("page_svg_icon", name="pageSvgIcon"),
    ]

    class Meta:
        unique_together = ("homepage", "page")


class HomePageSpecialRoute(models.Model):
    homepage = ParentalKey(
        "home.HomePage",
        related_name="special_route_items",
        on_delete=models.CASCADE,
    )
    special_route = models.ForeignKey(
        "explore.SpecialRoute",
        on_delete=models.CASCADE,
        related_name="home_page_specials",
        limit_choices_to={"special__end_date__gte": date.today()},
    )
    panels = [
        FieldPanel("special_route"),
    ]

    graphql_fields = [
        GraphQLForeignKey("special_route", "explore.SpecialRoute", name="specialRoute"),
    ]

    class Meta:
        unique_together = ("homepage", "special_route")


class HomePage(Page):
    max_count = 1  # Only one homepage

    # belama section
    belama_image = models.ForeignKey(
        "wagtailimages.Image",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
        help_text="Image for the Belama section on the homepage",
    )

    content_panels = Page.content_panels + [
        InlinePanel("carousel_slides", label="Carousel Slides", max_num=5),
        InlinePanel("special_route_items", label="Flight Special", max_num=3),
        FieldPanel("belama_image", heading="Belama Promotional Image"),
        InlinePanel("all_you_need_items", label="All You Need Item", max_num=6),
    ]

    graphql_fields = [
        GraphQLCollection(
            GraphQLForeignKey, "carousel_slides", "home.HomePageCarouselSlide"
        ),
        GraphQLImage("belama_image", name="belamaImage"),
        GraphQLCollection(
            GraphQLForeignKey, "special_route_items", "home.HomePageSpecialRoute"
        ),
        GraphQLCollection(
            GraphQLForeignKey, "all_you_need_items", "home.AllYouNeedPage"
        ),
    ]

    def get_context(self, request):
        context = super().get_context(request)
        context["special_routes"] = [
            item.special_route for item in self.special_route_items.all()
        ]
        return context

    class Meta:
        verbose_name = "Home Page"
