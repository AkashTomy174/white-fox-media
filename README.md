# SchoolOS - Student Management System

SchoolOS is a full-stack student management module built with Django REST Framework and React. It supports JWT authentication, student CRUD, dashboard statistics, search, grade/status filtering, pagination, responsive layouts, and production deployment on Render and Vercel.

## Tech Stack

Backend:
- Python
- Django
- Django REST Framework
- Simple JWT
- django-cors-headers
- django-environ
- Gunicorn
- SQLite for local development
- PostgreSQL for production

Frontend:
- React
- Vite
- React Router
- Axios
- Tailwind CSS
- lucide-react

## Project Structure

```text
backend/
  manage.py
  requirements.txt
  build.sh
  Procfile
  school_backend/
  students/

frontend/
  package.json
  vite.config.js
  vercel.json
  src/
```

## Requirements

- Python 3.10+
- Node.js 18+
- npm
- Git

## Local Backend Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python manage.py migrate
python manage.py seed
python manage.py runserver
```

Backend local URL:

```text
http://127.0.0.1:8000
```

The seed command creates an admin user and sample students. Set these values in `backend/.env` before running it:

```env
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-private-password
ADMIN_RESET_PASSWORD=False
```

Use `ADMIN_RESET_PASSWORD=True` only when you intentionally want to reset an existing seeded admin password.

## Local Frontend Setup

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Frontend local URL:

```text
http://127.0.0.1:5173
```

## Environment Variables

Backend local `.env`:

```env
DEBUG=True
SECRET_KEY=replace-this-with-a-random-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOW_ALL_ORIGINS=True
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
CSRF_TRUSTED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
DATABASE_URL=sqlite:///db.sqlite3
SECURE_SSL_REDIRECT=False
SECURE_HSTS_SECONDS=0
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-private-password
ADMIN_RESET_PASSWORD=False
```

Frontend local `.env`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

## Production Deployment

Production should use PostgreSQL. Do not use SQLite for live data on Render because the filesystem can be recreated during deploys or restarts.

### Backend on Render

1. Create a Render PostgreSQL database.
2. Copy the database's **Internal Database URL**.
3. Create or open the Render web service for the backend.
4. Set the root directory to:

```text
backend
```

5. Set the build command:

```bash
bash build.sh
```

6. Set the start command:

```bash
python manage.py migrate && gunicorn school_backend.wsgi:application
```

7. Add these environment variables:

```env
DEBUG=False
SECRET_KEY=<generate-a-secure-secret-key>
ALLOWED_HOSTS=<your-render-service>.onrender.com
DATABASE_URL=<render-postgres-internal-database-url>
CORS_ALLOW_ALL_ORIGINS=False
CORS_ALLOWED_ORIGINS=https://<your-vercel-frontend>.vercel.app
CSRF_TRUSTED_ORIGINS=https://<your-vercel-frontend>.vercel.app
SECURE_SSL_REDIRECT=True
SECURE_HSTS_SECONDS=31536000
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=<private-admin-password>
ADMIN_RESET_PASSWORD=False
```

8. Deploy the backend.

Run seed manually only once if you want to create the admin user and sample students in production:

```bash
python manage.py seed
```

Do not keep `python manage.py seed` in the Render start command. Running migrations on startup is okay, but seeding should be a manual setup action.

### Frontend on Vercel

1. Import the GitHub repository into Vercel.
2. Set the root directory to:

```text
frontend
```

3. Set the build command:

```bash
npm run build
```

4. Set the output directory:

```text
dist
```

5. Add this environment variable:

```env
VITE_API_BASE_URL=https://<your-render-service>.onrender.com/api
```

6. Deploy the frontend.
7. Copy the Vercel URL and add it to the backend Render variables:

```env
CORS_ALLOWED_ORIGINS=https://<your-vercel-frontend>.vercel.app
CSRF_TRUSTED_ORIGINS=https://<your-vercel-frontend>.vercel.app
```

8. Redeploy the backend after updating those values.

## API Overview

All protected endpoints require:

```text
Authorization: Bearer <access-token>
```

### Authentication

Login:

```http
POST /api/login
```

Request:

```json
{
  "username": "admin",
  "password": "your-password"
}
```

Refresh token:

```http
POST /api/token/refresh
```

### Students

List students:

```http
GET /api/students?search=akash&grade=Grade%2010&status=active&page=1
```

Create student:

```http
POST /api/students
```

Request:

```json
{
  "first_name": "Akash",
  "last_name": "Tomy",
  "email": "akash@example.com",
  "phone": "9876543210",
  "date_of_birth": "2010-02-14",
  "grade": "Grade 10",
  "address": "123 Main Street, Kochi",
  "status": "active"
}
```

Retrieve, update, and delete:

```http
GET /api/students/<id>
PUT /api/students/<id>
DELETE /api/students/<id>
```

### Dashboard

```http
GET /api/dashboard/stats
```

Returns total students, active students, inactive students, and recent enrollments.

## Validation Rules

Student data is validated on both the frontend and backend:

- First name: minimum 2 characters, letters/spaces/apostrophes/periods/hyphens only
- Last name: letters/spaces/apostrophes/periods/hyphens only
- Email: valid format and unique
- Phone: exactly 10 digits
- Date of birth: valid past date, age between 3 and 100 years
- Grade: required
- Address: minimum 10 characters
- Status: `active` or `inactive`

## Useful Commands

Backend:

```bash
python manage.py check
python manage.py migrate
python manage.py seed
python manage.py runserver
```

Frontend:

```bash
npm run lint
npm run build
npm run dev
```

## Production Notes

- Keep `SECRET_KEY`, `ADMIN_PASSWORD`, and `DATABASE_URL` private.
- Do not commit real `.env` files.
- Use Render PostgreSQL for persistent production data.
- Use the Render **Internal Database URL** for the backend `DATABASE_URL`.
- Redeploy the backend after changing environment variables.
- Redeploy the frontend after changing `VITE_API_BASE_URL`.
