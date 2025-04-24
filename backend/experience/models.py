from core.models import BasePage


class ExperienceIndexPage(BasePage):
    max_count = 1
    content_panels = BasePage.content_panels
    graphql_fields = BasePage.graphql_fields
    parent_page_types = ["home.HomePage"]

    class Meta:
        verbose_name = "Experience Index Page"
