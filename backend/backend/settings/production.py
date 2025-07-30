from .base import *

DEBUG = False

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get("SECRET_KEY")

# SECURITY WARNING: define the correct hosts in production!
ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", "").split(",")

# Azure Storage configuration for production environment
STORAGES = {
    "default": {
        "BACKEND": "storages.backends.azure_storage.AzureStorage",
        "OPTIONS": {
            "account_name": os.environ.get("AEROCODE_PROD_STORAGE_ACCOUNT_NAME"),
            "account_key": os.environ.get("AEROCODE_PROD_STORAGE_ACCOUNT_KEY"),
            "azure_container": "media",
        },
    },
    "staticfiles": {
        "BACKEND": "storages.backends.azure_storage.AzureStorage",
        "OPTIONS": {
            "account_name": os.environ.get("AEROCODE_PROD_STORAGE_ACCOUNT_NAME"),
            "account_key": os.environ.get("AEROCODE_PROD_STORAGE_ACCOUNT_KEY"),
            "azure_container": "static",
        },
    },
}

# Azure Storage URLs for production environment
STATIC_URL = f"https://{os.environ.get('AEROCODE_PROD_STORAGE_ACCOUNT_NAME')}.blob.core.windows.net/static/"
MEDIA_URL = f"https://{os.environ.get('AEROCODE_PROD_STORAGE_ACCOUNT_NAME')}.blob.core.windows.net/media/"

try:
    from .local import *
except ImportError:
    pass
