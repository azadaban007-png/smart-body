# Smart Body — sandbox notes

Persian (RTL) gym directory: FastAPI + MongoDB API (`backend/`) and a Create React App + Craco frontend (`frontend/`).
`wordpress/smart-body-core/` is an optional WordPress plugin that can replace the built-in catalog.

## Run it (Base44 sandbox)

```bash
docker compose -f docker-compose.base44.yml up -d --build
```

- `web` (host 3000) — `yarn start` with the source bind-mounted; `node_modules` lives in a named volume and is
  synced by `yarn install` on every container start (the repo has no lockfile, so install is not frozen).
- `api` (host 8000) — `uvicorn server:app --reload`; dependencies are installed in `backend/Dockerfile.base44`.
- `mongo` — internal only, database `smart_body`; sample catalog is seeded on API startup.

The client talks to the API cross-origin through `REACT_APP_BACKEND_URL` (set in compose from
`BASE44_PUBLIC_HOST_SUFFIX`), so `CORS_ORIGINS` on the API must list the web origin. Both are compose values —
never hardcode the resolved host.

## Non-obvious setup facts

- `emergentintegrations==0.2.1` in `backend/requirements.txt` only resolves from Emergent's private index and nothing
  in the code imports it, so `backend/Dockerfile.base44` filters that line out. Do not add it to a public build.
- `httpx` is imported by `backend/wordpress.py` but was missing from `requirements.txt`; it is now pinned there.
- Image uploads (`POST /api/uploads`, used by the gym registration form) go through the external Emergent object
  store and need `EMERGENT_LLM_KEY`. Without it the API logs `Storage init failed` at startup (non-fatal) and uploads
  return 502. Everything else — home, search, gym detail, admin — works on sample data.
- WordPress is optional: with no `WP_BASE_URL` the API serves `backend/seed_data.py` and reports
  `activeSource: sample` on `/api/integrations/wordpress/status`. Configured-but-unreachable WordPress falls back to
  sample data after a 60s cooldown.
- The CRA dev server accepts the preview proxy's host header as-is; no `allowedHosts` change is needed.

## Verify

```bash
curl -s http://localhost:3000/ | head            # dev bundle is served from source
curl -s http://localhost:8000/api/gyms | head    # seeded catalog
docker compose -f docker-compose.base44.yml exec -T api \
  sh -c 'REACT_APP_BACKEND_URL=http://localhost:8000 pytest tests/backend_test.py -k "TestCatalog" -q'
```

`backend/tests/*` read the target from `REACT_APP_BACKEND_URL`; the upload/registration tests write records to the
database, so they are not run against a workspace you want to keep clean.
