"""Catalog access with automatic fallback: WordPress first, built-in sample data when WP is unavailable."""
import logging
from typing import Awaitable, Callable, Optional, Tuple

from sample_source import SampleSource
from wordpress import WordPressClient, WordPressError

logger = logging.getLogger(__name__)


class CatalogRepository:
    def __init__(self, sample: SampleSource, wordpress: WordPressClient):
        self.sample = sample
        self.wp = wordpress

    async def _read(self, wp_call: Callable[[], Awaitable], sample_call: Callable[[], Awaitable]) -> Tuple[object, str]:
        if self.wp.available:
            try:
                return await wp_call(), self.wp.name
            except WordPressError as exc:
                logger.warning("Falling back to sample data: %s", exc)
        return await sample_call(), self.sample.name

    async def cities(self):
        return await self._read(self.wp.cities, self.sample.cities)

    async def sports(self):
        return await self._read(self.wp.sports, self.sample.sports)

    async def list_gyms(self, **filters):
        return await self._read(lambda: self.wp.list_gyms(**filters), lambda: self.sample.list_gyms(**filters))

    async def get_gym(self, slug: str) -> Tuple[Optional[dict], str]:
        return await self._read(lambda: self.wp.get_gym(slug), lambda: self.sample.get_gym(slug))
