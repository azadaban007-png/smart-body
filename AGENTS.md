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

## Hero scroll video

- `website/public/videos/hero.mp4` is the original source: 193 frames at 24fps but
  only one keyframe. Random seeks decode up to eight seconds of dependent frames;
  preloading or serializing seeks alone does not solve the visible lag.
- The hero uses `hero-scroll.mp4`: the same dimensions (1280×704) and 193 frames,
  H.264 all-intra, no audio, with the MP4 index at the start. Its 24fps encoding
  must match the frame mapping in `components/hero-section.tsx`.
- The hero is pinned: `hero-section.tsx` wraps the `<section>` in a `h-[300vh]`
  stage with the section `sticky top-0 h-[100svh]`. The video timeline maps to the
  scroll distance across that stage (stage height minus one viewport), so the
  video scrubs forward scrolling down and backward scrolling up over ~2 screens,
  then the hero releases and the featured section follows.
- To regenerate with FFmpeg (in a disposable runtime container, not on the host):
  `ffmpeg -i hero.mp4 -map 0:v:0 -an -c:v libx264 -preset fast -crf 21 -g 1 -keyint_min 1 -bf 0 -pix_fmt yuv420p -movflags +faststart hero-scroll.mp4`.
- Verify fast continuous forward/reverse scrolling using
  `requestVideoFrameCallback`'s **presented** `mediaTime`; `currentTime` changes
  before the requested frame is displayed and alone cannot prove synchronization.
  Also check jumps past the hero (last frame), return to top (first frame), and
  resizing. Type-check with `docker compose -f docker-compose.base44.yml exec -T web pnpm exec tsc --noEmit --incremental false`.
