# Smart Body (بدن هوشمند) — PRD

## Original Problem Statement
Premium, modern Persian RTL sports platform "Smart Body" connecting athletes with gyms. Homepage: sticky glass header, cinematic hero with City + Street/Neighborhood search, ONE horizontal sports strip, Top Gyms horizontal carousel, gym-owner CTA, services, footer. Light/Dark mode (localStorage). Gym registration with landing-page request. Single gym data source powering Top Gyms, search, cards and detail. WordPress-ready modular architecture.

User note: "Build the project with a clean, scalable architecture so it can later connect to a WordPress REST API without major frontend changes. Keep the current implementation simple and focused on the homepage, gym search/listing, and gym registration flow. Use reusable components and realistic sample gym data. Do not add unnecessary features or pages at this stage."

## User Choices
- Registrations saved to FastAPI + MongoDB
- Real image upload (Emergent object storage)
- Gym detail page /gym/:slug
- Gyms served from /api/gyms (mirrors future WP REST)
- Simple admin list /admin (no auth, prototype)

## Architecture
- Backend: server.py (API), seed_data.py (cities/sports/gyms = future WP taxonomies + `gym` CPT), storage.py (object storage)
- Endpoints: GET /api/gyms (city, q, sport, featured, limit), GET /api/gyms/{slug}, GET /api/cities, GET /api/sports, POST /api/uploads, GET /api/files/{path}, POST/GET /api/registrations
- Frontend: services/api.js (single adapter + mapGym), config/site.js (static content), context (Theme, Catalog), components (layout, home, gym, search, register, common), pages (Home, Search, GymDetail, RegisterGym, Admin)
- Persian-normalized location search (ی/ک, ZWNJ, digits, generic words like خیابان/میدان stripped)

## Implemented (2026-06)
- Full homepage (hero + glass search, sports strip, top gyms carousel, about/how-it-works, owner CTA, bento services, footer)
- Light/Dark themes with persistence, RTL, Vazirmatn, responsive, horizontal snap scrollers
- Search results page with sport filter + empty state; gym detail with related gyms
- Registration flow with validation, image upload, sports picker, landing-page yes/no; success state
- Admin list with stats, tabs, search
- Tested: backend 100%, frontend 100% (iteration_1)

## WordPress Integration (2026-06, iteration_2 passed 100%)
- Plugin /app/wordpress/smart-body-core (+ smart-body-core.zip), no ACF: CPT `gym`, taxonomies `city`/`sport`, gym meta, REST `smartbody/v1` (status, cities, sports, gyms, gyms/{slug}, registrations GET/POST via Application Password)
- wp-admin: gym fields meta box, columns, landing-page status filter, "در انتظار تأیید" + "درخواست‌های لندینگ پیج" menus, "تأیید و انتشار" row action, term meta UI (province, sport image/featured/order), tools page with idempotent sample import (sample-data.json generated from backend seed via /app/scripts/export_wp_sample_data.py)
- Backend: wordpress.py (client, 60s down-cooldown, 5-min catalog cache), repository.py (WP first → sample fallback, X-Data-Source header), registrations.py (local outbox + background push to WP as pending post with media upload, idempotent externalId, retry endpoint), GET /api/integrations/wordpress/status
- Env: WP_BASE_URL, WP_USERNAME, WP_APP_PASSWORD, WP_TIMEOUT_SECONDS (currently empty → sample data)
- Admin /admin: WP status banner, per-registration sync badge, retry, edit-in-WP link

## Backlog
- P0: User to provide real WP URL + Application Password; install plugin on real site
- P1: Admin auth for /admin

## Backlog
- P2: Map view of results, gym gallery, rate limiting on uploads/registrations
