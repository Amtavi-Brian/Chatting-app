from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers import auth, conversations, users
from app.websockets import chat_ws

settings = get_settings()

app = FastAPI(title="Chat App API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(conversations.router)
app.include_router(chat_ws.router)


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
