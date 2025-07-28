from django.db import models
from core.models import BasePage
from wagtail.fields import RichTextField
from wagtail.admin.panels import FieldPanel
from grapple.models import GraphQLString, GraphQLStreamfield, GraphQLImage
from wagtail.fields import StreamField
from core.blocks import (
    ValueCardBlock,
    JourneyItemBlock,
    StatBlock,
)


class AboutIndexPage(BasePage):
    max_count = 1

    mission_statement = RichTextField(
        features=["bold", "italic", "link"],
        blank=True,
        help_text="Solomon Airlines mission statement",
    )

    vision_statement = RichTextField(
        features=["bold", "italic", "link"],
        blank=True,
        help_text="Solomon Airlines vision statement",
    )

    values = StreamField(
        [("value_item", ValueCardBlock())],
        use_json_field=True,
        blank=True,
        help_text="Values of Solomon Airlines",
        verbose_name="Values",
    )

    stats = StreamField(
        [("stat_item", StatBlock())],
        use_json_field=True,
        blank=True,
        help_text="Some cool stats related to Solomon Airlines",
        verbose_name="Statistics",
    )

    journey = StreamField(
        [("journey_item", JourneyItemBlock())],
        use_json_field=True,
        blank=True,
        help_text="Add items to the Solomon Airlines journey timeline.",
        verbose_name="Journey Timeline",
    )

    call_to_action_image = models.ForeignKey(
        "wagtailimages.Image",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
        help_text="Background image for the call to action section",
    )

    content_panels = BasePage.content_panels + [
        FieldPanel("mission_statement", heading="Mission Statement"),
        FieldPanel("vision_statement", heading="Vision Statement"),
        FieldPanel("values", heading="Values"),
        FieldPanel("stats", heading="Statistics"),
        FieldPanel("journey", heading="Journey"),
        FieldPanel("call_to_action_image", heading="Call to Action Image"),
    ]

    graphql_fields = BasePage.graphql_fields + [
        GraphQLString("mission_statement", name="missionStatement"),
        GraphQLString("vision_statement", name="visionStatement"),
        GraphQLStreamfield("values", name="values"),
        GraphQLStreamfield("stats", name="stats"),
        GraphQLStreamfield("journey", name="journey"),
        GraphQLImage("call_to_action_image", name="callToActionImage"),
    ]

    parent_page_types = ["home.HomePage"]

    class Meta:
        verbose_name = "About Index Page"
