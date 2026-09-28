"""Smart Body backend tests - gyms catalog, search, uploads, registrations."""
import io
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE_URL:
    # fallback to reading frontend .env
    with open("/app/frontend/.env") as f:
        for line in f:
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.split("=", 1)[1].strip().rstrip("/")
                break

API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def s():
    return requests.Session()


# ---------- Catalog ----------
class TestCatalog:
    def test_cities(self, s):
        r = s.get(f"{API}/cities")
        assert r.status_code == 200
        cities = r.json()
        names = [c["name"] for c in cities]
        assert "تهران" in names and "همدان" in names and "اصفهان" in names

    def test_sports(self, s):
        r = s.get(f"{API}/sports")
        assert r.status_code == 200
        slugs = [x["slug"] for x in r.json()]
        assert "yoga" in slugs and "bodybuilding" in slugs


# ---------- Gyms ----------
class TestGyms:
    def test_list_gyms_sorted(self, s):
        r = s.get(f"{API}/gyms")
        assert r.status_code == 200
        gyms = r.json()
        assert len(gyms) == 10
        ratings = [g["rating"] for g in gyms]
        assert ratings == sorted(ratings, reverse=True)
        for k in ("id", "slug", "name", "city", "address", "neighborhood", "street",
                 "phone", "image", "sports", "rating", "description", "featured",
                 "badge", "landingPageRequested", "landingPageUrl"):
            assert k in gyms[0], f"missing key {k}"
        # sports is list of dicts
        assert isinstance(gyms[0]["sports"], list) and gyms[0]["sports"]
        assert set(gyms[0]["sports"][0].keys()) >= {"slug", "name", "image"}

    def test_get_gym_by_slug(self, s):
        r = s.get(f"{API}/gyms/energy")
        assert r.status_code == 200
        assert r.json()["slug"] == "energy"

    def test_get_gym_404(self, s):
        assert s.get(f"{API}/gyms/nope").status_code == 404

    @pytest.mark.parametrize("city,q,expected_slug", [
        ("همدان", "خیابان بوعلی", "energy"),
        ("همدان", "شهرک مدنی", "arya"),
        ("تهران", "میدان فردوسی", "parsian"),
        ("اصفهان", "چهارباغ", "aseman"),
        ("اصفهان", "چهار باغ", "aseman"),
    ])
    def test_search_match(self, s, city, q, expected_slug):
        r = s.get(f"{API}/gyms", params={"city": city, "q": q})
        assert r.status_code == 200
        slugs = [g["slug"] for g in r.json()]
        assert expected_slug in slugs, f"want {expected_slug}, got {slugs}"

    def test_search_hamedan_ferdowsi_empty(self, s):
        r = s.get(f"{API}/gyms", params={"city": "همدان", "q": "فردوسی"})
        assert r.status_code == 200
        assert r.json() == []

    def test_filter_sport_yoga(self, s):
        r = s.get(f"{API}/gyms", params={"sport": "yoga"})
        assert r.status_code == 200
        gyms = r.json()
        assert gyms
        for g in gyms:
            assert any(sp["slug"] == "yoga" for sp in g["sports"])


# ---------- Uploads ----------
PNG_BYTES = (
    b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01"
    b"\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0cIDATx\x9cc\xf8\xcf\xc0"
    b"\x00\x00\x00\x03\x00\x01\x5e\xf3\x2a\x3f\x00\x00\x00\x00IEND\xaeB`\x82"
)


class TestUploadsAndRegistrations:
    def test_upload_non_image_400(self, s):
        r = s.post(f"{API}/uploads", files={"file": ("a.txt", b"hi", "text/plain")})
        assert r.status_code == 400

    def test_upload_and_serve(self, s):
        r = s.post(f"{API}/uploads", files={"file": ("t.png", PNG_BYTES, "image/png")})
        assert r.status_code == 201, r.text
        path = r.json()["path"]
        assert path
        pytest.uploaded_path = path
        # serve
        r2 = s.get(f"{API}/files/{path}")
        assert r2.status_code == 200
        assert r2.headers.get("content-type", "").startswith("image/")

    def test_registration_valid(self, s):
        assert hasattr(pytest, "uploaded_path"), "upload must run first"
        payload = {
            "gymName": "TEST_باشگاه نمونه",
            "managerName": "علی رضایی",
            "phone": "۰۹۱۲۳۴۵۶۷۸۹",  # Persian digits
            "city": "همدان",
            "neighborhood": "بوعلی",
            "address": "خیابان بوعلی، پلاک ۱۰",
            "imagePath": pytest.uploaded_path,
            "sports": ["bodybuilding"],
            "landingPageRequested": True,
        }
        r = s.post(f"{API}/registrations", json=payload)
        assert r.status_code == 201, r.text
        data = r.json()
        assert data["landingPageStatus"] == "requested"
        assert data["status"] == "pending"
        assert data["phone"] == "09123456789"
        # list
        r2 = s.get(f"{API}/registrations")
        assert r2.status_code == 200
        assert any(x.get("gymName") == "TEST_باشگاه نمونه" for x in r2.json())

    def test_registration_invalid_phone(self, s):
        payload = {
            "gymName": "TEST_x", "managerName": "yy", "phone": "12345",
            "city": "همدان", "neighborhood": "aa", "address": "some address",
            "imagePath": getattr(pytest, "uploaded_path", "x"),
            "sports": ["bodybuilding"], "landingPageRequested": False,
        }
        r = s.post(f"{API}/registrations", json=payload)
        assert r.status_code in (400, 422)

    def test_registration_unknown_city(self, s):
        payload = {
            "gymName": "TEST_x", "managerName": "yy", "phone": "09123456789",
            "city": "Nowhere", "neighborhood": "aa", "address": "some address",
            "imagePath": getattr(pytest, "uploaded_path", "x"),
            "sports": ["bodybuilding"], "landingPageRequested": False,
        }
        assert s.post(f"{API}/registrations", json=payload).status_code in (400, 422)

    def test_registration_empty_sports(self, s):
        payload = {
            "gymName": "TEST_x", "managerName": "yy", "phone": "09123456789",
            "city": "همدان", "neighborhood": "aa", "address": "some address",
            "imagePath": getattr(pytest, "uploaded_path", "x"),
            "sports": [], "landingPageRequested": False,
        }
        assert s.post(f"{API}/registrations", json=payload).status_code in (400, 422)

    def test_registration_unknown_imagepath(self, s):
        payload = {
            "gymName": "TEST_x", "managerName": "yy", "phone": "09123456789",
            "city": "همدان", "neighborhood": "aa", "address": "some address",
            "imagePath": "does/not/exist.png",
            "sports": ["bodybuilding"], "landingPageRequested": False,
        }
        assert s.post(f"{API}/registrations", json=payload).status_code == 400
