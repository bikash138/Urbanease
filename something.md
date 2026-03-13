# Urbanease Backend — Caching Strategy & Query Optimization

> A comprehensive guide to add caching and reduce database load for a smoother user experience.

---

## Executive Summary

| Metric | Current State | After Caching |
|--------|---------------|---------------|
| **Categories** | DB hit every request | ~5–15 min cache |
| **Services** | 2 queries when filtered by slug | Single cache hit |
| **Search** | Complex multi-join queries | Cached by filter combo |
| **Provider profile** | 4+ table joins per view | Cached by slug |
| **Slots** | DB + filter every time | Short cache per provider+date |

**Recommendation:** Use Redis for server-side caching. Start with reference data (categories, services, areas), then expand to read-heavy public routes.

---

## Current Architecture (No Caching)

- **Database:** PostgreSQL via Prisma
- **Cache:** None (no Redis, no in-memory cache)
- **Heavy reads:** Public catalog, search, provider profiles, slots

---

## 1. High-Impact Caching Opportunities

### 1.1 Categories (`GET /api/v1/public/categories`)

**Location:** `PublicRepository.getAllCategories()`

**Query:**
```typescript
prisma.serviceCategory.findMany({
  where: { isActive: true },
  orderBy: { name: "asc" },
  select: { id, slug, name, description, image }
})
```

| Factor | Score | Notes |
|--------|-------|-------|
| Read frequency | High | Homepage, nav, filters |
| Write frequency | Very low | Admin only |
| Data size | Small | Typically <50 rows |
| Complexity | Low | Simple `findMany` |

**Cache key:** `public:categories`  
**TTL:** 15 minutes (or invalidate on admin CRUD)  
**Invalidation:** Admin create/update/delete category

---

### 1.2 Category by Slug (`GET /api/v1/public/categories/:slug`)

**Location:** `PublicRepository.getCategoryBySlug(slug)`

**Query:**  
Single `findUnique` with nested `services` (category + services in one query).

| Factor | Score | Notes |
|--------|-------|-------|
| Read frequency | High | Category detail pages |
| Write frequency | Very low | Admin only |
| Data size | Small–medium | 1 category + N services |
| Complexity | Medium | 1 query with relation |

**Cache key:** `public:category:${slug}`  
**TTL:** 15 minutes  
**Invalidation:** Admin update category or its services

---

### 1.3 Services (`GET /api/v1/public/services`, optional `?category=`)

**Location:** `PublicRepository.getAllServices(categorySlugOrId?)`

**Query pattern:**
- If `categorySlugOrId`: 1 lookup for category id (if slug) + 1 `findMany` for services
- Otherwise: 1 `findMany`

| Factor | Score | Notes |
|--------|-------|-------|
| Read frequency | High | Service listings, filters |
| Write frequency | Low | Admin CRUD |
| Data size | Medium | All active services + category |
| Complexity | Low–medium | 1–2 queries |

**Cache keys:**
- All: `public:services:all`
- By category: `public:services:category:${categorySlugOrId}`  

**TTL:** 15 minutes  
**Invalidation:** Admin create/update/delete service or category

---

### 1.4 Service by Slug + Providers (`GET /api/v1/public/services/:slug`)

**Location:** `PublicRepository.getServiceBySlug(slug, skip, limit)`

**Query pattern:**
1. `findUnique` for service
2. `Promise.all([findMany, count])` for providers (paginated)

Total: 3 DB round-trips per request.

| Factor | Score | Notes |
|--------|-------|-------|
| Read frequency | High | Service detail + provider list |
| Write frequency | Low | Admin/service changes |
| Data size | Medium | 1 service + paginated providers |
| Complexity | High | 3 queries, pagination |

**Cache key:** `public:service:${slug}:page:${page}:limit:${limit}` (or skip pagination cache if page varies a lot)

**Alternative:** Cache only the service; cache provider list separately with shorter TTL:
- `public:service:meta:${slug}` (service only) — TTL 15 min
- `public:service:providers:${slug}:${page}:${limit}` — TTL 5 min

**Invalidation:** Admin update service; provider adds/removes service.

---

### 1.5 Search Providers (`GET /api/v1/public/search`)

**Location:** `PublicRepository.searchProviders(filters)`

**Query pattern:**  
Complex `findMany` + `count` with:
- Joins: `ProviderService` → `Service` → `Category` → `ProviderServiceArea` → `Area`
- Filters: category, service, city
- `OR` with `contains` for slug/title/name
- Pagination

| Factor | Score | Notes |
|--------|-------|-------|
| Read frequency | Very high | Main discovery flow |
| Write frequency | Low | Provider/service/area changes |
| Data size | Variable | Depends on filters |
| Complexity | Very high | Multi-table join, `contains`, pagination |

