# Urbanease Frontend

Web app for the Urbanease home services platform. Built with **Next.js 16**, **React 19**, **Tailwind CSS v4**, and **shadcn/ui**.

---

## Environment Variables

Create a `.env.local` file with:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | API base URL (optional, default: `http://localhost:4000`) |

---

## Project Structure

```
frontend/src/
├── app/
│   ├── (public)/      # Home, search, categories, services, providers, booking, about, careers, contact, legal
│   ├── admin/         # areas, categories, providers, reviews, services
│   ├── auth/          # signin, signup, admin-signin
│   ├── customer/      # bookings, profile
│   ├── provider/      # bookings, profile, service
│   ├── error.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── not-found.tsx
├── api/               # API clients: admin/, customer/, provider/, public/, plus auth.api.ts
├── components/        # admin/, auth/, common/, customer/, layout/, provider/, public/, ui/, tanstack-providers/
├── data/              # Static nav, footer, and social links
├── hooks/             # admin/, customer/, provider/, public/
├── lib/               # api-client, query client, config, utils, tokens, ImageKit helpers
├── schemas/           # Zod: admin/, provider/, auth.schema.ts
├── server/            # Server-only helpers (e.g. public data fetching)
├── store/
└── types/             # admin/, customer/, provider/, public/
```
