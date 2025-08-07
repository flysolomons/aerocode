from django.contrib import admin
from .models import Airport

@admin.register(Airport)
class AirportAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'city', 'country']
    list_filter = ['country', 'city']
    search_fields = ['code', 'name', 'city', 'country']
    ordering = ['code']
