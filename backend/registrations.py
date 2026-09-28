"""Gym registrations: stored locally (outbox) and pushed to WordPress as pending `gym` posts."""
import asyncio
import logging
from datetime import datetime, timezone
from typing import Optional

from bson import ObjectId
from bson.errors import InvalidId

import storage
from models import RegistrationDoc, RegistrationIn, WordPressSync
from wordpress import WordPressClient, WordPressError

logger = logging.getLogger(__name__)


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


class RegistrationService:
    def __init__(self, db, wordpress: WordPressClient):
        self.db = db
        self.wp = wordpress

    async def create(self, payload: RegistrationIn) -> RegistrationDoc:
        reg = RegistrationDoc(
            **payload.model_dump(),
            landingPageStatus="requested" if payload.landingPageRequested else "not_requested",
            createdAt=_now(),
            wpSync=WordPressSync(status="pending" if self.wp.can_write else "not_configured", updatedAt=_now()),
        )
        result = await self.db.registrations.insert_one(reg.to_mongo())
        reg.id = str(result.inserted_id)
        return reg

    async def list(self) -> list:
        docs = await self.db.registrations.find().sort("createdAt", -1).to_list(500)
        return [RegistrationDoc.from_mongo(d).model_dump() for d in docs]

    async def get(self, reg_id: str) -> Optional[RegistrationDoc]:
        try:
            doc = await self.db.registrations.find_one({"_id": ObjectId(reg_id)})
        except InvalidId:
            return None
        return RegistrationDoc.from_mongo(doc) if doc else None

    async def sync(self, reg_id: str) -> Optional[RegistrationDoc]:
        reg = await self.get(reg_id)
        if not reg:
            return None
        if reg.wpSync.status == "synced":
            return reg
        sync = await self._push(reg)
        await self.db.registrations.update_one({"_id": ObjectId(reg_id)}, {"$set": {"wpSync": sync.model_dump()}})
        reg.wpSync = sync
        return reg

    async def _push(self, reg: RegistrationDoc) -> WordPressSync:
        if not self.wp.can_write:
            return WordPressSync(status="not_configured", updatedAt=_now())
        try:
            data, content_type = await asyncio.to_thread(storage.get_object, reg.imagePath)
            media = await self.wp.upload_media(data, reg.imagePath.rsplit("/", 1)[-1], content_type)
            post = await self.wp.create_registration({
                "externalId": reg.id,
                "gymName": reg.gymName,
                "managerName": reg.managerName,
                "phone": reg.phone,
                "city": reg.city,
                "neighborhood": reg.neighborhood,
                "address": reg.address,
                "sports": reg.sports,
                "landingPageRequested": reg.landingPageRequested,
                "mediaId": media.get("id"),
            })
            return WordPressSync(status="synced", postId=post.get("id"), postStatus=post.get("status"),
                                 editLink=post.get("editLink"), updatedAt=_now())
        except WordPressError as exc:
            logger.warning("WordPress sync failed for registration %s: %s", reg.id, exc)
            return WordPressSync(status="failed", error=str(exc)[:300], updatedAt=_now())
        except Exception as exc:  # storage errors must not break the local record
            logger.exception("Unexpected sync error for registration %s", reg.id)
            return WordPressSync(status="failed", error=str(exc)[:300], updatedAt=_now())
