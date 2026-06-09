# School Management System - Student Management Module

A complete student management module built with Django REST Framework and React. It includes JWT authentication, student CRUD, search, status filtering, pagination, dashboard statistics, sample data seeding, and a responsive Tailwind CSS interface.

## Tech Stack

Backend:
- Django
- Django REST Framework
- djangorestframework-simplejwt
- django-cors-headers
- django-environ
- SQLite

Frontend:
- React 18
- Vite
- React Router v6
- Axios
- Tailwind CSS
- react-hot-toast
- lucide-react

## Folder Structure

```text
backend/
  manage.py
  requirements.txt
  .env.example
  school_backend/
    settings.py
    urls.py
    wsgi.py
  students/
    models.py
    serializers.py
    views.py
    urls.py
    permissions.py
    pagination.py
    exceptions.py
    management/commands/seed.py

frontend/
  package.json
  .env.example
  index.html
  src/
    main.jsx
    App.jsx
    api/axios.js
    context/AuthContext.jsx
    hooks/useStudents.js
    pages/
    components/
    utils/validators.js
```

## Prerequisites

- Python 3.10+
- Node.js 18+
- npm

## Backend Setup

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

The backend will run at `http://127.0.0.1:8000`.

Default credentials:
- Username: `admin`
- Password: `admin123`

## Frontend Setup

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

The frontend will run at `http://127.0.0.1:5173`.

## Environment Variables

Backend `.env`:

```env
DEBUG=True
SECRET_KEY=change-me-in-production
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOW_ALL_ORIGINS=True
DATABASE_URL=sqlite:///db.sqlite3
```

Frontend `.env`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

Frontend production `.env`:

```env
VITE_API_BASE_URL=https://your-render-backend-url.onrender.com/api
```

## API Documentation

All API responses use this success format:

```json
{
  "success": true,
  "message": "Operation successful.",
  "data": {}
}
```

All API errors use this format:

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": {}
}
```

### Login

`POST /api/login`

Request:

```json
{
  "username": "admin",
  "password": "admin123"
}
```

Response:

```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "refresh": "refresh-token",
    "access": "access-token",
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com"
    }
  }
}
```

### Refresh Token

`POST /api/token/refresh`

Request:

```json
{
  "refresh": "refresh-token"
}
```

Response:

```json
{
  "access": "new-access-token"
}
```

### List Students

`GET /api/students?search=aarav&status=active&page=1`

Headers:

```text
Authorization: Bearer access-token
```

Response:

```json
{
  "success": true,
  "message": "Students retrieved successfully.",
  "data": {
    "count": 1,
    "next": null,
    "previous": null,
    "results": [
      {
        "id": 1,
        "first_name": "Aarav",
        "last_name": "Sharma",
        "email": "aarav.sharma@example.com",
        "phone": "9876543210",
        "date_of_birth": "2009-04-12",
        "grade": "Grade 10",
        "address": "12 Park Street, New Delhi",
        "enrollment_date": "2026-06-09",
        "status": "active",
        "created_at": "2026-06-09T10:00:00Z",
        "updated_at": "2026-06-09T10:00:00Z"
      }
    ]
  }
}
```

### Create Student

`POST /api/students`

Request:

```json
{
  "first_name": "Neha",
  "last_name": "Kumar",
  "email": "neha.kumar@example.com",
  "phone": "9876500000",
  "date_of_birth": "2010-02-14",
  "grade": "Grade 9",
  "address": "25 School Road, Hyderabad",
  "status": "active"
}
```

Response status: `201 Created`

### Retrieve Student

`GET /api/students/1`

Returns one student record in the standard success format.

### Update Student

`PUT /api/students/1`

Uses the same request body as Create Student and returns the updated record.

### Delete Student

`DELETE /api/students/1`

Response:

```json
{
  "success": true,
  "message": "Student deleted successfully.",
  "data": {}
}
```

### Dashboard Stats

`GET /api/dashboard/stats`

Response:

```json
{
  "success": true,
  "message": "Dashboard statistics retrieved successfully.",
  "data": {
    "total_students": 10,
    "active_students": 7,
    "inactive_students": 3,
    "recent_enrollments": []
  }
}
```

## Deployment Notes

Backend on Render:
- Push the repository to GitHub.
- In Render, create a Blueprint from `render.yaml` or create a Web Service with root directory `backend`.
- Build command: `bash build.sh`
- Start command: `python manage.py migrate && python manage.py seed && gunicorn school_backend.wsgi:application`
- Add production environment variables for `SECRET_KEY`, `DEBUG=False`, `ALLOWED_HOSTS`, `DATABASE_URL`, `CORS_ALLOWED_ORIGINS`, `CSRF_TRUSTED_ORIGINS`, `SECURE_SSL_REDIRECT=True`, and `SECURE_HSTS_SECONDS=31536000`.

Frontend on Vercel:
- Set the root directory to `frontend`.
- Build command: `npm run build`
- Output directory: `dist`
- Set `VITE_API_BASE_URL` to the deployed backend API URL.
- After Vercel gives you the frontend URL, add it to the backend `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS` values on Render.

Live demo URL: `https://your-live-demo-url.example.com`
