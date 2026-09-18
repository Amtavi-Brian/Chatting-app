from sqlalchemy.orm import Session

from app.models.message import Message
from app.schemas.message import MessageCreate


def create_message(db: Session, sender_id: int, message_in: MessageCreate) -> Message:
    message = Message(
        conversation_id=message_in.conversation_id,
        sender_id=sender_id,
        content=message_in.content,
        content_type=message_in.content_type,
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    return message


def get_conversation_messages(db: Session, conversation_id: int, limit: int = 50) -> list[Message]:
    return (
        db.query(Message)
        .filter(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.desc())
        .limit(limit)
        .all()
    )
