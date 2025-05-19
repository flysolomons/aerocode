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
)


class BasePage(Page):
    hero_title = models.CharField(
        max_length=255, blank=False, help_text="Page title or tagline for hero section"
    )
    hero_image = models.ForeignKey(
        "wagtailimages.Image",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
        help_text="Image that will be displayed on this page's hero section",
    )

    content_panels = Page.content_panels + [
        FieldPanel("hero_image", heading="Hero Image"),
    ]

    graphql_fields = [
        GraphQLString("hero_title", name="heroTitle"),
        GraphQLImage("hero_image", name="heroImage"),
    ]

    def save(self, *args, **kwargs):
        # Set hero_title to match title before saving
        self.hero_title = self.title
        super().save(*args, **kwargs)

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
