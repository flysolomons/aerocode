from wagtail.blocks import (
    CharBlock,
    ChoiceBlock,
    ListBlock,
    RichTextBlock,
    StructBlock,
    StreamBlock,
)
from wagtail.images.blocks import ImageChooserBlock
from wagtail.blocks import PageChooserBlock
from wagtail.contrib.table_block.blocks import TableBlock
from grapple.helpers import register_streamfield_block
from grapple.models import (
    GraphQLImage,
    GraphQLString,
    GraphQLCollection,
    GraphQLForeignKey,
    GraphQLStreamfield,
    GraphQLField,
)
from graphene.types.generic import GenericScalar
import graphene
from django import forms
from django.utils.html import format_html, format_html_join
from django.core.exceptions import ValidationError


@register_streamfield_block
class TextBlock(RichTextBlock):
    class Meta:
        graphql_type = "TextBlock"


@register_streamfield_block
class ImageBlock(StructBlock):
    image = ImageChooserBlock(required=True)
    caption = CharBlock(required=False, max_length=200)

    graphql_fields = [
        GraphQLImage("image", name="image"),
        GraphQLString("caption", name="caption"),
    ]

    class Meta:
        graphql_type = "ImageBlock"


@register_streamfield_block
class FullWidthImageBlock(StructBlock):
    image = ImageChooserBlock(required=True)
    caption = CharBlock(required=False, max_length=200)

    graphql_fields = [
        GraphQLImage("image", name="image"),
        GraphQLString("caption", name="caption"),
    ]

    class Meta:
        graphql_type = "FullWidthImageBlock"


@register_streamfield_block
class SectionBlock(StructBlock):
    heading = CharBlock(required=True, max_length=100)
    text = TextBlock(required=True)
    image = ImageChooserBlock(required=True)
    image_position = ChoiceBlock(
        choices=[("left", "Left"), ("right", "Right")], default="right"
    )

    graphql_fields = [
        GraphQLString("heading", name="heading"),
        GraphQLString("text", name="text"),
        GraphQLImage("image", name="image"),
        GraphQLString("image_position", name="imagePosition"),
    ]

    class Meta:
        graphql_type = "SectionBlock"


@register_streamfield_block
class GridCardBlock(StructBlock):
    heading = CharBlock(required=True, max_length=100)
    text = TextBlock(required=True)
    image = ImageChooserBlock(required=True)

    graphql_fields = [
        GraphQLString("heading", name="heading"),
        GraphQLString("text", name="text"),
        GraphQLImage("image", name="image"),
    ]

    class Meta:
        graphql_type = "GridCardBlock"


@register_streamfield_block
class TravelRequirementBlock(StructBlock):
    title = CharBlock(required=True, max_length=100)
    description = TextBlock(required=True)
    link = RichTextBlock(
        features=["link"],
        blank=True,
        help_text="A link to the visa requirements",
        required=True,
    )
    svg_icon = ImageChooserBlock(
        required=False,
        help_text="SVG icon for the travel requirement card",
    )

    graphql_fields = [
        GraphQLString("title", name="title"),
        GraphQLString("description", name="description"),
        GraphQLString("link", name="link"),
        GraphQLImage("svg_icon", name="svgIcon"),
    ]

    class Meta:
        graphql_type = "TravelRequirementBlock"


@register_streamfield_block
class GridCardSectionBlock(StructBlock):
    heading = CharBlock(required=True, max_length=100)
    grid_cards = ListBlock(GridCardBlock())

    graphql_fields = [
        GraphQLString("heading", name="heading"),
    ]

    class Meta:
        graphql_type = "GridCardSectionBlock"


@register_streamfield_block
class HeadingTextBlock(StructBlock):
    heading = CharBlock(required=True, max_length=100)
    text = TextBlock(required=True)

    graphql_fields = [
        GraphQLString("heading", name="heading"),
        GraphQLString("text", name="text"),
    ]

    class Meta:
        graphql_type = "HeadingTextBlock"


# yourapp/blocks.py


@register_streamfield_block
class MegaMenuItemBlock(StructBlock):
    title = CharBlock(required=True, max_length=100, help_text="Item title")
    link_page = PageChooserBlock(required=True, help_text="Select a page to link to.")

    graphql_fields = [
        GraphQLString("title", name="title"),
        GraphQLString("link_page", name="linkPage"),
    ]

    class Meta:
        graphql_type = "MegaMenuItemBlock"


@register_streamfield_block
class MegaMenuColumnBlock(StructBlock):
    column_title = CharBlock(required=True, max_length=100, help_text="Column title")
    items = ListBlock(MegaMenuItemBlock())

    # can add an image here

    graphql_fields = [
        GraphQLString("column_title", name="columnTitle"),
    ]

    class Meta:
        graphql_type = "MegaMenuColumnBlock"


@register_streamfield_block
class MegaMenuBlock(StructBlock):
    title = CharBlock(required=True, max_length=100)
    link_page = PageChooserBlock(
        required=False,
        help_text="Select a page to link to.",
    )
    columns = ListBlock(MegaMenuColumnBlock())

    graphql_fields = [
        GraphQLString("title", name="title"),
        GraphQLString("link_page", name="linkPage"),
    ]

    class Meta:
        graphql_type = "MegaMenuBlock"


@register_streamfield_block
class ValueCardBlock(StructBlock):
    title = CharBlock(required=True, max_length=100)
    description = TextBlock(required=True)
    image = ImageChooserBlock(required=True)

    graphql_fields = [
        GraphQLString("title", name="title"),
        GraphQLString("description", name="description"),
        GraphQLImage("image", name="image"),
    ]

    class Meta:
        graphql_type = "ValueCardBlock"


@register_streamfield_block
class StatBlock(StructBlock):
    title = CharBlock(required=True, max_length=100)
    value = CharBlock(required=True, max_length=50)

    graphql_fields = [
        GraphQLString("title", name="title"),
        GraphQLString("value", name="value"),
    ]

    class Meta:
        graphql_type = "StatBlock"


@register_streamfield_block
class JourneyItemBlock(StructBlock):
    title = CharBlock(required=True, max_length=100)
    description = TextBlock(required=True)
    year = CharBlock(required=True, max_length=4, help_text="Year of the journey item")

    graphql_fields = [
        GraphQLString("title", name="title"),
        GraphQLString("description", name="description"),
        GraphQLString("year", name="year"),
    ]

    class Meta:
        graphql_type = "JourneyItemBlock"


@register_streamfield_block
class DataTableBlock(StructBlock):
    """Wrapper for TableBlock to expose it to GraphQL"""

    table_data = TableBlock(
        table_options={
            "contextMenu": True,
            "startRows": 3,
            "startCols": 3,
            "colHeaders": False,
            "rowHeaders": False,
        }
    )

    def get_context(self, value, parent_context=None):
        context = super().get_context(value, parent_context=parent_context)
        # Pass through the table data directly for rendering
        if value and "table_data" in value:
            context["table"] = value["table_data"]
        return context

    graphql_fields = [
        GraphQLField(
            "tableData", graphene.types.generic.GenericScalar, source="table_data"
        ),
    ]

    class Meta:
        graphql_type = "DataTableBlock"
        icon = "table"
        label = "Table"
        template = "table_block/blocks/table.html"
