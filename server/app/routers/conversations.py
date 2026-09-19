from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload

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
    conversations = (
        db.query(Conversation)
        .options(joinedload(Conversation.participants), joinedload(Conversation.messages))
        .filter(Conversation.participants.any(User.id == current_user.id))
        .all()
    )

    def sort_key(conversation: Conversation) -> object:
        last = conversation.messages[-1] if conversation.messages else None
        return last.created_at if last else conversation.created_at

    conversations.sort(key=sort_key, reverse=True)

    results = []
    for conversation in conversations:
        data = ConversationRead.model_validate(conversation)
        if conversation.messages:
            data.last_message = MessageRead.model_validate(conversation.messages[-1])
        results.append(data)
    return results


@router.get("/{conversation_id}/messages", response_model=list[MessageRead])
def read_messages(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[MessageRead]:
    return get_conversation_messages(db, conversation_id)
