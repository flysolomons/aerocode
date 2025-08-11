# website

Solomon Airlines website

## Deployment flow

```
 ┌────────────────────┐
 │   Developer Pushes │
 │     to GitHub Repo │
 └────────┬───────────┘
          │
          ▼
 ┌────────────────────────────────────────────────────────────┐
 │                GitHub Actions Workflow                     │
 │ - Triggers on push to develop branch                       │
 │ - Builds Docker images                                     │
 │ - Injects env vars from GitHub Secrets                     │
 │                                                            │
 │   GitHub Secrets                                           │
 │   ------------------------------------------------------   │
 │   - AEROCODE_DEV_GRAPHQL_URL                               │
 │   - AEROCODE_DEV_NEXT_PUBLIC_GRAPHQL_URL                   │
 │   - AEROCODE_DEV_NEXT_PUBLIC_STORAGE_URL                   │
 │   - AEROCODE_TEST_GRAPHQL_URL                              │
 │   - AEROCODE_TEST_NEXT_PUBLIC_GRAPHQL_URL                  │
 │   - AEROCODE_TEST_NEXT_PUBLIC_STORAGE_URL                  │
 │   - AEROCODE_TEST_STORAGE_ACCOUNT_KEY                      │
 │   - AEROCODE_TEST_STORAGE_ACCOUNT_NAME                     │
 │   - AEROCODE_TEST_WAGTAIL_SUPERUSER_EMAIL                  │
 │   - AEROCODE_TEST_WAGTAIL_SUPERUSER_PASSWORD               │
 │   - AEROCODE_TEST_WAGTAIL_SUPERUSER_USERNAME               │
 └────────┬────────────────────────────────────────────────────┘
          │
          ▼
 ┌────────────────────────────────────────────────────────────┐
 │       Push to GitHub Container Registry (ghcr.io)          │
 │ - Auth via GitHub Token                                    │
 └────────┬────────────────────────────────────────────────────┘
          │
          ▼
 ┌────────────────────────────────────────────────────────────┐
 │                     Azure Web App                          │
 │ - Runs Docker Compose                                      │
 │ - Pulls from GitHub Packages                               │
 │ - Uses env vars injected into image (GitHub Secrets)       │
 │ - Uses env vars from Azure App Service                     │
 │                                                            │
 │   App Service Environment Variables                        │
 │   ------------------------------------------------------   │
 │   - BASE_URL                                               │
 │   - DB_HOST                                                │
 │   - DB_PASSWORD                                            │
 │   - DB_PORT                                                │
 │   - DB_USER                                                │
 │   - WAGTAILADMIN_BASE_URL                                  │
 └────────────────────────────────────────────────────────────┘
```
