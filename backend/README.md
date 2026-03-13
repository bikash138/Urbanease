# Urbanease Backend

REST API for the Urbanease home services platform. Built with **Bun**, **Express 5**, **Prisma 7**, and **PostgreSQL**.

---

## Environment Variables

Create a `.env` file with:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `FRONTEND_URL` | CORS origin (e.g. `http://localhost:3000`) |
| `JWT_SECRET` | Secret for signing JWTs |
| `JWT_EXPIRES_IN` | JWT expiry (optional, default: `7d`) |
| `ADMIN_KEY` | Shared secret for admin sign-in |
| `COOKIE_DOMAIN` | Cookie domain (optional, leave empty for localhost) |
| `PORT` | Server port (optional, default: 4000) |
| `NODE_ENV` | `development` or `production` (optional) |
| `AWS_ACCESS_KEY_ID` | S3 / compatible storage access key |
| `AWS_SECRET_ACCESS_KEY` | S3 secret key |
| `AWS_ENDPOINT_URL_S3` | S3 endpoint URL |
| `AWS_ENDPOINT_URL_IAM` | IAM endpoint URL |
| `AWS_REGION` | AWS region |
| `S3_BUCKET_NAME` | Bucket name for uploads |
| `REDIS_URL` | Valkey/Redis connection URL (e.g. `redis://localhost:6379` or `redis://valkey:6379` for Docker) |

---

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── common/           # Middleware, errors, utils
│   │   ├── errors/       # App error types
│   │   ├── middleware/   # Auth, validation, error handling, roles
│   │   └── utils/        # S3, asyncHandler, slug-generator
│   ├── config/           # Env validation, DB & Redis connection
│   ├── lib/              # Redis client, cache, cache-keys
│   ├── modules/
│   │   ├── admin/        # Category, service, provider, review, area
│   │   ├── auth/
│   │   ├── customers/    # Addresses, bookings, profile, reviews
│   │   ├── providers/    # Areas, bookings, profile, reviews, services, upload
│   │   └── public/
│   ├── app.ts
│   ├── route.ts
│   └── index.ts
├── db.ts                 # Prisma client
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
