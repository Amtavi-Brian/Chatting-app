from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, Integer, Table, Column
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

conversation_participants = Table(
    "conversation_participants",
    Base.metadata,
    Column("conversation_id", ForeignKey("conversations.id"), primary_key=True),
    Column("user_id", ForeignKey("users.id"), primary_key=True),
)


class Conversation(Base):
    __tablename__ = "conversations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    is_group: Mapped[bool] = mapped_column(default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    participants = relationship("User", secondary=conversation_participants)
    messages = relationship("Message", back_populates="conversation", order_by="Message.created_at")
