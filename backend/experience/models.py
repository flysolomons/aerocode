from django.db import models
from core.models import BasePage


# Create your models here.
class ExperienceIndexPage(BasePage):
    max_count = 1
    content_panels = BasePage.content_panels
    graphql_fields = BasePage.graphql_fields
    parent_page_types = ["home.HomePage"]
