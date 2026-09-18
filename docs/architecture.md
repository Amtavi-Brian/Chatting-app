# Architecture

## Overview

The chat application consists of two main components:

- **`server/`** — A FastAPI backend that exposes REST endpoints for authentication,
  users, and conversations, plus a native WebSocket endpoint (`/ws`) for real-time
  message delivery.
- **`client/`** — A React single-page application that authenticates against the
  REST API and maintains a persistent WebSocket connection for live updates.

## Backend

- **`app/main.py`** wires together the FastAPI app, CORS middleware, REST routers,
  and the WebSocket router.
- **`app/models/`** — SQLAlchemy ORM models (`User`, `Conversation`, `Message`) that
  are managed via Alembic migrations.
- **`app/schemas/`** — Pydantic request/response models, decoupled from the ORM
  layer.
- **`app/routers/`** — REST endpoints grouped by resource (`auth`, `users`,
  `conversations`).
- **`app/websockets/`** — `connection_manager.py` tracks active WebSocket
  connections per user id; `chat_ws.py` authenticates the socket via a JWT query
  parameter, persists incoming messages, and broadcasts them to conversation
  participants.
- **`app/services/`** — Business logic (auth, message persistence) kept separate
  from route handlers for testability.
- **`app/core/`** — Cross-cutting concerns: JWT creation/verification, password
  hashing, and logging configuration.

### Authentication flow

1. Client calls `POST /auth/register` then `POST /auth/login` (OAuth2 password
   flow) to obtain a JWT access token.
2. REST calls send the token as a `Bearer` header; `get_current_user` in
   `dependencies.py` resolves it to a `User`.
3. WebSocket connections pass the token as a `?token=` query parameter since
   browsers cannot set custom headers on the WebSocket handshake.

### Real-time messaging

The client opens a single `/ws` connection after login. Incoming JSON payloads
are validated as `MessageCreate`, persisted via `message_service`, and then
fanned out to all conversation participants through `ConnectionManager`. This
in-memory manager works for a single backend instance; horizontal scaling would
require a shared pub/sub layer (Redis is included in `docker-compose.yml` for
this purpose).

## Frontend

- **`sockets/socket.js`** wraps the native browser `WebSocket` API (not
  Socket.IO) to match the backend's plain `/ws` endpoint.
- **`context/AuthContext.jsx`** manages the JWT in `localStorage` and exposes
  `login`/`logout` to the component tree.
- **`pages/ChatPage.jsx`** opens the WebSocket connection on mount and renders
  `ConversationList` + `ChatWindow`.
- **`components/`** contains presentational pieces: message list/input,
  conversation list, and a simple online/offline presence indicator.

## Data Model

```
User (1) --- (M) Message
Conversation (1) --- (M) Message
Conversation (M) --- (M) User   [conversation_participants join table]
```

## Scaling Notes

- Postgres is the system of record; Redis is provisioned for future pub/sub
  based WebSocket fan-out across multiple backend instances.
- The connection manager is intentionally simple (in-process dict); replace it
  with a Redis-backed pub/sub implementation before running more than one
  backend replica.
