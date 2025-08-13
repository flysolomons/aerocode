# Aerocode

A modern content management and information website built for Solomon Airlines. The platform allows the airline to manage flight information, destinations, special offers, news, and other content, while providing customers with comprehensive travel information and resources. Flight bookings are handled through integration with RefX.

## Tech Stack

### Backend

- **Framework**: Django 5.2 with Wagtail CMS 6.4.1
- **Language**: Python
- **Database**: PostgreSQL 15
- **API**: GraphQL

### Frontend

- **Framework**: Next.js 15.2.4 with React 19
- **Language**: TypeScript
- **Data Fetching**: Apollo Client 3.13.6

### Infrastructure

- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Nginx
- **CI/CD**: GitHub Actions
- **Container Registry**: GitHub Container Registry (ghcr.io), Azure Container Registry (ACR)
- **Hosting**: Azure App Service

## Architecture

```
    ╔══════════════════════════════════════════════════════════════╗
    ║                      Docker Container                        ║
    ║                                                              ║
    ║                    ┌─────────────────┐                       ║
    ║                    │     Nginx       │                       ║
    ║                    │ Reverse Proxy   │                       ║
    ║                    │   (Port 80)     │                       ║
    ║                    └─────────┬───────┘                       ║
    ║                              │                               ║
    ║              ┌───────────────┼───────────────┐               ║
    ║              ▼                               ▼               ║
    ║    ┌─────────────────┐            ┌─────────────────┐        ║
    ║    │   Next.js       │            │   Wagtail       │        ║
    ║    │   Frontend      │◄───────────┤   Backend       │        ║
    ║    │   (Port 3000)   │            │   (Port 8000)   │        ║
    ║    └─────────────────┘            └─────────┬───────┘        ║
    ║                                             │                ║
    ╚═════════════════════════════════════════════┼════════════════╝
                                                  │
                           ┌──────────────────────┼──────────────────────┐
                           ▼                                             ▼
                   ┌─────────────┐                             ┌─────────────┐
                   │   Azure     │                             │   Azure     │
                   │ PostgreSQL  │                             │   Blob      │
                   │  (External) │                             │  Storage    │
                   └─────────────┘                             │ (External)  │
                                                               └─────────────┘
```

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
 └────────┬───────────────────────────────────────────────────┘
          │
          ▼
 ┌────────────────────────────────────────────────────────────┐
 │       Push to GitHub Container Registry (ghcr.io)          │
 │ - Auth via GitHub Token                                    │
 └────────┬───────────────────────────────────────────────────┘
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

## Getting Started

### Prerequisites

- **Docker** (20.10+ recommended)
- **Docker Compose** (v2.0+ recommended)
- **Git**
- **Node.js** 18+ (for local development)
- **Python** 3.11+ (for local development)

### Local Development Setup

#### Backend Setup

1. **Navigate to backend directory**

   ```bash
   cd backend
   ```

2. **Create virtual environment**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations**

   ```bash
   python manage.py migrate
   ```

5. **Create superuser**

   ```bash
   python manage.py createsuperuser
   ```

6. **Start development server**
   ```bash
   python manage.py runserver
   ```

#### Frontend Setup

1. **Navigate to frontend directory**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

_Built with ❤️ by Solomon Airlines for Solomon Airlines_
