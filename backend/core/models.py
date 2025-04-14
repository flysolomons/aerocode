from django.db import models
from wagtail.models import Page
from wagtail.admin.panels import FieldPanel
from grapple.models import GraphQLRichText, GraphQLImage


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
        GraphQLRichText("hero_title", name="heroTitle"),
        GraphQLImage("hero_image", name="heroImage"),
    ]

    def save(self, *args, **kwargs):
        # Set hero_title to match title before saving
        self.hero_title = self.title
        super().save(*args, **kwargs)

    class Meta:
        abstract = True
