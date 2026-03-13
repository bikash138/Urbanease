# Urbanease

![Urbanease demo](assests/demo.png)

Book trusted home services at your fingertips. From cleaning to carpentry, verified professionals, transparent pricing, flexible slots.

[🌐 Live Demo](https://urbanease.bikashshaw.in) - Urbanease


## Features

### Roles

**Admin**

- Admins cannot sign up directly. They need an admin key to access the admin panel.
- Create categories and services with base pricing.
- Add service areas.
- Approve providers before they can start listing services.
- Moderate customer reviews and handle violations.

**Provider**

- Service providers can register and get access to their own dashboard.
- List services with their own pricing, but only after admin approval.
- Services can be listed only if the category and service already exist on the platform.
- Choose operating areas and publish services.
- Manage bookings with statuses: pending, confirmed, in-progress, or cancelled.

**Customer**

- Browse services across all categories and providers.
- Own profile with saved addresses and booking history.
- Bookings can be rescheduled or cancelled.
- When rescheduling, the system checks provider availability and returns available slots.
- After service completion, view before/after images and leave a review.

### Service Workflow

1. Provider confirms the booking.
2. Provider starts the service by uploading a mandatory "before" image.
3. After completion, provider uploads a final image and marks the booking as completed.

### Review Moderation

- Providers can flag inappropriate reviews.
- Admins can hide or make reviews visible again.
- If a customer violates review rules three times, the admin can suspend the account.

## Quick Start

### 1. Environment variables

Copy the example env files and fill in your values:

- **Backend** – [`backend/.env.example`](backend/.env.example) → `backend/.env`
- **Frontend** – [`frontend/.env.example`](frontend/.env.example) → `frontend/.env`

### 2. Run the app

**Option A: Docker**

```bash
# Backend + Valkey (PostgreSQL must be running separately; set DATABASE_URL in .env)
cd backend && docker compose up -d
```

**Option B: Local development**

```bash
# Backend (requires PostgreSQL, Valkey, and .env)
cd backend && bun install && bunx --bun prisma migrate dev && bun run dev

# Frontend (in another terminal)
cd frontend && bun install && bun run dev
```

> **Note:** The backend requires a Redis-compatible store (Valkey or Redis). The Docker stack includes Valkey; for local dev, run Valkey or Redis (e.g. `docker run -d -p 6379:6379 valkey/valkey`).

Backend: `http://localhost:4000` · Frontend: `http://localhost:3000`

## Tech Stack

**Frontend** - Next.js 16, React 19, Tailwind, shadcn/ui, TanStackQuery
**Backend** - Bun, Express 5, Prisma 7  
**Database** - PostgreSQL  
**Cache** - Valkey (Redis-compatible)  
**Auth** - JWT, HTTP-only cookies  
**Storage** - S3-compatible (Tigris)