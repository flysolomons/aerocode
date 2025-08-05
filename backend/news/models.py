from django.db import models
from django.utils.text import slugify
from django.utils import timezone
from core.models import BasePage

# Create your models here.
from wagtail.fields import RichTextField, StreamField
from wagtail.admin.panels import FieldPanel
from grapple.models import (
    GraphQLRichText,
    GraphQLString,
    GraphQLStreamfield,
    GraphQLForeignKey,
    GraphQLField,
)
from grapple.helpers import register_query_field
import graphene
from wagtail.snippets.models import register_snippet

# from wagtail.images.blocks import ImageChooserBlock
# from wagtail.blocks import CharBlock, RichTextBlock
from wagtail.search import index


# Custom GraphQL type for category
class CategoryType(graphene.ObjectType):
    name = graphene.String()
    slug = graphene.String()


# Import NewsArticle forward reference for GraphQL type
class NewsArticleListType(graphene.ObjectType):
    pass



class NewsIndexPage(BasePage):
    max_count = 1
    content_panels = BasePage.content_panels
    graphql_fields = BasePage.graphql_fields
    parent_page_types = ["home.HomePage"]

    class Meta:
        verbose_name = "News Index Page"


@register_query_field("news_category_page")
class NewsCategoryPage(BasePage):
    """
    Page-based category system for news articles.
    """

    # Category-specific fields
    category_name = models.CharField(
        max_length=100,
        blank=True,
        help_text="Display name for this category (if different from page title)",
    )
    category_description = models.TextField(
        blank=True, help_text="Brief description of what this category covers"
    )

    search_fields = BasePage.search_fields + [
        index.SearchField("category_name"),
        index.SearchField("category_description"),
    ]

    content_panels = BasePage.content_panels + [
        FieldPanel("category_name", heading="Category Name"),
        FieldPanel("category_description", heading="Category Description"),
    ]

    graphql_fields = BasePage.graphql_fields + [
        GraphQLString("category_name"),
        GraphQLString("category_description"),
    ]

    def resolve_articles(self, info, **kwargs):
        """Custom GraphQL resolver for getting articles in this category"""
        limit = kwargs.get("limit", 10)
        offset = kwargs.get("offset", 0)

        queryset = self.get_children().live().specific().order_by("-first_published_at")
        return queryset[offset : offset + limit]

    # Page tree configuration
    parent_page_types = ["news.NewsIndexPage"]
    subpage_types = ["news.NewsArticle"]

    class Meta:
        verbose_name = "News Category Page"
        verbose_name_plural = "News Category Pages"

    def __str__(self):
        return self.title

    def get_articles(self):
        """Get all live articles in this category"""
        return self.get_children().live().specific().order_by("-first_published_at")


@register_query_field("news_article")
class NewsArticle(BasePage):
    # date = models.DateField(help_text="The date of the news article")
    article_title = models.CharField(
        max_length=255, blank=False, help_text="The title of the news article"
    )
    body = RichTextField(blank=False, help_text="The content of the article")

    search_fields = BasePage.search_fields + [
        index.SearchField("article_title"),
    ]

    content_panels = BasePage.content_panels + [
        # FieldPanel("date", heading="Post Date"),
        FieldPanel("article_title", heading="Article Title"),
        FieldPanel("body", heading="Body"),
    ]

    graphql_fields = BasePage.graphql_fields + [
        # GraphQLString("date"),
        GraphQLString("article_title"),
        GraphQLRichText("body"),
        GraphQLField("category", CategoryType),
    ]

    @property
    def category(self):
        """Property to expose category data to GraphQL"""
        cat = self.get_category()
        if cat:
            return CategoryType(name=cat["name"], slug=cat["slug"])
        return None

    parent_page_types = ["news.NewsCategoryPage"]
    subpage_types = []

    class Meta:
        verbose_name = "News Article"
        verbose_name_plural = "News Articles"

    def get_category(self):
        """Get the category information from the parent NewsCategoryPage"""
        parent = self.get_parent().specific
        if isinstance(parent, NewsCategoryPage):
            return {"name": parent.category_name or parent.title, "slug": parent.slug}
        return None

    def save(self, *args, **kwargs):
        """Override save to generate date-prefixed slug"""
        # Generate base slug from article title
        if self.article_title:
            base_slug = slugify(self.article_title)
            
            # Get the publication date (use first_published_at if available, otherwise current date)
            if self.first_published_at:
                date_obj = self.first_published_at
            else:
                date_obj = timezone.now()
            
            # Format date as dd-mm-yyyy
            date_str = date_obj.strftime("%d-%m-%Y")
            
            # Create date-prefixed slug
            date_prefixed_slug = f"{date_str}-{base_slug}"
            
            # Only update slug if it's not already set or if article_title changed
            if not self.slug or self.slug != date_prefixed_slug:
                self.slug = date_prefixed_slug
        
        super().save(*args, **kwargs)
