# Urbanease Backend

REST API for the Urbanease home services platform. Built with **Bun**, **Express 5**, **Prisma 7**, and **PostgreSQL**.

---

## Environment Variables

Copy `.env.example` to `.env` and fill in values. The app validates configuration at startup (`src/config/env.ts`).

**Server**

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | `development` or `production` (default: `development`) |
| `PORT` | HTTP port (default: `4000`) |

**Database**

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |

**Redis / Valkey**

| Variable | Description |
|----------|-------------|
| `REDIS_URL` | Redis-compatible URL for caching and rate limiting (e.g. `redis://localhost:6379`, or `redis://valkey:6379` with Docker Compose) |

**Frontend**

| Variable | Description |
|----------|-------------|
| `FRONTEND_URL` | Allowed CORS origin and base URL for links in emails (e.g. password reset). Example: `http://localhost:3000` |

**Auth (JWT and opaque tokens)**

| Variable | Description |
|----------|-------------|
| `JWT_ACCESS_SECRET` | Secret for signing access JWTs (min 4 characters) |
| `REFRESH_TOKEN_SECRET` | Pepper used when hashing refresh tokens (min 4 characters) |
| `PASSWORD_RESET_SECRET` | Pepper used when hashing password-reset tokens |
| `JWT_EXPIRES_IN` | Optional string default for legacy/expiry-related settings (default: `7d`) |
| `JWT_ACCESS_EXPIRES_IN` | Access JWT lifetime (e.g. `30s`, `15m`, default: `30m`) |
| `REFRESH_TOKEN_EXPIRES_IN` | Refresh token lifetime in **whole days** for DB `expiresAt` and cookies (default: `7`) |

**Auth (cookies)**

| Variable | Description |
|----------|-------------|
| `COOKIE_DOMAIN` | Optional. Set in production when the API and app share a parent domain (e.g. `.yourdomain.com`) |

**Auth (admin)**

| Variable | Description |
|----------|-------------|
| `ADMIN_KEY` | Shared secret required for `POST /api/v1/auth/admin-signin` |

**AWS S3 (uploads)**

| Variable | Description |
|----------|-------------|
| `AWS_ACCESS_KEY_ID` | Access key |
| `AWS_SECRET_ACCESS_KEY` | Secret key |
| `AWS_ENDPOINT_URL_S3` | S3 API endpoint |
| `AWS_ENDPOINT_URL_IAM` | IAM endpoint |
| `AWS_REGION` | Region |
| `S3_BUCKET_NAME` | Bucket for uploads |

**Email (Resend)**

| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | Resend API key |
| `EMAIL_FROM` | Verified sender, e.g. `Urbanease <noreply@yourdomain.com>` |

---

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── scripts/              # One-off jobs (e.g. backfill provider review stats)
├── src/
│   ├── common/
│   │   ├── errors/       # App errors and error types
│   │   ├── middleware/   # Auth, roles, validation, errors, request IDs, rate limiting
│   │   └── utils/        # asyncHandler, slug-generator, S3 service
│   ├── config/           # env.ts, DB & Redis wiring
│   ├── lib/              # Redis client, cache, cache-keys, logger
│   ├── modules/
│   │   ├── admin/        # area/, category/, provider/, review/, service/ + admin.routes.ts
│   │   ├── auth/
│   │   ├── customers/    # addresses/, bookings/, profile/, reviews/ + customer.routes.ts
│   │   ├── providers/    # areas/, bookings/, profile/, reviews/, services/, stats/, upload/ + provider.routes.ts
│   │   └── public/
│   ├── utils/            # Shared helpers (e.g. avatars, review-stat refresh)
│   ├── app.ts
│   ├── route.ts
│   └── index.ts
├── db.ts                 # Prisma client singleton
├── prisma.config.ts
├── docker-compose.yml    # Backend + Valkey
├── Dockerfile
└── package.json
```

---

## Prisma

```bash
bunx --bun prisma migrate dev   # Run migrations
bunx --bun prisma generate      # Regenerate client
bunx --bun prisma studio        # Open Prisma Studio
```

---

## Docker

The stack includes the backend and Valkey. PostgreSQL must be running separately (or add it to `docker-compose.yml`).

```bash
docker compose build
docker compose up -d
```

Ensure `REDIS_URL=redis://valkey:6379` in your `.env` so the backend connects to the Valkey container.
