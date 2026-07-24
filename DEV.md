## AiGENThix CMS v2 – Developer KT (Minimal, High-Signal)

### 1. High-Level System Overview
- **backend-v2**: FastAPI + PostgreSQL backend. Owns auth, blogs CRUD, caching, migrations.
- **cms-admin-v2**: Next.js (App Router, TS) admin dashboard for managing blogs via backend admin APIs.
- **website-v2**: Public React (Vite) site that reads published blogs via backend public APIs.

Data flow:
- **Admin portal** → `/api/auth/login` (JWT) → `/api/admin/blogs*`  
- **Public site** → `/api/blogs/page-data` and `/api/blogs/{slug}` (no auth).

---

### 2. Backend (`backend-v2`) – What Lives Where
- **Entry & wiring**
  - `app/main.py`: Creates `FastAPI` app, CORS, rate limiting, logging, includes routers:
    - `app.api.auth` – login & JWT
    - `app.api.blogs` – public blog read
    - `app.api.admin` – admin blog CRUD, bulk ops, image upload
  - Health + root endpoints; startup runs migrations + creates default admin.

- **Core layer (`app/core`)**
  - `config.py`: `settings` (env, `APP_NAME`, DB URL, CORS, rate limits, admin seed).
  - `database.py`: DB connection + `get_db` dependency (cursor per-request).
  - `cache.py`: `cache_service` (Redis-backed, safe fallbacks, TTL control).
  - `logging.py`: `setup_logging`, `get_logger`.
  - `migrations.py`: `run_migrations`, `create_default_admin`.
  - `security.py`: password hashing, JWT helpers.

- **Domain models (`app/schemas`)**
  - `blog.py`: `BlogCreate`, `BlogUpdate`, `BlogPublic`, `BlogListItem`, `BlogPageData`.
  - `auth.py`: `LoginRequest`, `LoginResponse`.
  - `responses.py`: generic `SuccessResponse[T]`, `ErrorResponse`, `HealthCheckResponse`.

- **Data access (`app/repositories`)**
  - `blog_repository.py`:
    - Methods: `get_by_id`, `get_by_slug`, `get_all`, `get_featured`, `create`, `update`,
      `delete`, `toggle_published`, `toggle_featured`, `bulk_update_published`, `bulk_delete`.
    - Handles SQL, JSON fields (`tags`), read-time computation, ordering, limits.
  - `user_repository.py`: user lookup by email/id for auth and admin seeding.

- **Business logic (`app/services`)**
  - `blog_service.py`:
    - Uses `BlogRepository` + `cache_service`.
    - Public read: `get_blog_by_slug`, `get_page_data` (featured + latest + popular).
    - Admin: `get_blog_by_id`, `get_all_blogs`, `create_blog`, `update_blog`,
      `delete_blog`, `toggle_published`, `toggle_featured`, `bulk_*`.
    - Converts DB rows → `BlogPublic` / `BlogListItem`, enforces 404/500s, cache invalidation.
  - `auth_service.py`: verifies credentials, issues JWTs.
  - `upload_service.py`: Cloudinary integration (`upload_image`).

- **API layer (`app/api`)**
  - `auth.py`:
    - `POST /api/auth/login` → `AuthService.authenticate_user` (rate limited).
  - `blogs.py`:
    - `GET /api/blogs/page-data` → `BlogService.get_page_data` (cached).
    - `GET /api/blogs/{slug}` → `BlogService.get_blog_by_slug` (cached).
  - `admin.py` (auth required via `get_current_user` from `app.middleware.auth`):
    - `GET /api/admin/blogs` → list (published or all).
    - `GET /api/admin/blogs/{id}` → single blog.
    - `POST /api/admin/blogs` → create.
    - `PUT /api/admin/blogs/{id}` → update.
    - `DELETE /api/admin/blogs/{id}` → delete.
    - `PATCH /api/admin/blogs/{id}/publish|featured` → toggles.
    - `POST /api/admin/blogs/bulk/*` → bulk publish/unpublish/delete.
    - `POST /api/admin/upload/image` → image upload via `upload_service`.

**If you change blog-related behaviour**, touch:
- DB shape → `migrations.py` + SQL + `blog_repository.py` + `blog.py` schemas.
- Business rules, caching, derived fields → `blog_service.py`.
- HTTP contracts → `app/api/*.py` and keep `cms-admin-v2` + `website-v2` in sync.

---

### 3. Admin Portal (`cms-admin-v2`) – How It Talks to Backend
- **Core idea**: All network calls go through a typed `apiClient`; features use hooks; UI is in small, focused components.

- **Config & types**
  - `src/lib/config.ts`: `API_URL`, timeouts, environment settings.
  - `src/types/*`: `Blog`, `BlogFormData`, `User`, `ApiResponse<T>`, etc.

