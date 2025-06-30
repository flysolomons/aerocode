from grapple.helpers import register_streamfield_block
from wagtail.blocks import StructBlock, DateBlock
from grapple.models import GraphQLString


@register_streamfield_block
class PeriodBlock(StructBlock):
    start_date = DateBlock(
        required=True,
        help_text="Start date of the period",
    )
    end_date = DateBlock(
        required=True,
        help_text="End date of the period",
    )

    graphql_fields = [
        GraphQLString("start_date", name="startDate"),
        GraphQLString("end_date", name="endDate"),
    ]

    class Meta:
        graphql_type = "PeriodBlock"
