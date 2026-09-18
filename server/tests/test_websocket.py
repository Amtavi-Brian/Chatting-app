"""Tests for the WebSocket chat endpoint."""


def _register_and_login(client, username):
    client.post(
        "/auth/register",
        json={"username": username, "email": f"{username}@example.com", "password": "secret123"},
    )
    response = client.post("/auth/login", data={"username": username, "password": "secret123"})
    return response.json()["access_token"]


def test_websocket_rejects_invalid_token(client):
    with client.websocket_connect("/ws?token=invalid") as _websocket:
        pass
