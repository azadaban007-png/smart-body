"""WordPress integration tests: catalog source header, status, registration sync, fallback."""
import io
import os
import time

import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE_URL:
    with open("/app/frontend/.env") as f:
        for line in f:
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.split("=", 1)[1].strip().rstrip("/")
                break
API = f"{BASE_URL}/api"

PNG = (
    b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01"
    b"\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0cIDATx\x9cc\xf8\xcf\xc0"
    b"\x00\x00\x00\x03\x00\x01\x5e\xf3\x2a\x3f\x00\x00\x00\x00IEND\xaeB`\x82"
)


@pytest.fixture(scope="module")
def s():
    return requests.Session()


# ---------- Status ----------
class TestWordPressStatus:
    def test_status(self, s):
        r = s.get(f"{API}/integrations/wordpress/status")
        assert r.status_code == 200
        d = r.json()
        assert d["configured"] is True
        assert d["canWrite"] is True
        assert d["reachable"] is True
        assert d["pluginVersion"] == "1.0.0"
        assert d["activeSource"] == "wordpress"
        assert d["error"] is None


# ---------- Catalog source header ----------
class TestCatalogSource:
    @pytest.mark.parametrize("path", ["/gyms", "/cities", "/sports"])
    def test_x_data_source_wordpress(self, s, path):
        r = s.get(f"{API}{path}")
        assert r.status_code == 200
        assert r.headers.get("X-Data-Source") == "wordpress", f"{path}: {r.headers}"

    def test_gym_detail_source(self, s):
        # try any gym slug returned by list
        gyms = s.get(f"{API}/gyms").json()
        assert gyms, "no gyms returned"
        slug = gyms[0]["slug"]
        r = s.get(f"{API}/gyms/{slug}")
        assert r.status_code == 200
        assert r.headers.get("X-Data-Source") == "wordpress"

    def test_gym_404(self, s):
        assert s.get(f"{API}/gyms/nope").status_code == 404

    @pytest.mark.parametrize("city,q,slug", [
        ("همدان", "خیابان بوعلی", "energy"),
        ("اصفهان", "چهار باغ", "aseman"),
    ])
    def test_search(self, s, city, q, slug):
        r = s.get(f"{API}/gyms", params={"city": city, "q": q})
        assert r.status_code == 200
        assert slug in [g["slug"] for g in r.json()]

    def test_sport_yoga(self, s):
        r = s.get(f"{API}/gyms", params={"sport": "yoga"})
        assert r.status_code == 200
        gyms = r.json()
        assert gyms
        for g in gyms:
            assert any(sp["slug"] == "yoga" for sp in g["sports"])


# ---------- Registration WP sync E2E ----------
@pytest.fixture(scope="module")
def uploaded_path(s):
    r = s.post(f"{API}/uploads", files={"file": ("t.png", PNG, "image/png")})
    assert r.status_code == 201, r.text
    return r.json()["path"]


class TestRegistrationSync:
    def test_create_and_sync(self, s, uploaded_path):
        payload = {
            "gymName": "TEST_WP_باشگاه سینک",
            "managerName": "مدیر تست",
            "phone": "۰۹۱۲۳۴۵۶۷۸۹",
            "city": "همدان",
            "neighborhood": "بوعلی",
            "address": "خیابان تست پلاک ۵",
            "imagePath": uploaded_path,
            "sports": ["bodybuilding", "yoga"],
            "landingPageRequested": True,
        }
        r = s.post(f"{API}/registrations", json=payload)
        assert r.status_code == 201, r.text
        d = r.json()
        assert d["landingPageStatus"] == "requested"
        assert d["phone"] == "09123456789"
        assert d["wpSync"]["status"] == "pending"
        reg_id = d["id"]
        pytest.wp_reg_id = reg_id

        # wait for background sync
        deadline = time.time() + 20
        last = None
        while time.time() < deadline:
            time.sleep(1.5)
            items = s.get(f"{API}/registrations").json()
            match = next((x for x in items if x["id"] == reg_id), None)
            assert match, "registration not in list"
            last = match["wpSync"]
            if last["status"] == "synced":
                break
        assert last and last["status"] == "synced", f"final wpSync={last}"
        assert last.get("postId")
        assert last.get("editLink")

    def test_resync_no_duplicate(self, s):
        reg_id = getattr(pytest, "wp_reg_id", None)
        assert reg_id
        r = s.post(f"{API}/registrations/{reg_id}/sync")
        assert r.status_code == 200
        d = r.json()
        assert d["wpSync"]["status"] == "synced"

    def test_sync_invalid_id_404(self, s):
        assert s.post(f"{API}/registrations/507f1f77bcf86cd799439011/sync").status_code == 404
        assert s.post(f"{API}/registrations/not-a-real-id/sync").status_code == 404


# ---------- Validation with active catalog ----------
class TestValidation:
    def test_unknown_city_422(self, s, uploaded_path):
        payload = {
            "gymName": "TEST_x", "managerName": "y", "phone": "09123456789",
            "city": "NowhereCity", "neighborhood": "aa", "address": "some address here",
            "imagePath": uploaded_path, "sports": ["bodybuilding"], "landingPageRequested": False,
        }
        assert s.post(f"{API}/registrations", json=payload).status_code == 422

    def test_unknown_sport_422(self, s, uploaded_path):
        payload = {
            "gymName": "TEST_x", "managerName": "y", "phone": "09123456789",
            "city": "همدان", "neighborhood": "aa", "address": "some address here",
            "imagePath": uploaded_path, "sports": ["totally-fake"], "landingPageRequested": False,
        }
        assert s.post(f"{API}/registrations", json=payload).status_code == 422

    def test_bad_phone_422(self, s, uploaded_path):
        payload = {
            "gymName": "TEST_x", "managerName": "y", "phone": "12345",
            "city": "همدان", "neighborhood": "aa", "address": "some address here",
            "imagePath": uploaded_path, "sports": ["bodybuilding"], "landingPageRequested": False,
        }
        assert s.post(f"{API}/registrations", json=payload).status_code == 422

    def test_unknown_image_400(self, s):
        payload = {
            "gymName": "TEST_x", "managerName": "yy", "phone": "09123456789",
            "city": "همدان", "neighborhood": "aa", "address": "some address here",
            "imagePath": "does/not/exist.png", "sports": ["bodybuilding"], "landingPageRequested": False,
        }
        assert s.post(f"{API}/registrations", json=payload).status_code == 400
