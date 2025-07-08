from django.contrib import admin
from wagtail.snippets.models import register_snippet
from wagtail.snippets.views.snippets import SnippetViewSet
from .models import TravelAlert

# Register your models here.


class AlertAdmin(SnippetViewSet):
    model = TravelAlert
    menu_label = "Alerts"
    menu_icon = "warning"
    list_display = ["title", "is_active", "created_at"]
    list_filter = ["is_active", "created_at"]
    search_fields = ["title", "content"]


register_snippet(TravelAlert, AlertAdmin)
