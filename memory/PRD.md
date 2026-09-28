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

## Backlog
- P1: Admin approve → publish registration as gym listing; admin auth
- P1: WordPress REST adapter swap (ACF field mapping)
- P2: Map view of results, gym gallery, rate limiting on uploads/registrations