**Cache key:**  
`public:search:${sortKey(category)}:${sortKey(service)}:${sortKey(city)}:${pageNum}:${limitNum}`  
(Use normalized, lowercased filter values for consistency.)

**TTL:** 5–10 minutes (shorter than categories because results can change faster)  
**Invalidation:**  
- Provider approval/rejection  
- Provider adds/removes service or area  
- Admin changes to category, service, or area  

---

### 1.6 Providers List (`GET /api/v1/public/providers`)

**Location:** `PublicRepository.getAllProviders()`

**Query:**  
`findMany` with `servicesOffered` and nested `service`.

| Factor | Score | Notes |
|--------|-------|-------|
| Read frequency | Medium | Provider listing |
| Write frequency | Low | Provider profile/service changes |
| Data size | Medium–large | All approved providers + services |
| Complexity | Medium | Nested includes |

**Cache key:** `public:providers`  
**TTL:** 10 minutes  
**Invalidation:** Provider approval, profile update, or service change.

---

### 1.7 Provider by Slug (`GET /api/v1/public/providers/:slug`)

**Location:** `PublicRepository.getProviderBySlug(slug)`

**Query:**  
Single `findUnique` with:
- `servicesOffered` + `service`
- `reviewsGained` (where `status: VISIBLE`, ordered)

| Factor | Score | Notes |
|--------|-------|-------|
| Read frequency | Very high | Provider detail page |
| Write frequency | Low | Profile/services/reviews |
| Data size | Medium | 1 provider + services + reviews |
| Complexity | Medium | 1 query, multiple relations |

**Cache key:** `public:provider:${slug}`  
**TTL:** 5–10 minutes  
**Invalidation:**
- Provider profile update
- Provider adds/removes service
- New review (or accept slight delay for new reviews)

---

### 1.8 Provider Slots (`GET /api/v1/public/providers/:slug/slots`)

**Location:** `PublicRepository.getAvailableSlots(providerSlug, date)`

**Query:**  
`findMany` by `providerSlug` + `date`, then filter in memory (`bookedSlots < totalSlots`).

| Factor | Score | Notes |
|--------|-------|-------|
| Read frequency | High | During booking flow |
| Write frequency | High | Bookings create/cancel/reschedule |
| Data size | Small | ~3 slots per provider per day |
| Complexity | Low | Simple query + filter |

**Cache key:** `public:slots:${providerSlug}:${dateStr}`  
**TTL:** 2–5 minutes (short because slots change on booking)  
**Invalidation (critical):**
- Create booking
- Cancel booking
- Reschedule booking  

Use event-driven invalidation (e.g. publish event on booking changes) or short TTL.

---

### 1.9 Public Reviews (`GET /api/v1/public/reviews`)

**Location:** `PublicRepository.getPublicReviews(providerId?)`

**Query:**  
`findMany` with `customer`, `provider`, `booking.providerService.service`.

| Factor | Score | Notes |
|--------|-------|-------|
| Read frequency | Medium | Reviews section |
| Write frequency | Medium | New reviews, admin actions |
| Data size | Variable | All or per-provider |
| Complexity | Medium | Joins to customer, provider, booking |

**Cache keys:**
- All: `public:reviews`
- Per provider: `public:reviews:provider:${providerId}`  

**TTL:** 5 minutes  
**Invalidation:** New review, review status change (admin), provider flag.

---

### 1.10 Areas (`GET /api/v1/admin/area`, provider areas)

**Location:** `AreaRepository.findAll()`, provider areas

**Query:**  
`findMany` ordered by city, name.

| Factor | Score | Notes |
|--------|-------|-------|
| Read frequency | Medium | Filters, provider area selection |
| Write frequency | Low | Admin CRUD |
| Data size | Small | Reference list |
| Complexity | Low | Simple `findMany` |

**Cache key:** `admin:areas` or `public:areas` (if exposed)  
**TTL:** 15 minutes  
**Invalidation:** Admin create/update/delete area.

---

## 2. What NOT to Cache

| Data | Reason |
|------|--------|
| **Bookings** | User-specific, transactional, frequently updated |
| **User / Auth** | Security-sensitive, sessions, tokens |
| **Addresses** | User-specific, low volume |
| **Presigned URLs** | One-time, short-lived |
| **Admin operations** | Lower traffic, freshness matters |
| **Customer profile** | User-specific, moderate traffic |

---

## 3. Implementation Roadmap

### Phase 1 — Quick Wins (Low Effort, High Impact)

1. **Categories** — Cache `getAllCategories` and `getCategoryBySlug`
2. **Services** — Cache `getAllServices` (all + by category)
3. **Areas** — Cache `findAll` areas

