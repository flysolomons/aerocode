from django.db import models
from core.models import BasePage
from wagtail.admin.panels import FieldPanel
from grapple.models import GraphQLString, GraphQLStreamfield, GraphQLImage
from wagtail.fields import StreamField
from core.blocks import ContactCategoryBlock


class ContactPage(BasePage):
    max_count = 1

    email = models.EmailField(
        blank=True,
        help_text="Contact email address",
        verbose_name="Email",
    )

    contact_sections = StreamField(
        [("contact_category", ContactCategoryBlock())],
        use_json_field=True,
        blank=True,
        help_text="Add contact categories with their methods and subcategories",
        verbose_name="Contact Sections",
    )

    # Call to action section fields
    call_to_action_image = models.ForeignKey(
        "wagtailimages.Image",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
        help_text="Background image for the call to action section",
    )

    call_to_action_title = models.CharField(
        max_length=100,
        blank=True,
        help_text="Title for the call to action section",
        verbose_name="Call to Action Title",
    )

    call_to_action_subtitle = models.CharField(
        max_length=200,
        blank=True,
        help_text="Subtitle for the call to action section",
        verbose_name="Call to Action Subtitle",
    )

    content_panels = BasePage.content_panels + [
        FieldPanel("email"),
        FieldPanel("contact_sections", heading="Contact Information"),
        FieldPanel("call_to_action_image", heading="Call to Action Image"),
        FieldPanel("call_to_action_title", heading="Call to Action Title"),
        FieldPanel("call_to_action_subtitle", heading="Call to Action Subtitle"),
    ]

    graphql_fields = BasePage.graphql_fields + [
        GraphQLString("email", name="email"),
        GraphQLStreamfield("contact_sections", name="contactSections"),
        GraphQLImage("call_to_action_image", name="callToActionImage"),
        GraphQLString("call_to_action_title", name="callToActionTitle"),
        GraphQLString("call_to_action_subtitle", name="callToActionSubtitle"),
    ]

    parent_page_types = ["home.HomePage"]

    class Meta:
        verbose_name = "Contact Page"
