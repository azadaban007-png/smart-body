import asyncio
import logging
import os
import re
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Annotated, List, Optional

from bson import ObjectId
from dotenv import load_dotenv
from fastapi import APIRouter, FastAPI, File, HTTPException, Query, UploadFile
from fastapi.responses import Response
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, BeforeValidator, ConfigDict, Field, field_validator
from starlette.middleware.cors import CORSMiddleware

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import storage  # noqa: E402
from seed_data import CITIES, GYMS, SPORTS  # noqa: E402

client = AsyncIOMotorClient(os.environ["MONGO_URL"])
db = client[os.environ["DB_NAME"]]

app = FastAPI(title="Smart Body API")
api = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

SPORTS_BY_SLUG = {s["slug"]: s for s in SPORTS}
CITY_NAMES = {c["name"] for c in CITIES}
IMAGE_TYPES = {"image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif"}
MAX_IMAGE_BYTES = 5 * 1024 * 1024

# ---------- Persian text helpers ----------
_CHAR_MAP = str.maketrans({"ي": "ی", "ك": "ک", "ۀ": "ه", "ة": "ه", "أ": "ا", "إ": "ا", "\u200c": " "})
_DIGIT_MAP = str.maketrans("۰۱۲۳۴۵۶۷۸۹٠١٢٣٤٥٦٧٨٩", "01234567890123456789")
_GENERIC_WORDS = {"خیابان", "خ", "میدان", "م", "محله", "شهرک", "بلوار", "کوچه", "چهارراه", "منطقه", "محدوده", "فلکه"}


def normalize(text: str) -> str:
    text = (text or "").translate(_CHAR_MAP).translate(_DIGIT_MAP)
    return " ".join(re.sub(r"[،,.\-_/]", " ", text).split())


def location_matches(gym: "GymDoc", query: str) -> bool:
    needle = normalize(query)
    if not needle:
        return True
    hay = normalize(" ".join([gym.name, gym.address, gym.neighborhood, gym.street]))
    if needle in hay or needle.replace(" ", "") in hay.replace(" ", ""):
        return True
    tokens = [t for t in needle.split() if t not in _GENERIC_WORDS]
    return bool(tokens) and all(t in hay for t in tokens)


# ---------- Models ----------
PyObjectId = Annotated[str, BeforeValidator(lambda v: str(v) if isinstance(v, ObjectId) else v)]


class BaseDocument(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="ignore")
    id: Optional[PyObjectId] = Field(default=None, alias="_id")

    @classmethod
    def from_mongo(cls, doc: dict):
        return cls.model_validate(doc)

    def to_mongo(self) -> dict:
        data = self.model_dump(by_alias=True)
        if data.get("_id") is None:
            data.pop("_id", None)
        return data


class GymDoc(BaseDocument):
    slug: str
    name: str
    city: str
    address: str
    neighborhood: str
    street: str
    phone: str
    image: str
    sports: List[str]
    rating: float
    description: str
    status: str = "published"
    featured: bool = False
    badge: Optional[str] = None
    landingPageRequested: bool = False
    landingPageUrl: Optional[str] = None


class RegistrationIn(BaseModel):
    gymName: str = Field(min_length=2, max_length=120)
    managerName: str = Field(min_length=2, max_length=120)
    phone: str
    city: str
    neighborhood: str = Field(min_length=2, max_length=120)
    address: str = Field(min_length=5, max_length=500)
    imagePath: str = Field(min_length=3)
    sports: List[str] = Field(min_length=1)
    landingPageRequested: bool

    @field_validator("gymName", "managerName", "neighborhood", "address", mode="before")
    @classmethod
    def strip_text(cls, v):
        return v.strip() if isinstance(v, str) else v

    @field_validator("phone")
    @classmethod
    def valid_phone(cls, v: str) -> str:
        digits = re.sub(r"[\s\-]", "", v.translate(_DIGIT_MAP))
        if not re.fullmatch(r"0\d{10}", digits):
            raise ValueError("invalid phone number")
        return digits

    @field_validator("city")
    @classmethod
    def valid_city(cls, v: str) -> str:
        if v not in CITY_NAMES:
            raise ValueError("unknown city")
        return v

    @field_validator("sports")
    @classmethod
    def valid_sports(cls, v: List[str]) -> List[str]:
        if any(s not in SPORTS_BY_SLUG for s in v):
            raise ValueError("unknown sport")
        return list(dict.fromkeys(v))


