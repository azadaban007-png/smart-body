"""HTTP client for the Smart Body Core WordPress plugin (REST namespace smartbody/v1)."""
import logging
import os
import time
from typing import Optional

import httpx

logger = logging.getLogger(__name__)

NAMESPACE = "/wp-json/smartbody/v1"
DEFAULT_IMAGE = "https://images.unsplash.com/photo-1623874514711-0f321325f318?auto=format&fit=crop&w=1200&q=80"
DOWN_COOLDOWN_SECONDS = 60
CATALOG_TTL_SECONDS = 300


class WordPressError(Exception):
    pass


class WordPressNotFound(WordPressError):
    pass


def _sport(raw: dict) -> dict:
    return {
        "slug": raw.get("slug", ""),
        "name": raw.get("name", ""),
        "image": raw.get("image") or DEFAULT_IMAGE,
        "featured": bool(raw.get("featured")),
    }


def _city(raw: dict) -> dict:
    return {"slug": raw.get("slug", ""), "name": raw.get("name", ""), "province": raw.get("province") or ""}


def _gym(raw: dict) -> dict:
    """Guarantees the exact gym shape the frontend expects, whatever the WP payload contains."""
    return {
        "id": str(raw.get("id", "")),
        "slug": raw.get("slug", ""),
        "name": raw.get("name", ""),
        "city": raw.get("city") or "",
        "address": raw.get("address") or "",
        "neighborhood": raw.get("neighborhood") or "",
        "street": raw.get("street") or "",
        "phone": raw.get("phone") or "",
        "image": raw.get("image") or DEFAULT_IMAGE,
        "sports": [_sport(s) for s in raw.get("sports") or []],
        "rating": float(raw.get("rating") or 0),
        "description": raw.get("description") or "",
        "status": raw.get("status") or "publish",
        "featured": bool(raw.get("featured")),
        "badge": raw.get("badge") or None,
        "landingPageRequested": bool(raw.get("landingPageRequested")),
        "landingPageUrl": raw.get("landingPageUrl") or None,
    }


class WordPressClient:
    name = "wordpress"

    def __init__(self):
        self.base_url = (os.environ.get("WP_BASE_URL") or "").strip().rstrip("/")
        self.username = (os.environ.get("WP_USERNAME") or "").strip()
        self.app_password = (os.environ.get("WP_APP_PASSWORD") or "").strip()
        self.timeout = float(os.environ.get("WP_TIMEOUT_SECONDS") or 6)
        self._down_until = 0.0
        self._cache: dict = {}

    @property
    def configured(self) -> bool:
        return bool(self.base_url)

    @property
    def can_write(self) -> bool:
        return self.configured and bool(self.username and self.app_password)

    @property
    def available(self) -> bool:
        return self.configured and time.monotonic() >= self._down_until

    def _mark_down(self, reason: str) -> None:
        self._down_until = time.monotonic() + DOWN_COOLDOWN_SECONDS
        logger.warning("WordPress unavailable (%s); using fallback for %ss", reason, DOWN_COOLDOWN_SECONDS)

    async def _request(self, method: str, path: str, *, auth: bool = False, **kwargs):
        if not self.configured:
            raise WordPressError("WordPress is not configured")
        url = f"{self.base_url}{path}"
        credentials = (self.username, self.app_password) if auth and self.can_write else None
        try:
            async with httpx.AsyncClient(timeout=self.timeout, follow_redirects=True) as client:
                resp = await client.request(method, url, auth=credentials, **kwargs)
        except httpx.HTTPError as exc:
            self._mark_down(type(exc).__name__)
            raise WordPressError(f"WordPress unreachable: {exc}") from exc

        try:
            body = resp.json()
        except ValueError:
            body = None
        code = body.get("code") if isinstance(body, dict) else None
        if resp.status_code == 404 and code == "sb_not_found":
            raise WordPressNotFound(code)
        if resp.status_code >= 500 or code == "rest_no_route" or body is None:
            self._mark_down(f"HTTP {resp.status_code} {code or ''}".strip())
            raise WordPressError(f"WordPress error: HTTP {resp.status_code} {code or ''}".strip())
        if resp.status_code >= 400:
            message = body.get("message") if isinstance(body, dict) else resp.text[:200]
            raise WordPressError(f"HTTP {resp.status_code}: {message}")
        self._down_until = 0.0
        return body

    async def _cached(self, key: str, path: str):
        hit = self._cache.get(key)
        if hit and hit[0] > time.monotonic():
            return hit[1]
        data = await self._request("GET", f"{NAMESPACE}{path}")
        self._cache[key] = (time.monotonic() + CATALOG_TTL_SECONDS, data)
        return data

    # ---------- Reads ----------
    async def status(self) -> dict:
        return await self._request("GET", f"{NAMESPACE}/status")

    async def cities(self) -> list:
        return [_city(c) for c in await self._cached("cities", "/cities")]

    async def sports(self) -> list:
        return [_sport(s) for s in await self._cached("sports", "/sports")]

    async def list_gyms(self, **filters) -> list:
        params = {k: (str(v).lower() if isinstance(v, bool) else v) for k, v in filters.items() if v not in (None, "")}
        return [_gym(g) for g in await self._request("GET", f"{NAMESPACE}/gyms", params=params)]

    async def get_gym(self, slug: str) -> Optional[dict]:
        try:
            return _gym(await self._request("GET", f"{NAMESPACE}/gyms/{slug}"))
        except WordPressNotFound:
            return None

    # ---------- Writes (Application Password) ----------
    async def upload_media(self, data: bytes, filename: str, content_type: str) -> dict:
        headers = {"Content-Type": content_type, "Content-Disposition": f'attachment; filename="{filename}"'}
        return await self._request("POST", "/wp-json/wp/v2/media", auth=True, content=data, headers=headers)

    async def create_registration(self, payload: dict) -> dict:
        return await self._request("POST", f"{NAMESPACE}/registrations", auth=True, json=payload)
