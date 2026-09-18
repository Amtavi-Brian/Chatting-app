"""Tests for registration and login endpoints."""


def test_register_user(client):
    response = client.post(
        "/auth/register",
        json={"username": "alice", "email": "alice@example.com", "password": "secret123"},
    )
    assert response.status_code == 201
    body = response.json()
    assert body["username"] == "alice"


def test_login_success(client):
    client.post(
        "/auth/register",
        json={"username": "bob", "email": "bob@example.com", "password": "secret123"},
    )
    response = client.post(
        "/auth/login",
        data={"username": "bob", "password": "secret123"},
    )
    assert response.status_code == 200
    assert "access_token" in response.json()


def test_login_invalid_credentials(client):
    response = client.post(
        "/auth/login",
        data={"username": "unknown", "password": "wrong"},
    )
    assert response.status_code == 401
