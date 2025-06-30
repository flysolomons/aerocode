from wagtail.blocks import StructBlock, CharBlock, RichTextBlock, BooleanBlock
from grapple.helpers import register_streamfield_block
from grapple.models import GraphQLString


@register_streamfield_block
class MembershipBlock(StructBlock):
    title = CharBlock(required=True, max_length=100)
    price = CharBlock(required=True, max_length=100)
    most_popular = BooleanBlock(
        required=False,
        default=False,
        help_text="Check this box if this is the most popular membership",
    )
    features = RichTextBlock(
        features=["ol", "ul"],
        blank=True,
        help_text="A list of features for the membership",
        required=True,
    )

    graphql_fields = [
        GraphQLString("title", name="title"),
        GraphQLString("price", name="price"),
        GraphQLString("features", name="features"),
        GraphQLString("most_popular", name="mostPopular"),
    ]

    class Meta:
        graphql_type = "MembershipBlock"
