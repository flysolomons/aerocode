from wagtail import hooks
from wagtail.admin.menu import MenuItem, Menu, SubmenuMenuItem
from django.urls import path, reverse
from django.shortcuts import render, redirect
from django.views.generic import View
from wagtail.snippets.models import register_snippet
from wagtail.snippets.views.snippets import SnippetViewSet
from .models import HeaderMenu, FooterMenu, Currency, Airport, PortPair
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


def get_airports_menu_item():
    return MenuItem(
        label="Airports",
        url="/admin/snippets/core/airport/",
        name="airports",
        icon_name="site",
        order=9003,
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


def get_port_pair_menu_item():
    return MenuItem(
        label="Port Pair Management",
        url=reverse("port_pair_admin"),
        name="port_pair_admin",
        icon_name="redirect",
        order=9004,
    )


class PortPairManagementView(View):
    """Simple admin interface for managing port pairs"""
    
    def get(self, request):
        """Display the port pair management interface"""
        
        # Get all airports directly from Airport model
        all_ports = list(Airport.objects.all().values_list('code', 'name', 'city', 'country'))
        
        # Convert to sorted list for dropdown
        ports = [(code, city) for code, name, city, country in all_ports]
        ports.sort(key=lambda x: x[1])  # Sort by city name
        
        # Get selected port if provided
        selected_port = request.GET.get('port')
        all_destinations = []
        
        if selected_port:
            # Get all possible destination ports (excluding selected port) with country info
            possible_destinations = []
            for code, name, city, country in all_ports:
                if code != selected_port:
                    possible_destinations.append((code, name, city, country))
            
            # Check which destinations are currently paired with selected port
            existing_pairs = set(
                PortPair.objects.filter(origin_port__code=selected_port)
                .values_list('destination_port__code', flat=True)
            )
            
            # Group destinations by country
            countries_dict = {}
            for dest_code, dest_name, dest_city, country in possible_destinations:
                if country not in countries_dict:
                    countries_dict[country] = []
                
                countries_dict[country].append({
                    'port_code': dest_code,
                    'port_name': dest_name,
                    'port_city': dest_city,
                    'is_paired': dest_code in existing_pairs,
                })
            
            # Sort countries alphabetically and sort ports within each country
            all_destinations = []
            for country in sorted(countries_dict.keys()):
                countries_dict[country].sort(key=lambda x: x['port_name'])
                all_destinations.append({
                    'country': country,
                    'ports': countries_dict[country]
                })
        
        return render(request, 'explore/port_pair_admin.html', {
            'ports': ports,
            'selected_port': selected_port,
            'all_destinations': all_destinations,
        })

    def post(self, request):
        """Handle port pair updates"""
        selected_port = request.POST.get('port')
        paired_destinations = request.POST.getlist('paired_destinations')
        
        if selected_port:
            try:
                origin_airport = Airport.objects.get(code=selected_port)
                
                # Remove all existing pairs for this origin port
                PortPair.objects.filter(origin_port=origin_airport).delete()
                
                # Create new pairs for checked destinations
                for dest_port_code in paired_destinations:
                    try:
                        dest_airport = Airport.objects.get(code=dest_port_code)
                        PortPair.objects.get_or_create(
                            origin_port=origin_airport,
                            destination_port=dest_airport
                        )
                    except Airport.DoesNotExist:
                        continue  # Skip if destination airport doesn't exist
                        
            except Airport.DoesNotExist:
                pass  # Skip if origin airport doesn't exist
            
        
        return redirect(f'{request.path}?port={selected_port}')


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

class AirportAdmin(SnippetViewSet):
    model = Airport
    add_to_admin_menu = False  # Hide from snippets menu

# Register snippets with custom admin
register_snippet(HeaderMenu, HeaderMenuAdmin)
register_snippet(FooterMenu, FooterMenuAdmin) 
register_snippet(Currency, CurrencyAdmin)
register_snippet(CarouselSlide, CarouselSlideAdmin)
register_snippet(Fare, FareAdmin)
register_snippet(Schedule, ScheduleAdmin)
register_snippet(Airport, AirportAdmin)

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


# Port Pair URL registration
def register_port_pair_urls():
    return [
        path(
            "port-pairs/",
            PortPairManagementView.as_view(),
            name="port_pair_admin",
        ),
    ]

hooks.register("register_admin_urls", register_port_pair_urls)

# Register all menu items
hooks.register("register_admin_menu_item", get_menus_submenu)
hooks.register("register_admin_menu_item", get_travel_alerts_menu_item)
hooks.register("register_admin_menu_item", get_carousel_slides_menu_item)
hooks.register("register_admin_menu_item", get_airports_menu_item)
hooks.register("register_admin_menu_item", get_port_pair_menu_item)
hooks.register("register_admin_menu_item", get_uploaded_data_submenu)