from django.db import models
from wagtail.admin.panels import FieldPanel
from grapple.models import (
    GraphQLImage,
    GraphQLCollection,
    GraphQLForeignKey,
    GraphQLPage,
    GraphQLString,
)
from core.models import BasePage
from wagtail.admin.panels import PageChooserPanel
from modelcluster.fields import ParentalKey
from wagtail.admin.panels import InlinePanel


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
    )
    panels = [
        FieldPanel("special_route"),
    ]

    graphql_fields = [
        GraphQLForeignKey("special_route", "explore.SpecialRoute", name="specialRoute"),
    ]

    class Meta:
        unique_together = ("homepage", "special_route")


class HomePage(BasePage):
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

    content_panels = BasePage.content_panels + [
        InlinePanel("special_route_items", label="Flight Special", max_num=3),
        FieldPanel("belama_image", heading="Belama Promotional Image"),
        InlinePanel("all_you_need_items", label="All You Need Item", max_num=6),
    ]

    graphql_fields = BasePage.graphql_fields + [
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
