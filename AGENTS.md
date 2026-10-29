# Shadi Ghader — Backend + Admin CMS

A lightweight backend + admin CMS for the Shadi Ghader architecture & interior design studio website.
The public frontend (built separately in Lovable) consumes the public API; this repo provides the
API, database, and admin panel only.

## Stack
- **API**: Node.js + Express + TypeScript (`api/`), Prisma ORM, PostgreSQL
- **Admin panel**: React + Vite + TypeScript + Tailwind (`admin/`)
- **DB**: PostgreSQL (compose service)
- **Auth**: JWT (`bcryptjs`) — admin users only

## Run (sandbox / local)
```
docker compose -f docker-compose.base44.yml up -d --build
```
- Admin panel: http://localhost:3000  (mapped from Vite dev server on 5173)
- API: http://localhost:8000/api
- Default admin: `admin@shadighader.com` / `admin12345` (change via env or `/admin/password`)

The `api` service runs `npm install`, `prisma generate`, `prisma db push`, seeds, then `tsx watch`.
The `admin` service runs `npm install` then `vite`. The admin dev server proxies `/api` to the API
service (`VITE_API_PROXY_TARGET`), so the browser uses a single origin.

## Architecture
```
Public frontend (Lovable) ──► /api/* (public)        ──► PostgreSQL
Admin panel (/)           ──► /api/admin/* (auth)    ──► PostgreSQL
```
Public endpoints never expose draft/unpublished content or admin functionality.

## Key entities (Prisma schema: `api/prisma/schema.prisma`)
- `Project` (+ `GalleryImage`) — bilingual fields, featured flag (only one featured), publish toggle
- `Service`, `Philosophy`, `HomepageSettings`, `WebsiteSettings` — single-row content
- `ContactInquiry` — public submission, admin-managed status
- `PageSeo` — per-page SEO metadata
- `Media` — uploaded images (JPG/PNG/WEBP) stored on disk, served at `/api/media/<file>`
- `AdminUser` — JWT-authenticated

## Public API
`GET /api/projects` `GET /api/projects/featured` `GET /api/projects/:slug`
`GET /api/services` `GET /api/philosophy` `GET /api/homepage` `GET /api/settings`
`POST /api/inquiries` `GET /api/seo/:page` `GET /api/media/:file`

## Admin API (Bearer JWT)
`/api/admin/login` `/api/admin/me` `/api/admin/dashboard`
`/api/admin/projects` (CRUD + `/feature` `/publish` + gallery)
`/api/admin/services` `/api/admin/philosophy` `/api/admin/homepage`
`/api/admin/settings` `/api/admin/inquiries` `/api/admin/seo` `/api/admin/media`

## Notes
- `JWT_SECRET` and `ADMIN_PASSWORD` default to dev values in compose; override with real secrets for production.
- Seed data (Niavaran Villa, services, philosophy, settings) is inserted only on first boot (idempotent).
- Uploaded images live in the `api_uploads` volume; URLs are relative (`/api/media/<file>`).
