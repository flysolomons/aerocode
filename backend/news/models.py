from django.db import models
from core.models import BasePage

# Create your models here.
from wagtail.fields import RichTextField, StreamField
from wagtail.admin.panels import FieldPanel
from grapple.models import (
    GraphQLRichText,
    GraphQLString,
    GraphQLStreamfield,
    GraphQLForeignKey,
)
from grapple.helpers import register_query_field
from wagtail.snippets.models import register_snippet

# from wagtail.images.blocks import ImageChooserBlock
# from wagtail.blocks import CharBlock, RichTextBlock
from wagtail.search import index


@register_snippet
@register_query_field("news_category", "news_categories")
class NewsCategory(models.Model):
    name = models.CharField(max_length=100, unique=True, help_text="Category name")
    slug = models.SlugField(
        max_length=100,
        unique=True,
        help_text="URL-friendly version of the category name",
    )
    description = models.TextField(
        blank=True, help_text="Brief description of what this category covers"
    )

    panels = [
        FieldPanel("name"),
        FieldPanel("slug"),
        FieldPanel("description"),
    ]

    graphql_fields = [
        GraphQLString("name"),
        GraphQLString("slug"),
        GraphQLString("description"),
    ]

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "News Category"
        verbose_name_plural = "News Categories"
        ordering = ["name"]


class NewsIndexPage(BasePage):
    max_count = 1
    content_panels = BasePage.content_panels
    graphql_fields = BasePage.graphql_fields
    parent_page_types = ["home.HomePage"]

    class Meta:
        verbose_name = "News Index Page"


@register_query_field("news_article")
class NewsArticle(BasePage):
    # date = models.DateField(help_text="The date of the news article")
    article_title = models.CharField(
        max_length=255, blank=False, help_text="The title of the news article"
    )
    body = RichTextField(blank=False, help_text="The content of the article")
    category = models.ForeignKey(
        NewsCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="articles",
        help_text="Select a category for this news article",
    )

    search_fields = BasePage.search_fields + [
        index.SearchField("article_title"),
    ]

    content_panels = BasePage.content_panels + [
        # FieldPanel("date", heading="Post Date"),
        FieldPanel("article_title", heading="Article Title"),
        FieldPanel("category", heading="Category"),
        FieldPanel("body", heading="Body"),
    ]

    graphql_fields = BasePage.graphql_fields + [
        # GraphQLString("date"),
        GraphQLString("article_title"),
        GraphQLRichText("body"),
        GraphQLForeignKey("category", "news.NewsCategory"),
    ]

    parent_page_types = ["news.NewsIndexPage"]
    subpage_types = []

    class Meta:
        verbose_name = "News Article"
        verbose_name_plural = "News Articles"
