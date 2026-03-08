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
│   ├── (public)/      # Public routes (categories, services, providers, booking)
│   ├── admin/
│   ├── auth/
│   ├── customer/
│   ├── provider/
│   ├── layout.tsx
│   └── page.tsx
├── api/               # API client functions
├── components/
├── hooks/
├── lib/
├── schemas/
├── store/
└── types/
```
