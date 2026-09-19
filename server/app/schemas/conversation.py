from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.schemas.message import MessageRead
from app.schemas.user import UserRead


class ConversationBase(BaseModel):
    is_group: bool = False


class ConversationCreate(ConversationBase):
    participant_ids: list[int]


class ConversationRead(ConversationBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    participants: list[UserRead] = []
    last_message: MessageRead | None = None
