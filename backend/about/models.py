from django.db import models
from core.models import BasePage
from wagtail.fields import RichTextField
from wagtail.admin.panels import FieldPanel, MultiFieldPanel
from grapple.models import (
    GraphQLString,
    GraphQLStreamfield,
    GraphQLImage,
    GraphQLDocument,
)
from grapple.helpers import register_query_field
from wagtail.fields import StreamField
from wagtail.snippets.models import register_snippet
from wagtail.snippets.views.snippets import SnippetViewSet
from core.blocks import (
    ValueCardBlock,
    JourneyItemBlock,
    StatBlock,
    MagazineBlock,
    StoryBlock,
    CompanyCultureHighlightBlock,
    DepartmentBlock,
    BenefitBlock,
)


class AboutIndexPage(BasePage):
    max_count = 1

    hero_video = models.FileField(
        upload_to="videos/",
        blank=True,
        null=True,
        help_text="Hero video for the about page",
    )

    history_title = models.CharField(
        max_length=200,
        blank=True,
        help_text="Title for the history section",
    )

    history_body = RichTextField(
        blank=True,
        help_text="Content for the history section",
    )

    present_title = models.CharField(
        max_length=200,
        blank=True,
        help_text="Title for the present section",
    )

    present_body = RichTextField(
        blank=True,
        help_text="Content for the present section",
    )

    mission_statement = RichTextField(
        features=["bold", "italic", "link"],
        blank=True,
        help_text="Solomon Airlines mission statement",
    )

    vision_statement = RichTextField(
        features=["bold", "italic", "link"],
        blank=True,
        help_text="Solomon Airlines vision statement",
    )

    values = StreamField(
        [("value_item", ValueCardBlock())],
        use_json_field=True,
        blank=True,
        help_text="Values of Solomon Airlines",
        verbose_name="Values",
    )

    stats = StreamField(
        [("stat_item", StatBlock())],
        use_json_field=True,
        blank=True,
        help_text="Some cool stats related to Solomon Airlines",
        verbose_name="Statistics",
    )

    journey = StreamField(
        [("journey_item", JourneyItemBlock())],
        use_json_field=True,
        blank=True,
        help_text="Add items to the Solomon Airlines journey timeline.",
        verbose_name="Journey Timeline",
    )

    magazines = StreamField(
        [("magazine", MagazineBlock())],
        use_json_field=True,
        blank=True,
        help_text="Add magazines with documents, cover images and titles.",
        verbose_name="Magazines",
    )

    stories = StreamField(
        [("story", StoryBlock())],
        use_json_field=True,
        blank=True,
        help_text="Add stories with cover images, titles, subtitles and URLs.",
        verbose_name="Stories",
    )

    call_to_action_image = models.ForeignKey(
        "wagtailimages.Image",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
        help_text="Background image for the call to action section",
    )

    content_panels = BasePage.content_panels + [
        FieldPanel("hero_video", heading="Hero Video"),
        MultiFieldPanel([
            FieldPanel("history_title"),
            FieldPanel("history_body"),
        ], heading="History Section"),
        MultiFieldPanel([
            FieldPanel("present_title"),
            FieldPanel("present_body"),
        ], heading="Present Section"),
        FieldPanel("mission_statement", heading="Mission Statement"),
        FieldPanel("vision_statement", heading="Vision Statement"),
        FieldPanel("values", heading="Values"),
        FieldPanel("stats", heading="Statistics"),
        FieldPanel("journey", heading="Journey"),
        FieldPanel("magazines", heading="Magazines"),
        FieldPanel("stories", heading="Stories"),
        FieldPanel("call_to_action_image", heading="Call to Action Image"),
    ]

    graphql_fields = BasePage.graphql_fields + [
        GraphQLString("hero_video", name="heroVideo"),
        GraphQLString("history_title", name="historyTitle"),
        GraphQLString("history_body", name="historyBody"),
        GraphQLString("present_title", name="presentTitle"),
        GraphQLString("present_body", name="presentBody"),
        GraphQLString("mission_statement", name="missionStatement"),
        GraphQLString("vision_statement", name="visionStatement"),
        GraphQLStreamfield("values", name="values"),
        GraphQLStreamfield("stats", name="stats"),
        GraphQLStreamfield("journey", name="journey"),
        GraphQLStreamfield("magazines", name="magazines"),
        GraphQLStreamfield("stories", name="stories"),
        GraphQLImage("call_to_action_image", name="callToActionImage"),
    ]

    parent_page_types = ["home.HomePage"]

    class Meta:
        verbose_name = "About Index Page"


class CareersPage(BasePage):
    max_count = 1

    hero_video = models.FileField(
        upload_to="videos/",
        blank=True,
        null=True,
        help_text="Hero video for the careers page",
    )

    culture_highlights = StreamField(
        [("culture_highlight", CompanyCultureHighlightBlock())],
        use_json_field=True,
        blank=True,
        max_num=3,
        help_text="Company culture highlights with image, title and description (maximum 3)",
        verbose_name="Company Culture Highlights",
    )

    departments = StreamField(
        [("department", DepartmentBlock())],
        use_json_field=True,
        blank=True,
        help_text="Departments with name, description and image",
        verbose_name="Departments",
    )

    benefits = StreamField(
        [("benefit", BenefitBlock())],
        use_json_field=True,
        blank=True,
        help_text="Benefits with title and description",
        verbose_name="Benefits",
    )

    content_panels = BasePage.content_panels + [
        FieldPanel("hero_video", heading="Hero Video"),
        FieldPanel("culture_highlights", heading="Company Culture Highlights"),
        FieldPanel("departments", heading="Departments"),
        FieldPanel("benefits", heading="Benefits"),
    ]

    graphql_fields = BasePage.graphql_fields + [
        GraphQLString("hero_video", name="heroVideo"),
        GraphQLStreamfield("culture_highlights", name="cultureHighlights"),
        GraphQLStreamfield("departments", name="departments"),
        GraphQLStreamfield("benefits", name="benefits"),
    ]

    parent_page_types = ["home.HomePage"]

    class Meta:
        verbose_name = "Careers Page"


@register_query_field("jobVacancy", "jobVacancies")
class JobVacancy(models.Model):
    position_title = models.CharField(max_length=200, help_text="Job position title")
    department_name = models.CharField(max_length=100, help_text="Department name")
    location = models.CharField(max_length=100, help_text="Job location")
    closing_date = models.DateField(help_text="Application closing date")
    document = models.ForeignKey(
        "wagtaildocs.Document",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
        help_text="Job vacancy document (PDF)",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    panels = [
        FieldPanel("position_title"),
        FieldPanel("department_name"),
        FieldPanel("location"),
        FieldPanel("closing_date"),
        FieldPanel("document"),
    ]

    graphql_fields = [
        GraphQLString("position_title", name="positionTitle"),
        GraphQLString("department_name", name="departmentName"),
        GraphQLString("location", name="location"),
        GraphQLString("closing_date", name="closingDate"),
        GraphQLDocument("document", name="document"),
    ]

    def __str__(self):
        return f"{self.position_title} - {self.department_name}"

    class Meta:
        verbose_name = "Job Vacancy"
        verbose_name_plural = "Job Vacancies"
        ordering = ["-created_at"]


class JobVacancyAdmin(SnippetViewSet):
    model = JobVacancy
    add_to_admin_menu = False  # Hide from snippets menu


register_snippet(JobVacancy, JobVacancyAdmin)