**Setup:** Add Redis (`ioredis` or `redis`), create `CacheService`, wrap these calls.

---

### Phase 2 — High-Traffic Public Routes

4. **Provider by slug** — Cache `getProviderBySlug`
5. **Search** — Cache `searchProviders` by filter combo
6. **Service by slug** — Cache service meta; optionally cache provider pages

---

### Phase 3 — Slot Caching (Careful Invalidation)

7. **Slots** — Cache with short TTL and strict invalidation on booking create/cancel/reschedule.

---

## 4. Suggested Cache Service API

```typescript
// src/common/cache/cache.service.ts

interface CacheService {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown, ttlSeconds?: number): Promise<void>;
  del(key: string): Promise<void>;
  delPattern(pattern: string): Promise<void>;  // e.g. "public:category:*"
}
```

**Usage pattern:**
```typescript
const cacheKey = `public:categories`;
let data = await cache.get<Category[]>(cacheKey);
if (!data) {
  data = await this.publicRepository.getAllCategories();
  await cache.set(cacheKey, data, 900); // 15 min
}
return data;
```

---

## 5. Invalidation Map

| Event | Cache Keys to Invalidate |
|-------|---------------------------|
| Admin: create/update/delete category | `public:categories`, `public:category:*`, `public:services:*` |
| Admin: create/update/delete service | `public:services:*`, `public:service:*`, `public:search:*` |
| Admin: create/update/delete area | `admin:areas`, `public:search:*` |
| Provider: profile update | `public:provider:${slug}`, `public:providers` |
| Provider: add/remove service | `public:provider:${slug}`, `public:providers`, `public:service:*`, `public:search:*` |
| Provider: approved/rejected | `public:providers`, `public:provider:${slug}`, `public:search:*` |
| Customer: create booking | `public:slots:${providerSlug}:${date}` |
| Customer: cancel/reschedule | `public:slots:${providerSlug}:${oldDate}`, `public:slots:${providerSlug}:${newDate}` |
| Customer: create review | `public:provider:${slug}`, `public:reviews`, `public:reviews:provider:${id}` |

---

## 6. Environment & Dependencies

**Add to `package.json`:**
```json
"ioredis": "^5.x"
```

**Add to `env.ts`:**
```typescript
REDIS_URL: z.string().optional(),  // optional for local dev without Redis
```

**Graceful degradation:** If `REDIS_URL` is not set, skip cache and hit DB directly. This keeps local development simple.

---

## 7. Database Query Optimizations (No Cache)

If you want to reduce load before adding Redis:

1. **Indexes (already present):**
   - `ServiceCategory`: `isActive`
   - `Service`: `categoryId`, `isActive`
   - `ProviderProfile`: `status`
   - `ProviderService`: `serviceId`, `isAvailable`, `providerId`
   - `ProviderSlot`: unique on `(providerSlug, date, slot)`

2. **`getAllServices` with category filter:**  
   - Avoid extra `findUnique` for category when slug is given: consider caching category slug→id mapping or a single query that uses a subquery.

3. **`searchProviders`:**  
   - `contains` with `mode: "insensitive"` can be slow at scale. Consider:
     - Full-text search (PostgreSQL `@@`) for text fields
     - Precomputed search index (e.g. Elasticsearch) for advanced search

4. **Select only needed fields:**  
   - Already done in most places; keep avoiding `include`/`select: true` where not needed.

---

## 8. Summary Table

| Endpoint | Priority | TTL | Cache Key Pattern | Invalidation |
|----------|----------|-----|-------------------|--------------|
| `GET /public/categories` | P0 | 15 min | `public:categories` | Admin category CRUD |
| `GET /public/categories/:slug` | P0 | 15 min | `public:category:${slug}` | Admin category/service |
| `GET /public/services` | P0 | 15 min | `public:services:all` or `:category:${id}` | Admin service |
| `GET /public/services/:slug` | P1 | 5–15 min | `public:service:${slug}:page:${n}` | Admin/service |
| `GET /public/search` | P1 | 5–10 min | `public:search:${filters}` | Provider/admin |
| `GET /public/providers` | P1 | 10 min | `public:providers` | Provider approval/profile |
| `GET /public/providers/:slug` | P1 | 5–10 min | `public:provider:${slug}` | Profile/service/review |
| `GET /public/providers/:slug/slots` | P2 | 2–5 min | `public:slots:${slug}:${date}` | Booking create/cancel/reschedule |
| `GET /public/reviews` | P1 | 5 min | `public:reviews` or `:provider:${id}` | Review create/admin |
| `GET /admin/area` | P0 | 15 min | `admin:areas` | Admin area CRUD |

---

*Document created from backend codebase analysis. Last updated: March 2025.*
