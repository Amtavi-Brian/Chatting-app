"""Tests for conversation and message endpoints."""


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


def test_create_conversation_and_list_messages(client):
    token = _register_and_login(client, "carol")
    headers = {"Authorization": f"Bearer {token}"}

    response = client.post("/conversations", json={"participant_ids": []}, headers=headers)
    assert response.status_code == 200
    conversation_id = response.json()["id"]

    response = client.get(f"/conversations/{conversation_id}/messages", headers=headers)
    assert response.status_code == 200
    assert response.json() == []
