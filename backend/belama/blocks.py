from wagtail.blocks import StructBlock, CharBlock, RichTextBlock
from grapple.helpers import register_streamfield_block
from grapple.models import GraphQLString


@register_streamfield_block
class MembershipBlock(StructBlock):
    title = CharBlock(required=True, max_length=100)
    price = CharBlock(required=True, max_length=100)
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
    ]

    class Meta:
        graphql_type = "MembershipBlock"
