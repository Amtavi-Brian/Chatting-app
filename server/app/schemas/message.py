from datetime import datetime

from pydantic import BaseModel, ConfigDict


class MessageBase(BaseModel):
    content: str
    content_type: str = "text"


class MessageCreate(MessageBase):
    conversation_id: int


class MessageRead(MessageBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    conversation_id: int
    sender_id: int
    created_at: datetime
