from django.db import models
from django.core.exceptions import ValidationError
from wagtail.models import Page
from wagtail.admin.panels import FieldPanel
from wagtail.fields import RichTextField
from core.models import BasePage
from grapple.models import (
    GraphQLString,
    GraphQLBoolean,
    GraphQLForeignKey,
    GraphQLCollection,
)
from grapple.helpers import register_query_field


class TravelAlert(models.Model):
    title = models.CharField(max_length=255)
    content = RichTextField()
    is_active = models.BooleanField(
        default=False, help_text="Only one alert can be active at a time"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    panels = [
        FieldPanel("title"),
        FieldPanel("content"),
        FieldPanel("is_active"),
    ]

    graphql_fields = [
        GraphQLString("title"),
        GraphQLString("content"),
        GraphQLBoolean("is_active"),
        GraphQLString("created_at"),
    ]

    def clean(self):
        super().clean()
        # If this alert is being set to active, deactivate all others
        if self.is_active:
            TravelAlert.objects.filter(is_active=True).exclude(pk=self.pk).update(
                is_active=False
            )

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Travel Alert"
        verbose_name_plural = "Travel Alerts"


class TravelAlertPage(BasePage):
    max_count = 1

    content_panels = BasePage.content_panels

    graphql_fields = BasePage.graphql_fields + [
        GraphQLForeignKey("active_alert", "alerts.TravelAlert", required=False),
        GraphQLCollection(
            GraphQLForeignKey, "all_alerts", "alerts.TravelAlert", required=False
        ),
    ]

    parent_page_types = [
        "home.HomePage",
    ]

    @property
    def active_alert(self):
        """Return the currently active alert, if any."""
        try:
            return TravelAlert.objects.get(is_active=True)
        except TravelAlert.DoesNotExist:
            return None

    @property
    def all_alerts(self):
        """Return all alerts ordered by creation date (newest first)."""
        return TravelAlert.objects.all()

    class Meta:
        verbose_name = "Travel Alerts Page"
