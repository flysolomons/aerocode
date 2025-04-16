import graphene
from graphene_django.types import DjangoObjectType
from news.models import NewsArticle
from grapple.schema import schema as grapple_schema


class NewsArticleType(DjangoObjectType):
    class Meta:
        model = NewsArticle
        fields = (
            "id",
            "article_title",
            "body",
            "first_published_at",
            "slug",
            "hero_image",
            "hero_title",
        )


class Query(graphene.ObjectType):
    news_articles = graphene.List(
        NewsArticleType,
        limit=graphene.Int(),
        offset=graphene.Int(),
        order=graphene.String(),
    )

    def resolve_news_articles(self, info, limit=None, offset=None, order=None):
        queryset = NewsArticle.objects.all()
        if order:
            queryset = queryset.order_by(order)
        if offset:
            queryset = queryset[offset:]  # Apply offset
        if limit:
            queryset = queryset[:limit]  # Apply limit
        return queryset


schema = graphene.Schema(query=type("MergedQuery", (Query, grapple_schema.query), {}))
