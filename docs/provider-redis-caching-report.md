# Provider area: Redis caching strategy report

This document maps **provider dashboard**, **bookings**, **listed services**, and **profile** to backend reads, summarizes what is already cached, and recommends where **Redis** (`getOrSet` / `invalidate` in `backend/src/lib/cache.ts`) helps UX—without hiding fresh operational data behind long TTLs.

---

## 1. Current caching baseline

| Layer | Mechanism | Notes |
|--------|-----------|--------|
| **Redis** | `getOrSet`, `invalidate`, `invalidateMany` | Used for public catalog + provider stats; falls back to DB if Redis errors |
| **React Query** | Client query keys + `invalidateQueries` / `setQueryData` | Reduces repeat HTTP calls during a session; not a substitute for server cache under load |

**Existing Redis keys** (`cache-keys.ts`):

- `public:*` — categories, services, provider listings (provider *portal* pages reuse some of this indirectly, e.g. `usePublicCategories` on listed services).
- `provider:stats:{providerId}` — dashboard aggregates.

**TTLs** (`cache.ts`): categories/services ~15 min, public providers ~10 min, **stats = 86400s (24h)**.

---

## 2. Page-by-page analysis

### 2.1 Dashboard (`/provider` → `page.tsx`)

**Frontend reads**

- `useProviderStats()` → provider stats API only.

**Backend**

- `StatsService.getStats` wraps the repository with `getOrSet(CacheKeys.providerStats(providerId), CacheTTL.STATS, ...)`.

**Stale-data assessment**

- **Good:** Status transitions initiated by the provider (`confirm` / `start` / `complete` / `cancel`) call `invalidate(CacheKeys.providerStats(providerId))` in `bookings.service.ts`, so aggregates refresh on those writes.
- **Risk — high TTL:** A **24h** TTL means any **missed invalidation** keeps wrong numbers for a long time. Operational dashboards usually prefer **short TTL + broad invalidation** or **medium TTL + exhaustive invalidation**.
- **Risk — missing invalidation:** **Customer-created bookings** (`customers/bookings/bookings.service.ts` → `createBooking`) do **not** invalidate `provider:stats:*`. New pending bookings can fail to appear in counts until the cache entry expires—a real UX/reliability issue with the current TTL.

**Recommendations**

1. **Fix correctness first:** On **booking create** (and any other path that changes counts or earnings), invalidate `CacheKeys.providerStats(providerId)` for the affected provider (derive `providerId` from `providerService` / booking relations—same pattern as existing booking flows).
2. **Soften TTL:** Consider reducing `STATS` TTL to **1–15 minutes** *or* keeping a longer TTL only if **every** mutating path invalidates (including customer, admin, payments if applicable).
3. **Optional:** Expose a **force refresh** on the dashboard that bypasses cache for that request (query param or dedicated `POST` that invalidates then returns)—only if product needs “live” numbers on demand.

---

### 2.2 Bookings (`/provider/bookings`)

**Frontend reads**

- `useProviderBookings()` → **all** bookings in one list (no status filter in current call), then client-side tabs by status.

**Backend**

- `ProviderBookingService.getAllBookings` → `bookingRepository.getAllBookings`: `findMany` with `providerService`, `customer.user`, `review`, image types—**not Redis-cached**.

**Stale-data assessment**

- This is **high-churn, transactional** data. Providers expect the list to reflect **confirm / start / complete / cancel / images / notes** quickly. The app already uses React Query invalidation on mutations (`useProviderBooking`); adding a **long-lived** Redis cache for the full list is likely to cause **stale tabs** unless every tiny mutation invalidates the same key.

**Recommendations**

1. **Do not** add a **long TTL** Redis cache for the **full** booking list by default.
2. **If** you need Redis under heavy load:
   - **Very short TTL** (e.g. **15–60 seconds**) as a **thundering herd** shield, plus **invalidate** the key on **any** booking mutation for that `providerId`; *or*
   - Cache **per booking id** for detail views only (if you introduce heavier detail endpoints), with invalidation when that booking changes.
3. **Prefer** improving perceived performance via:
   - **React Query** `staleTime` tuned per screen (e.g. bookings: `staleTime: 0` or low, `refetchOnWindowFocus: true` for operational pages).
   - **DB indexes** on `Booking.providerServiceId`, `status`, `date` if queries grow.
   - **Pagination** or server-side status filters if the list becomes large (reduces payload and query cost more than Redis for this shape).

---

### 2.3 Listed services (`/provider/service`)

**Frontend reads**

- `useProviderServices()` → all listed services for the provider.
- `usePublicCategories()` → already **Redis-backed** on the public API (`CacheTTL.CATEGORIES`).
- `useProviderAreas()` → active areas list (see §3).

**Backend**