- **API client (`src/lib/api`)**
  - `client.ts`:
    - `apiClient.get/post/put/patch/delete/upload` – JSON + multipart helpers.
    - Adds JWT from `localStorage`, enforces timeouts, throws `ApiError` with `status` + `endpoint`.
  - `blogs.ts`:
    - Wraps backend endpoints: `getAll`, `getById`, `create`, `update`, `delete`,
      `togglePublish`, `toggleFeatured`, `bulk*`, `uploadImage`.
  - `auth.ts`: `login`, `saveAuth`, `clearAuth`, `getStoredUser`.

- **Hooks (`src/lib/hooks`)**
  - `useAuth`:
    - Reads user from storage on mount, exposes `{ user, isAuthenticated, login, logout }`.
  - `useBlogs`:
    - Fetches admin blog list via `blogsApi.getAll`, exposes `{ blogs, loading, error, refetch }`.
  - `useBlog`:
    - Fetches single blog by ID for edit page.
  - `useBlogMutations`:
    - Wraps create/update/delete/toggle/bulk calls.
    - Handles navigation after success (e.g., back to dashboard).

- **Pages (`src/app`)**
  - `login/page.tsx`: uses `useAuth().login` + redirects.
  - `dashboard/page.tsx`: uses `useBlogs` + `useBlogMutations` to show/manage list.
  - `blogs/new/page.tsx`:
    - `BlogForm` with `mode="create"` and `onSubmit={createBlog}`.
  - `blogs/edit/[id]/page.tsx`:
    - Resolves `id`, loads blog via `useBlog`, passes to `BlogForm` with `mode="edit"`.

- **Shared Blog form (`src/components/forms/BlogForm`)**
  - `index.tsx`:
    - Owns `formData` (`BlogFormData`), section navigation, and validation (title/content required).
    - Delegates UI to:
      - `BasicInfoSection`, `ContentSection`, `MediaSection`,
        `AuthorSection`, `SettingsSection`, `SectionNav`.
    - Calls `onSubmit(formData)` and relies on mutation hook to handle side effects.

**To add/change admin behaviour**:
- New backend endpoint → add method in `blogs.ts` (or new API file) → hook → component.
- New blog field → update:
  - Backend `schemas.blog`, DB/migrations, repository, service.
  - `cms-admin-v2` `BlogFormData` + form sections + table views.

---

### 4. Public Website (`website-v2`) – How It Uses Backend
- **Routing & layout**
  - `src/App.jsx`: React Router; `Layout` + `ErrorBoundary`; many lazy-loaded routes.
  - Home route (`/`): composed sections (`Hero`, `TryOur`, `ServicesSection`, `Blog`, etc.).

- **Backend integration**
  - `src/lib/config.js`: provides `API_URL` (from env).
  - `src/services/blogService.js`:
    - `blogService.getPageData()` → `GET /api/blogs/page-data` (uses shared `fetchJson` helper).
    - `blogService.getBlogBySlug(slug)` → `GET /api/blogs/{slug}`.
    - Standardized timeout, JSON parsing, error messages.
  - UI components (e.g. blog listing + `BlogDetails`) call `blogService` and map data to cards/pages.

- **Shared utilities (`src/utils`)**
  - `image.js`: `optimizeImage` (sizes URLs for responsive images).
  - `date.js`: `formatDate`.
  - `text.js`: `truncateText`.

**If you change public data shape**:
- Backend `BlogPublic` / `BlogPageData` → update `blogService.js` expectations and consuming components.

---

### 5. Local Dev – Minimal Commands
- **Backend**
  - `cd backend-v2`
  - `pip install -r requirements.txt`
  - Configure `.env` as per `backend-v2/README.md` (DB, JWT, Cloudinary, Redis).
  - `uvicorn app.main:app --reload`

- **Admin**
  - `cd cms-admin-v2`
  - `npm install`
  - `.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:8000`
  - `npm run dev`

- **Website**
  - `cd website-v2`
  - `npm install`
  - `.env` (or `.env.local`): `VITE_API_URL=http://localhost:8000`
  - `npm run dev`

- **Deployed (different hosts / domains)**
  - Backend (Render / AWS / other): deploy `backend-v2` and expose HTTPS base URL, e.g. `https://api.example.com`; set `CORS_ORIGINS=https://cms.example.com,https://example.com`.
  - Admin (Vercel / Netlify / other): deploy `cms-admin-v2` and set `NEXT_PUBLIC_API_URL=https://api.example.com`.
  - Website (Vercel / Netlify / static host): deploy `website-v2` and set `VITE_API_URL=https://api.example.com`.

---

### 6. Safe Places to Extend
- **New blog-related backend features**: add methods in `BlogService` + `BlogRepository`, expose via `app/api/admin.py` or `app/api/blogs.py`.
- **New admin UI flows**: keep logic in hooks (`src/lib/hooks`) + API modules; keep pages and components mostly presentational.
- **New public pages/sections**: add routes in `src/App.jsx`, keep API calls in `services` and formatting in `utils`.

