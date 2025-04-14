from django.db import models
from core.models import BasePage

# Create your models here.
from wagtail.fields import RichTextField, StreamField
from wagtail.admin.panels import FieldPanel
from grapple.models import GraphQLRichText, GraphQLString, GraphQLStreamfield

# from wagtail.images.blocks import ImageChooserBlock
# from wagtail.blocks import CharBlock, RichTextBlock
from wagtail.search import index


class NewsIndexPage(BasePage):
    max_count = 1
    content_panels = BasePage.content_panels
    graphql_fields = BasePage.graphql_fields
    parent_page_types = ["home.HomePage"]


class NewsArticle(BasePage):
    date = models.DateField("Post date")
    article_title = models.CharField(
        max_length=255, blank=True, help_text="Article title"
    )
    body = RichTextField(blank=True)

    search_fields = BasePage.search_fields + [
        index.SearchField("article_title"),
    ]

    content_panels = BasePage.content_panels + [
        FieldPanel("date"),
        FieldPanel("article_title"),
        FieldPanel("body"),
    ]

    graphql_fields = BasePage.graphql_fields + [
        GraphQLString("date"),
        GraphQLString("article_title"),
        GraphQLRichText("body"),
    ]

    parent_page_types = ["news.NewsIndexPage"]
    subpage_types = []
