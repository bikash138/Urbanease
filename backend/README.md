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
