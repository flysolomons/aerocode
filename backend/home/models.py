from django.db import models
from wagtail.admin.panels import FieldPanel
from grapple.models import GraphQLRichText
from core.models import BasePage


class HomePage(BasePage):
    max_count = 1  # Only one homepage

    content_panels = BasePage.content_panels  # Inherit from BasePage

    # Use inherited graphql_fields from BasePage, or override if needed
    graphql_fields = BasePage.graphql_fields  # Explicitly inherit for clarity

    def get_context(self, request):
        context = super().get_context(request)
        return context

    class Meta:
        verbose_name = "Home Page"
