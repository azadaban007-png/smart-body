from typing import Optional

from models import GymDoc
from seed_data import CITIES, GYMS, SPORTS
from text_utils import location_matches, normalize

SPORTS_BY_SLUG = {s["slug"]: s for s in SPORTS}


class SampleSource:
    """Built-in prototype data (MongoDB-seeded). Used whenever WordPress is not available."""

    name = "sample"

    def __init__(self, db):
        self.db = db

    async def seed(self) -> None:
        await self.db.gyms.create_index("slug", unique=True)
        for gym in GYMS:
            await self.db.gyms.update_one({"slug": gym["slug"]}, {"$set": GymDoc(**gym).to_mongo()}, upsert=True)

    async def cities(self) -> list:
        return CITIES

    async def sports(self) -> list:
        return SPORTS

    async def list_gyms(self, city: Optional[str] = None, q: Optional[str] = None, sport: Optional[str] = None,
                        featured: Optional[bool] = None, limit: int = 50) -> list:
        query = {"status": "published"}
        if sport:
            query["sports"] = sport
        if featured is not None:
            query["featured"] = featured
        docs = await self.db.gyms.find(query).sort("rating", -1).to_list(500)
        gyms = [GymDoc.from_mongo(d) for d in docs]
        if city:
            gyms = [g for g in gyms if normalize(g.city) == normalize(city)]
        if q:
            gyms = [g for g in gyms if location_matches([g.name, g.address, g.neighborhood, g.street], q)]
        return [self._out(g) for g in gyms[:limit]]

    async def get_gym(self, slug: str) -> Optional[dict]:
        doc = await self.db.gyms.find_one({"slug": slug, "status": "published"})
        return self._out(GymDoc.from_mongo(doc)) if doc else None

    @staticmethod
    def _out(gym: GymDoc) -> dict:
        data = gym.model_dump()
        data["sports"] = [SPORTS_BY_SLUG[s] for s in gym.sports if s in SPORTS_BY_SLUG]
        return data
