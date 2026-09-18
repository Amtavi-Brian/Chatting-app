# Chat App

A real-time messaging app supporting 1:1 and group conversations.

## Features
- User authentication (JWT-based)
- Real-time messaging via native WebSockets (FastAPI)
- Persistent message history (PostgreSQL)
- Typing indicators & online presence
- Group and direct conversations

## Tech Stack
- **Frontend:** React, native WebSocket API
- **Backend:** Python, FastAPI, Uvicorn
- **Database:** PostgreSQL, SQLAlchemy, Alembic (migrations)
- **Auth:** JWT (python-jose or pyjwt + passlib for password hashing)

## Project Structure
- `server/app/routers` — REST API endpoints
- `server/app/websockets` — WebSocket connection handling & message routing
- `server/app/models` — SQLAlchemy ORM models
- `server/app/schemas` — Pydantic request/response validation
- `client/src/components` — UI components

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL running locally or via Docker

### Backend Setup
\`\`\`bash
cd server
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp ../.env.example .env       # fill in DB credentials, JWT secret

# run DB migrations
alembic upgrade head

# start dev server
uvicorn app.main:app --reload --port 8000
\`\`\`

### Frontend Setup
\`\`\`bash
cd client
npm install
npm run dev
\`\`\`

### Environment Variables
| Variable         | Description                        |
|-------------------|-------------------------------------|
| `DATABASE_URL`    | Postgres connection string         |
| `JWT_SECRET`      | Secret for signing tokens          |
| `JWT_ALGORITHM`   | e.g. HS256                         |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiry             |

## API Docs
FastAPI auto-generates interactive docs at `http://localhost:8000/docs` once the server is running.

## Roadmap
- [ ] File/image sharing
- [ ] Read receipts
- [ ] Push notifications
- [ ] Message search
- [ ] Horizontal scaling via Redis pub/sub for WebSocket broadcast

## License
MIT