- `ServicesService.getAllServices` → repository `findMany`-style reads with relations—**not Redis-cached**.
- Writes: `addService`, `updateService`, `removeService` (slots creation on add).

**Stale-data assessment**

- Read/write ratio favors **short-to-medium cache**: list changes only when the provider (or admin affecting linked service metadata) changes something.
- Stale risk is **moderate**: wrong price/availability until TTL or invalidation is annoying but not as sensitive as booking state.

**Recommendations**

1. **Add** `CacheKeys.providerServices(providerId)` (new key) with **`getOrSet`** around `getAllServices`.
2. **TTL:** **2–10 minutes** is a reasonable start; tune from metrics.
3. **Invalidate** on `addService`, `updateService`, `removeService` for that `providerId`.
4. **Admin edits** to platform `Service` (title, etc.): if the listed-services payload embeds service fields, either:
   - invalidate provider service caches when admin updates a service that appears in listings (heavier), *or*
   - accept **eventual consistency** within TTL (often OK for titles), *or*
   - shorter TTL.

---

### 2.4 Profile (`/provider/profile`)

**Frontend reads**

- `useProviderProfile()` — single provider profile record.
- Updates use `setQueryData` after mutation (good client consistency).

**Backend**

- `ProfileService.getProfile` — **not Redis-cached**.

**Stale-data assessment**

- Low **QPS** per user; payload is small. Stale profile data is mostly a **cosmetic** issue if TTL is short or **write invalidates**.

**Recommendations**

1. **Optional / low priority** Redis cache: **`provider:profile:{providerId}`**, TTL **60–300s**, **`invalidate` on `updateProfile`**.
2. If traffic is low, **skip Redis** here first; invest in bookings list DB/index and **stats invalidation** correctness.

---

## 3. Shared provider API: active areas (`useProviderAreas`)

**Backend:** `ProviderAreasRepository.findActiveAreas` — global list (`where: { isActive: true }`), **not cached**.

**Used on:** Listed services page (add-service form).

**Recommendations**

1. **Cache** with key e.g. `provider:areas:active` or reuse a neutral `public:areas:active` if customers ever need the same list.
2. **TTL:** **5–30 minutes** (areas change rarely).
3. **Invalidate** when admin creates/updates/deactivates areas (wire into admin area service if present).

This reduces repeated identical queries every time a provider opens the sheet.

---

## 4. Stale data: decision framework

Use this order of preference:

1. **Write-time invalidation** for entities the user just changed (provider services, profile if cached, stats aggregates).
2. **Short TTL** as a safety net when invalidation might miss an edge case (especially for **aggregates**).
3. **Long TTL** only for **rarely changing** reference data (categories, area lists) with clear admin invalidation.
4. **Avoid** long-lived cache for **high-churn operational lists** (bookings) unless paired with aggressive invalidation or sub-second TTL.

**Your stats pattern today** mixes **very long TTL** with **partial** invalidation → correctness depends on **complete** invalidation coverage; closing gaps (e.g. customer `createBooking`) is mandatory before treating 24h TTL as acceptable.

---

## 5. Prioritized action list

| Priority | Item | Impact |
|----------|------|--------|
| P0 | Invalidate `provider:stats:{providerId}` when **customer creates** (and optionally reschedules/cancels if those change counts) bookings | Fixes misleading dashboard numbers |
| P0 | Revisit **`CacheTTL.STATS`** (24h); align with invalidation completeness or shorten | Reduces blast radius of missed invalidations |
| P1 | Redis cache **`getAllServices`** per provider + invalidate on add/update/remove | Faster listed-services page under load |
| P1 | Redis cache **active areas** + admin invalidation | Fewer redundant reads on service form |
| P2 | Optional Redis cache **`getProfile`** + invalidate on update | Marginal; nice if profile joins grow |
| P3 | Bookings: prefer **indexes / pagination / short client staleTime** over Redis full-list cache | Avoids stale operational UI |

---

## 6. Summary

- **Dashboard:** Already using Redis for stats; **smoothness is there**, but **staleness risk is dominated by TTL length and incomplete invalidation**—extend invalidation to **all booking lifecycle entry points** (at minimum **customer booking creation**) and consider a **shorter STATS TTL**.
- **Bookings:** **Redis is a poor primary lever** for the main list; optimize query shape, indexes, and React Query behavior first; only add Redis with **very short TTL** or **per-entity** caching if load testing proves need.
- **Listed services:** **Strong candidate** for Redis with **moderate TTL** and **strict invalidation** on provider mutations (and optional admin hooks).
- **Profile:** **Optional** Redis; low priority unless read cost spikes.
- **Areas (shared):** **Strong, low-risk** Redis candidate with long TTL and admin invalidation.

This gives a smoother experience **without** trading off the operational correctness providers expect on bookings and—once fixed—on dashboard numbers.
