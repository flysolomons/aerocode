from wagtail import hooks
from wagtail.admin.menu import MenuItem, Menu, SubmenuMenuItem
from django.urls import reverse
from wagtail.snippets.models import register_snippet
from wagtail.snippets.views.snippets import SnippetViewSet
from .models import HeaderMenu, FooterMenu, Currency
from home.models import CarouselSlide
from fares.models import Fare
from schedules.models import Schedule


# We'll register the menu items after the snippet admins are created
# This ensures the URL patterns exist when we try to reverse them

def get_menus_submenu():
    submenu = Menu(items=[
        MenuItem(
            label="Header Menu",
            url="/admin/snippets/core/headermenu/",
            name="header_menu",
            icon_name="list-ul",
        ),
        MenuItem(
            label="Footer Menu", 
            url="/admin/snippets/core/footermenu/",
            name="footer_menu",
            icon_name="list-ul",
        ),
        MenuItem(
            label="Currencies",
            url="/admin/snippets/core/currency/",
            name="currencies",
            icon_name="cog",
        ),
    ])
    
    return SubmenuMenuItem(
        label="Menus",
        menu=submenu,
        icon_name="list-ul",
        order=9000,
    )


def get_travel_alerts_menu_item():
    return MenuItem(
        label="Travel Alerts",
        url="/admin/snippets/alerts/travelalert/",
        name="travel_alerts",
        icon_name="warning",
        order=9001,
    )


def get_carousel_slides_menu_item():
    return MenuItem(
        label="Carousel Slides",
        url="/admin/snippets/home/carouselslide/",
        name="carousel_slides", 
        icon_name="image",
        order=9002,
    )


def get_uploaded_data_submenu():
    submenu = Menu(items=[
        MenuItem(
            label="Fares",
            url="/admin/snippets/fares/fare/",
            name="fares",
            icon_name="doc-full-inverse",
        ),
        MenuItem(
            label="Schedules",
            url="/admin/snippets/schedules/schedule/",
            name="schedules",
            icon_name="doc-full-inverse",
        ),
    ])
    
    return SubmenuMenuItem(
        label="Uploaded Data",
        menu=submenu,
        icon_name="folder-open-inverse",
        order=9999,  # Before Excel Data Upload (10000)
    )


# Custom snippet admin classes that don't appear in snippets menu
class HeaderMenuAdmin(SnippetViewSet):
    model = HeaderMenu
    add_to_admin_menu = False  # Hide from snippets menu

class FooterMenuAdmin(SnippetViewSet):
    model = FooterMenu
    add_to_admin_menu = False  # Hide from snippets menu

class CurrencyAdmin(SnippetViewSet):
    model = Currency
    add_to_admin_menu = False  # Hide from snippets menu

class CarouselSlideAdmin(SnippetViewSet):
    model = CarouselSlide
    add_to_admin_menu = False  # Hide from snippets menu

class FareAdmin(SnippetViewSet):
    model = Fare
    add_to_admin_menu = False  # Hide from snippets menu

class ScheduleAdmin(SnippetViewSet):
    model = Schedule
    add_to_admin_menu = False  # Hide from snippets menu

# Register snippets with custom admin
register_snippet(HeaderMenu, HeaderMenuAdmin)
register_snippet(FooterMenu, FooterMenuAdmin) 
register_snippet(Currency, CurrencyAdmin)
register_snippet(CarouselSlide, CarouselSlideAdmin)
register_snippet(Fare, FareAdmin)
register_snippet(Schedule, ScheduleAdmin)

# Hide the default snippets menu
@hooks.register("construct_main_menu")
def hide_snippets_menu(request, menu_items):
    # Remove the snippets menu item
    menu_items[:] = [item for item in menu_items if item.name != "snippets"]


# Move Settings menu item to appear after Port Pair Management
@hooks.register("construct_main_menu")
def reorder_settings_menu(request, menu_items):
    # Find and remove the settings menu item
    settings_item = None
    for item in menu_items:
        if item.name == "settings":
            settings_item = item
            break
    
    if settings_item:
        menu_items.remove(settings_item)
        # Change the order to appear after Excel Data Upload (10000)
        settings_item.order = 10001
        menu_items.append(settings_item)


# Register all menu items
hooks.register("register_admin_menu_item", get_menus_submenu)
hooks.register("register_admin_menu_item", get_travel_alerts_menu_item)
hooks.register("register_admin_menu_item", get_carousel_slides_menu_item)
hooks.register("register_admin_menu_item", get_uploaded_data_submenu)