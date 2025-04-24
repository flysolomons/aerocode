# import graphene
# from news.models import NewsArticle
# from news.graphql_types import NewsArticleType
# from grapple.schema import schema as grapple_schema


# class Query(graphene.ObjectType):
#     news_articles = graphene.List(
#         NewsArticleType,
#         limit=graphene.Int(),
#         offset=graphene.Int(),
#         order=graphene.String(),
#     )

#     def resolve_news_articles(self, info, limit=None, offset=None, order=None):
#         queryset = NewsArticle.objects.all()
#         if order:
#             queryset = queryset.order_by(order)
#         if offset:
#             queryset = queryset[offset:]  # Apply offset
#         if limit:
#             queryset = queryset[:limit]  # Apply limit
#         return queryset


# schema = graphene.Schema(query=type("MergedQuery", (Query, grapple_schema.query), {}))
