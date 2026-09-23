# SBRGREEN API Server

Node.js + Express + MySQL backend for the SBRGREEN website and admin panel.

## Setup

1. Copy credentials into `.env` (already configured for your database).
2. Install and run:

```bash
cd SERVER
npm install
npm run dev
```

API base URL: `http://localhost:5000/api`

## Default admin

- Username: `admin`
- Password: `Admin@123`

Change these in `.env` before production use.

## Key endpoints

- `GET /api/public/site` — full public website payload
- `POST /api/public/contact` — contact form
- `POST /api/auth/login` — admin login
- CRUD under `/api/admin/*` (JWT required)
