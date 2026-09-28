import re
from typing import Iterable

_CHAR_MAP = str.maketrans({"ي": "ی", "ك": "ک", "ۀ": "ه", "ة": "ه", "أ": "ا", "إ": "ا", "\u200c": " "})
DIGIT_MAP = str.maketrans("۰۱۲۳۴۵۶۷۸۹٠١٢٣٤٥٦٧٨٩", "01234567890123456789")
_GENERIC_WORDS = {"خیابان", "خ", "میدان", "م", "محله", "شهرک", "بلوار", "کوچه", "چهارراه", "منطقه", "محدوده", "فلکه"}


def normalize(text: str) -> str:
    text = (text or "").translate(_CHAR_MAP).translate(DIGIT_MAP)
    return " ".join(re.sub(r"[،,.\-_/]", " ", text).split())


def location_matches(parts: Iterable[str], query: str) -> bool:
    """Same matching rules as the WordPress plugin's sb_location_matches()."""
    needle = normalize(query)
    if not needle:
        return True
    hay = normalize(" ".join(p or "" for p in parts))
    if needle in hay or needle.replace(" ", "") in hay.replace(" ", ""):
        return True
    tokens = [t for t in needle.split() if t not in _GENERIC_WORDS]
    return bool(tokens) and all(t in hay for t in tokens)
