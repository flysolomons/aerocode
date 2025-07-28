from django.db import models
from core.models import BasePage
from wagtail.admin.panels import FieldPanel
from grapple.models import GraphQLString, GraphQLStreamfield, GraphQLImage
from wagtail.fields import StreamField
from core.blocks import ContactCategoryBlock


class ContactPage(BasePage):
    max_count = 1

    contact_sections = StreamField(
        [("contact_category", ContactCategoryBlock())],
        use_json_field=True,
        blank=True,
        help_text="Add contact categories with their methods and subcategories",
        verbose_name="Contact Sections",
    )

    content_panels = BasePage.content_panels + [
        FieldPanel("contact_sections", heading="Contact Information"),
    ]

    graphql_fields = BasePage.graphql_fields + [
        GraphQLStreamfield("contact_sections", name="contactSections"),
    ]

    parent_page_types = ["home.HomePage"]

    class Meta:
        verbose_name = "Contact Page"
