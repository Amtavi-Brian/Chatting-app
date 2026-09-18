from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.dependencies import get_db
from app.models.conversation import Conversation
from app.schemas.message import MessageCreate
from app.services.message_service import create_message
from app.websockets.connection_manager import manager

router = APIRouter()


async def get_user_id_from_token(token: str) -> int | None:
    payload = decode_access_token(token)
    if payload is None:
        return None
    sub = payload.get("sub")
    return int(sub) if sub is not None else None


@router.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    token: str,
    db: Session = Depends(get_db),
) -> None:
    user_id = await get_user_id_from_token(token)
    if user_id is None:
        await websocket.close(code=4401)
        return

    await manager.connect(user_id, websocket)
    try:
        while True:
            data = await websocket.receive_json()
            message_in = MessageCreate(**data)
            message = create_message(db, sender_id=user_id, message_in=message_in)

            conversation = (
                db.query(Conversation).filter(Conversation.id == message.conversation_id).first()
            )
            recipient_ids = [p.id for p in conversation.participants] if conversation else []

            payload = {
                "id": message.id,
                "conversation_id": message.conversation_id,
                "sender_id": message.sender_id,
                "content": message.content,
                "content_type": message.content_type,
                "created_at": message.created_at.isoformat(),
            }
            await manager.broadcast_to_users(recipient_ids, payload)
    except WebSocketDisconnect:
        manager.disconnect(user_id, websocket)
