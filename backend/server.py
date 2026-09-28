import asyncio
import logging
import os
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv
from fastapi import APIRouter, BackgroundTasks, FastAPI, File, HTTPException, Query, UploadFile
from fastapi.responses import Response
from motor.motor_asyncio import AsyncIOMotorClient
from starlette.middleware.cors import CORSMiddleware

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import storage  # noqa: E402
from models import RegistrationIn  # noqa: E402
from registrations import RegistrationService  # noqa: E402
from repository import CatalogRepository  # noqa: E402
from sample_source import SampleSource  # noqa: E402
from wordpress import WordPressClient, WordPressError  # noqa: E402

client = AsyncIOMotorClient(os.environ["MONGO_URL"])
db = client[os.environ["DB_NAME"]]

app = FastAPI(title="Smart Body API")
api = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

IMAGE_TYPES = {"image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif"}
MAX_IMAGE_BYTES = 5 * 1024 * 1024

wordpress = WordPressClient()
sample = SampleSource(db)
catalog = CatalogRepository(sample, wordpress)
registrations = RegistrationService(db, wordpress)


def _tag_source(response: Response, source: str) -> None:
    response.headers["X-Data-Source"] = source


# ---------- Catalog (WordPress first, sample fallback) ----------
@api.get("/")
async def root():
    return {"message": "Smart Body API"}


@api.get("/cities")
async def list_cities(response: Response):
    data, source = await catalog.cities()
    _tag_source(response, source)
    return data


@api.get("/sports")
async def list_sports(response: Response):
    data, source = await catalog.sports()
    _tag_source(response, source)
    return data


@api.get("/gyms")
async def list_gyms(
    response: Response,
    city: Optional[str] = None,
    q: Optional[str] = None,
    sport: Optional[str] = None,
    featured: Optional[bool] = None,
    limit: int = Query(50, ge=1, le=100),
):
    data, source = await catalog.list_gyms(city=city, q=q, sport=sport, featured=featured, limit=limit)
    _tag_source(response, source)
    return data


@api.get("/gyms/{slug}")
async def get_gym(slug: str, response: Response):
    gym, source = await catalog.get_gym(slug)
    if not gym:
        raise HTTPException(status_code=404, detail="Gym not found")
    _tag_source(response, source)
    return gym


# ---------- WordPress integration status ----------
@api.get("/integrations/wordpress/status")
async def wordpress_status():
    info = {"configured": wordpress.configured, "canWrite": wordpress.can_write, "reachable": False,
            "pluginVersion": None, "baseUrl": wordpress.base_url or None, "activeSource": sample.name, "error": None}
    if wordpress.configured:
        try:
            status = await wordpress.status()
            info.update(reachable=True, pluginVersion=status.get("version"), activeSource=wordpress.name)
        except WordPressError as exc:
            info["error"] = str(exc)[:300]
    return info


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
async def create_registration(payload: RegistrationIn, background: BackgroundTasks):
    cities, _ = await catalog.cities()
    sports, _ = await catalog.sports()
    if payload.city not in {c["name"] for c in cities}:
        raise HTTPException(status_code=422, detail="Unknown city")
    if any(s not in {sp["slug"] for sp in sports} for s in payload.sports):
        raise HTTPException(status_code=422, detail="Unknown sport")
    if not await db.files.find_one({"storage_path": payload.imagePath, "is_deleted": False}):
        raise HTTPException(status_code=400, detail="Uploaded image not found")
    reg = await registrations.create(payload)
    if wordpress.can_write:
        background.add_task(registrations.sync, reg.id)
    return reg.model_dump()


@api.get("/registrations")
async def list_registrations():
    return await registrations.list()


@api.post("/registrations/{reg_id}/sync")
async def sync_registration(reg_id: str):
    reg = await registrations.sync(reg_id)
    if not reg:
        raise HTTPException(status_code=404, detail="Registration not found")
    return reg.model_dump()


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
    await sample.seed()
    logger.info("WordPress source: %s", wordpress.base_url or "not configured (using sample data)")
    try:
        await asyncio.to_thread(storage.init_storage)
        logger.info("Storage initialized")
    except Exception as e:
        logger.error(f"Storage init failed: {e}")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
