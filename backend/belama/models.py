from django.db import models
from core.models import BasePage
from wagtail.fields import StreamField
from .blocks import MembershipBlock
from wagtail.admin.panels import FieldPanel
from grapple.models import GraphQLImage, GraphQLString, GraphQLStreamfield


# Create your models here.
class BelamaIndexPage(BasePage):
    max_count = 1

    # description = models.CharField(
    #     max_length=255,
    #     blank=True,
    #     help_text="A short description of the page.",
    # )

    individual_memberships = StreamField(
        [
            ("individual_membership", MembershipBlock()),
        ],
        use_json_field=True,
        blank=True,
        help_text="Add individual memberships.",
    )

    promo_image = models.ForeignKey(
        "wagtailimages.Image",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
        help_text="A promotional image for Belama",
    )

    group_memberships = StreamField(
        [
            ("group_membership", MembershipBlock()),
        ],
        use_json_field=True,
        blank=True,
        help_text="Add group memberships.",
    )

    content_panels = BasePage.content_panels + [
        # FieldPanel("description"),
        FieldPanel("individual_memberships"),
        FieldPanel("promo_image"),
        FieldPanel("group_memberships"),
    ]

    graphql_fields = BasePage.graphql_fields + [
        # GraphQLString("description", name="description"),
        GraphQLImage("promo_image", name="promoImage"),
        GraphQLStreamfield("individual_memberships", name="individualMemberships"),
        GraphQLStreamfield("group_memberships", name="groupMemberships"),
    ]
    parent_page_types = ["home.HomePage"]

    class Meta:
        verbose_name = "Belama Index Page"


class BelamaSignUpPage(BasePage):
    max_count = 1

    content_panels = BasePage.content_panels

    graphql_fields = BasePage.graphql_fields

    parent_page_types = ["belama.BelamaIndexPage"]

    class Meta:
        verbose_name = "Belama Sign Up Page"
