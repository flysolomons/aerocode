from .base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get(
    "SECRET_KEY", "django-insecure-test-key-change-in-production"
)

# SECURITY WARNING: define the correct hosts in production!
ALLOWED_HOSTS = ["*"]

EMAIL_BACKEND = "django.core.mail.backends.dummy.EmailBackend"

# Azure Storage configuration for test environment
STORAGES = {
    "default": {
        "BACKEND": "storages.backends.azure_storage.AzureStorage",
        "OPTIONS": {
            "account_name": os.environ.get("AEROCODE_TEST_STORAGE_ACCOUNT_NAME"),
            "account_key": os.environ.get("AEROCODE_TEST_STORAGE_ACCOUNT_KEY"),
            "azure_container": "media",
        },
    },
    "staticfiles": {
        "BACKEND": "storages.backends.azure_storage.AzureStorage",
        "OPTIONS": {
            "account_name": os.environ.get("AEROCODE_TEST_STORAGE_ACCOUNT_NAME"),
            "account_key": os.environ.get("AEROCODE_TEST_STORAGE_ACCOUNT_KEY"),
            "azure_container": "static",
        },
    },
}

# Azure Storage URLs for test environment
STATIC_ROOT = ""
STATIC_URL = f"https://{os.environ.get('AEROCODE_TEST_STORAGE_ACCOUNT_NAME')}.blob.core.windows.net/static/"

MEDIA_ROOT = ""
MEDIA_URL = f"https://{os.environ.get('AEROCODE_TEST_STORAGE_ACCOUNT_KEY')}.blob.core.windows.net/media/"

try:
    from .local import *
except ImportError:
    pass
