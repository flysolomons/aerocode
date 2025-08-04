from django.contrib import admin
from django.utils import timezone
from .models import CarouselSlide, HomePageSpecialRoute


@admin.register(CarouselSlide)
class CarouselSlideAdmin(admin.ModelAdmin):
    list_display = ("title", "created_at", "updated_at")
    list_filter = ("created_at", "updated_at")
    search_fields = ("title",)
    ordering = ("-created_at",)
    readonly_fields = ("created_at", "updated_at")

    fieldsets = (
        (None, {"fields": ("title",)}),
        (
            "Media",
            {
                "fields": ("image",),
            },
        ),
        (
            "Timestamps",
            {"fields": ("created_at", "updated_at"), "classes": ("collapse",)},
        ),
    )


class HomePageSpecialRouteInlineAdmin(admin.TabularInline):
    model = HomePageSpecialRoute
    extra = 0
    
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "special_route":
            # Filter to show only active specials (end_date >= today)
            kwargs["queryset"] = db_field.remote_field.model.objects.filter(
                special__end_date__gte=timezone.now().date()
            )
        return super().formfield_for_foreignkey(db_field, request, **kwargs)
