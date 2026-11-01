# Base44 notes

This repository contains an unrelated older app (`backend/`, `frontend/` — a FastAPI + CRA
"Smart Body" platform). The Base44 preview does **not** run that app. It runs the Next.js
site in `website/`, served on host port 3000.

## What the preview runs

`website/` — a Next.js 16 (App Router, Turbopack) + Tailwind v4 + pnpm single-page marketing
site for "Shadi Ghader" architecture & interior design studio (bilingual EN/FA, RTL aware).

## Run it

```
docker compose -f docker-compose.base44.yml up -d --build
```

- `website/Dockerfile.base44` installs dependencies from the lockfile (`--frozen-lockfile`)
  in the image layer, then runs `next dev -H 0.0.0.0 -p 3000`. Source is bind-mounted at
  runtime, so edits hot-reload without a rebuild. Rebuild only when `package.json`,
  `pnpm-lock.yaml`, or `pnpm-workspace.yaml` change.
- Anonymous volumes keep the image's `node_modules`/`.next` over the bind mount.
- Healthcheck probes `GET /` on port 3000.

## Sandbox-only overrides (gated on `BASE44_PREVIEW_MODE === "1"`)

- `website/next.config.mjs` appends `allowedDevOrigins` for the Base44 preview proxy
  (`3000-$BASE44_PUBLIC_HOST_SUFFIX` and `*.$BASE44_SANDBOX_HOST_DOMAIN`) so the dev server
  accepts the preview origin/host. With the flag unset, `next.config.mjs` is unchanged.

## Fixes applied during setup

- `website/pnpm-workspace.yaml` had an invalid `pmOnFail: ignore` key (not a real pnpm
  setting) that broke `pnpm install --frozen-lockfile`. Removed; only the valid
  `minimumReleaseAgeExclude` block remains.
- Mobile horizontal overflow: the site header overflowed by ~36px on small screens
  (logo wordmark + FA/EN toggle + menu button too wide). Fixed in
  `website/components/logo.tsx` by hiding the logo text column below the `sm` breakpoint
  (only the "SG" monogram shows on mobile). Desktop is unaffected.

## Verify it works

```
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/   # expect 200
```

Page sections (hero, featured, projects, philosophy, services, footer), the EN/FA language
toggle, and the mobile menu have been exercised in the preview.