class RegistrationDoc(BaseDocument):
    gymName: str
    managerName: str
    phone: str
    city: str
    neighborhood: str
    address: str
    imagePath: str
    sports: List[str]
    landingPageRequested: bool
    landingPageStatus: str
    status: str = "pending"
    createdAt: str


def gym_out(gym: GymDoc) -> dict:
    data = gym.model_dump()
    data["sports"] = [SPORTS_BY_SLUG[s] for s in gym.sports if s in SPORTS_BY_SLUG]
    return data


# ---------- Catalog ----------
@api.get("/")
async def root():
    return {"message": "Smart Body API"}


@api.get("/cities")
async def list_cities():
    return CITIES


@api.get("/sports")
async def list_sports():
    return SPORTS


@api.get("/gyms")
async def list_gyms(
    city: Optional[str] = None,
    q: Optional[str] = None,
    sport: Optional[str] = None,
    featured: Optional[bool] = None,
    limit: int = Query(50, ge=1, le=100),
):
    query = {"status": "published"}
    if sport:
        query["sports"] = sport
    if featured is not None:
        query["featured"] = featured
    docs = await db.gyms.find(query).sort("rating", -1).to_list(500)
    gyms = [GymDoc.from_mongo(d) for d in docs]
    if city:
        gyms = [g for g in gyms if normalize(g.city) == normalize(city)]
    if q:
        gyms = [g for g in gyms if location_matches(g, q)]
    return [gym_out(g) for g in gyms[:limit]]


@api.get("/gyms/{slug}")
async def get_gym(slug: str):
    doc = await db.gyms.find_one({"slug": slug, "status": "published"})
    if not doc:
        raise HTTPException(status_code=404, detail="Gym not found")
    return gym_out(GymDoc.from_mongo(doc))


# ---------- Uploads ----------
@api.post("/uploads", status_code=201)
async def upload_image(file: UploadFile = File(...)):
    ext = IMAGE_TYPES.get(file.content_type or "")
    if not ext:
        raise HTTPException(status_code=400, detail="Only JPG, PNG, WEBP or GIF images are allowed")
    data = await file.read()
    if len(data) > MAX_IMAGE_BYTES:
        raise HTTPException(status_code=413, detail="Image must be smaller than 5MB")
    path = f"{storage.APP_NAME}/uploads/registrations/{uuid.uuid4().hex}.{ext}"
    try:
        result = await asyncio.to_thread(storage.put_object, path, data, file.content_type)
    except Exception:
        logger.exception("Image upload failed")
        raise HTTPException(status_code=502, detail="Image upload failed")
    await db.files.insert_one({
        "storage_path": result["path"],
        "original_filename": file.filename,
        "content_type": file.content_type,
        "size": result.get("size", len(data)),
        "is_deleted": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    return {"path": result["path"], "url": f"/api/files/{result['path']}"}


@api.get("/files/{path:path}")
async def get_file(path: str):
    record = await db.files.find_one({"storage_path": path, "is_deleted": False})
    if not record:
        raise HTTPException(status_code=404, detail="File not found")
    data, content_type = await asyncio.to_thread(storage.get_object, path)
    return Response(content=data, media_type=record.get("content_type") or content_type,
                    headers={"Cache-Control": "public, max-age=86400"})


# ---------- Gym registrations ----------
@api.post("/registrations", status_code=201)
async def create_registration(payload: RegistrationIn):
    if not await db.files.find_one({"storage_path": payload.imagePath, "is_deleted": False}):
        raise HTTPException(status_code=400, detail="Uploaded image not found")
    reg = RegistrationDoc(
        **payload.model_dump(),
        landingPageStatus="requested" if payload.landingPageRequested else "not_requested",
        createdAt=datetime.now(timezone.utc).isoformat(),
    )
    result = await db.registrations.insert_one(reg.to_mongo())
    reg.id = str(result.inserted_id)
    return reg.model_dump()


@api.get("/registrations")
async def list_registrations():
    docs = await db.registrations.find().sort("createdAt", -1).to_list(500)
    return [RegistrationDoc.from_mongo(d).model_dump() for d in docs]


app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    await db.gyms.create_index("slug", unique=True)
    for gym in GYMS:
        doc = GymDoc(**gym).to_mongo()
        await db.gyms.update_one({"slug": gym["slug"]}, {"$set": doc}, upsert=True)
    try:
        await asyncio.to_thread(storage.init_storage)
        logger.info("Storage initialized")
    except Exception as e:
        logger.error(f"Storage init failed: {e}")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
