"""Tests for registration and login endpoints."""


def test_register_user(client):
    response = client.post(
        "/auth/register",
        json={
            "phone_number": "+15550001111",
            "username": "alice",
            "email": "alice@example.com",
            "password": "secret123",
        },
    )
    assert response.status_code == 201
    body = response.json()
    assert body["phone_number"] == "+15550001111"
    assert body["username"] == "alice"


def test_login_success(client):
    client.post(
        "/auth/register",
        json={
            "phone_number": "+15550002222",
            "username": "bob",
            "email": "bob@example.com",
            "password": "secret123",
        },
    )
    response = client.post(
        "/auth/login",
        data={"username": "+15550002222", "password": "secret123"},
    )
    assert response.status_code == 200
    assert "access_token" in response.json()


def test_login_invalid_credentials(client):
    response = client.post(
        "/auth/login",
        data={"username": "+15559999999", "password": "wrong"},
    )
    assert response.status_code == 401
