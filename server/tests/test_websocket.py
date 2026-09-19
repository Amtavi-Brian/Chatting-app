"""Tests for the WebSocket chat endpoint."""

import pytest
from starlette.websockets import WebSocketDisconnect


def _phone_for(username: str) -> str:
    digits = "".join(str(ord(ch) % 10) for ch in username).ljust(7, "0")[:7]
    return f"+1555{digits}"


def _register_and_login(client, username):
    client.post(
        "/auth/register",
        json={
            "phone_number": _phone_for(username),
            "username": username,
            "email": f"{username}@example.com",
            "password": "secret123",
        },
    )
    response = client.post(
        "/auth/login", data={"username": _phone_for(username), "password": "secret123"}
    )
    return response.json()["access_token"]


def test_websocket_rejects_invalid_token(client):
    # An invalid token causes the server to close the connection with code 4401,
    # which the test client surfaces as a WebSocketDisconnect on connect.
    with pytest.raises(WebSocketDisconnect) as exc_info:
        with client.websocket_connect("/ws?token=invalid"):
            pass
    assert exc_info.value.code == 4401
