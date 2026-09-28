import re
from typing import Annotated, List, Optional

from bson import ObjectId
from pydantic import BaseModel, BeforeValidator, ConfigDict, Field, field_validator

from text_utils import DIGIT_MAP

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
    city: str = Field(min_length=2, max_length=60)
    neighborhood: str = Field(min_length=2, max_length=120)
    address: str = Field(min_length=5, max_length=500)
    imagePath: str = Field(min_length=3)
    sports: List[str] = Field(min_length=1)
    landingPageRequested: bool

    @field_validator("gymName", "managerName", "city", "neighborhood", "address", mode="before")
    @classmethod
    def strip_text(cls, v):
        return v.strip() if isinstance(v, str) else v

    @field_validator("phone")
    @classmethod
    def valid_phone(cls, v: str) -> str:
        digits = re.sub(r"[\s\-]", "", v.translate(DIGIT_MAP))
        if not re.fullmatch(r"0\d{10}", digits):
            raise ValueError("invalid phone number")
        return digits

    @field_validator("sports")
    @classmethod
    def unique_sports(cls, v: List[str]) -> List[str]:
        return list(dict.fromkeys(v))


class WordPressSync(BaseModel):
    # not_configured | pending | synced | failed
    status: str = "pending"
    postId: Optional[int] = None
    postStatus: Optional[str] = None
    editLink: Optional[str] = None
    error: Optional[str] = None
    updatedAt: Optional[str] = None


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
    wpSync: WordPressSync = Field(default_factory=WordPressSync)
