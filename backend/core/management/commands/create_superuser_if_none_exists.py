import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model


class Command(BaseCommand):
    help = 'Create a superuser if none exists'

    def handle(self, *args, **options):
        User = get_user_model()
        
        # Check if any superuser exists
        if User.objects.filter(is_superuser=True).exists():
            self.stdout.write(
                self.style.SUCCESS('Superuser already exists. Skipping creation.')
            )
            return

        # Get credentials from environment variables
        username = os.environ.get('AEROCODE_TEST_WAGTAIL_SUPERUSER_USERNAME')
        email = os.environ.get('AEROCODE_TEST_WAGTAIL_SUPERUSER_EMAIL')
        password = os.environ.get('AEROCODE_TEST_WAGTAIL_SUPERUSER_PASSWORD')

        # Validate required environment variables
        if not all([username, email, password]):
            self.stdout.write(
                self.style.ERROR(
                    'Missing required environment variables: '
                    'AEROCODE_TEST_WAGTAIL_SUPERUSER_USERNAME, AEROCODE_TEST_WAGTAIL_SUPERUSER_EMAIL, AEROCODE_TEST_WAGTAIL_SUPERUSER_PASSWORD'
                )
            )
            return

        try:
            # Create superuser
            User.objects.create_superuser(
                username=username,
                email=email,
                password=password
            )
            self.stdout.write(
                self.style.SUCCESS(f'Superuser "{username}" created successfully.')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating superuser: {e}')
            )