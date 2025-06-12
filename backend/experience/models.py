from core.models import BasePage
from wagtail.fields import RichTextField
from wagtail.admin.panels import FieldPanel
from grapple.models import GraphQLString


class ExperienceIndexPage(BasePage):
    max_count = 1

    # description = RichTextField(
    #     features=["bold", "italic", "link"],
    #     blank=True,
    #     help_text="A short description of the page",
    # )
    content_panels = BasePage.content_panels + [
        # FieldPanel("description", heading="Description"),
    ]
    graphql_fields = BasePage.graphql_fields + [
        # GraphQLString("description"),
    ]
    parent_page_types = ["home.HomePage"]

    class Meta:
        verbose_name = "Experience Index Page"
