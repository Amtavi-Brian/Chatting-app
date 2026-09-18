"""Tests for conversation and message endpoints."""


def _register_and_login(client, username):
    client.post(
        "/auth/register",
        json={"username": username, "email": f"{username}@example.com", "password": "secret123"},
    )
    response = client.post("/auth/login", data={"username": username, "password": "secret123"})
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
