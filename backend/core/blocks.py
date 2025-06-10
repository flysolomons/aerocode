from wagtail.blocks import CharBlock, ChoiceBlock, ListBlock, RichTextBlock, StructBlock
from wagtail.images.blocks import ImageChooserBlock
from wagtail.blocks import PageChooserBlock
from grapple.helpers import register_streamfield_block
from grapple.models import (
    GraphQLImage,
    GraphQLString,
    GraphQLCollection,
    GraphQLForeignKey,
    GraphQLStreamfield,
)

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

    graphql_fields = [
        GraphQLString("title", name="title"),
        GraphQLString("description", name="description"),
        GraphQLString("link", name="link"),
    ]

    class Meta:
        graphql_type = "TravelRequirementBlock"


@register_streamfield_block
class GridCardSectionBlock(StructBlock):
    heading = CharBlock(required=True, max_length=100)
    grid_cards = ListBlock(GridCardBlock())

    graphql_fields = [
        GraphQLString("heading", name="heading"),
        # GraphQLCollection(
        #     GraphQLString,  # Use GraphQLString as the type handler
        #     "grid_cards",
        #     name="gridCards",
        # ),
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
