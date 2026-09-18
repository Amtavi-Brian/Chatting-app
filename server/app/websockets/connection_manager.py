from fastapi import WebSocket


class ConnectionManager:
    """Tracks active WebSocket connections keyed by user id."""

    def __init__(self) -> None:
        self.active_connections: dict[int, list[WebSocket]] = {}

    async def connect(self, user_id: int, websocket: WebSocket) -> None:
        await websocket.accept()
        self.active_connections.setdefault(user_id, []).append(websocket)

    def disconnect(self, user_id: int, websocket: WebSocket) -> None:
        connections = self.active_connections.get(user_id, [])
        if websocket in connections:
            connections.remove(websocket)
        if not connections:
            self.active_connections.pop(user_id, None)

    async def send_personal_message(self, user_id: int, message: dict) -> None:
        for connection in self.active_connections.get(user_id, []):
            await connection.send_json(message)

    async def broadcast_to_users(self, user_ids: list[int], message: dict) -> None:
        for user_id in user_ids:
            await self.send_personal_message(user_id, message)


manager = ConnectionManager()
