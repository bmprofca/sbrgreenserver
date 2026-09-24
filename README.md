# SBRGREEN API Server

Node.js + Express + MySQL backend for the SBRGREEN website and admin panel.

## Setup

1. Copy `.env.example` to `.env.development` and `.env.production`, then fill in database + JWT values.
2. Install and run:

```bash
cd SERVER
npm install
npm run dev    # uses .env.development
npm start      # uses .env.production
```

API base URL: `http://localhost:5000/api`

## Default admin (stored in `admin` table)

On first startup, if the `admin` table is empty, a default user is created in the database:

- Username: `admin`
- Password: `Admin@123`

Credentials are **not** stored in `.env`. Change the password in the database after first login.

## Key endpoints

- `GET /api/public/site` — full public website payload
- `POST /api/public/contact` — contact form
- `POST /api/auth/login` — admin login
- CRUD under `/api/admin/*` (JWT required)

CORS allows all origins.
