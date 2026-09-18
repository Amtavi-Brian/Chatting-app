# Chat App

A real-time chat application with a FastAPI + WebSocket backend and a React frontend.

## Structure

- `server/` — FastAPI backend (REST + WebSocket, SQLAlchemy, Alembic, JWT auth)
- `client/` — React frontend
- `docs/` — Architecture documentation
- `docker-compose.yml` — Postgres (and optionally Redis for pub/sub scaling)

## Getting Started

### Backend

```bash
cd server
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp ../.env.example .env
alembic upgrade head
uvicorn app.main:app --reload
```

### Frontend

```bash
cd client
npm install
npm start
```

### Infrastructure

```bash
docker-compose up -d
```

## Environment Variables

See `.env.example` for required configuration (database URL, JWT secret, etc.).
