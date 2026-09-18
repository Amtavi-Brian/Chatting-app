from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_current_user, get_db
from app.models.conversation import Conversation
from app.models.user import User
from app.schemas.conversation import ConversationCreate, ConversationRead
from app.schemas.message import MessageRead
from app.services.message_service import get_conversation_messages

router = APIRouter(prefix="/conversations", tags=["conversations"])


@router.post("", response_model=ConversationRead)
def create_conversation(
    conversation_in: ConversationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ConversationRead:
    participants = db.query(User).filter(User.id.in_(conversation_in.participant_ids)).all()
    if current_user not in participants:
        participants.append(current_user)

    conversation = Conversation(is_group=conversation_in.is_group, participants=participants)
    db.add(conversation)
    db.commit()
    db.refresh(conversation)
    return conversation


@router.get("", response_model=list[ConversationRead])
def list_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[ConversationRead]:
    return (
        db.query(Conversation)
        .filter(Conversation.participants.any(User.id == current_user.id))
        .all()
    )


@router.get("/{conversation_id}/messages", response_model=list[MessageRead])
def read_messages(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[MessageRead]:
    return get_conversation_messages(db, conversation_id)
