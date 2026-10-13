import os
from pathlib import Path

import pytest
from fastapi.testclient import TestClient


def test_health_and_admin_login(tmp_path: Path, monkeypatch: pytest.MonkeyPatch):
    database = tmp_path / "test.db"
    monkeypatch.setenv("DATABASE_URL", f"sqlite:///{database}")
    monkeypatch.setenv("ADMIN_EMAIL", "test-admin@example.com")
    monkeypatch.setenv("ADMIN_PASSWORD", "Admin123!")
    from app.main import app

    with TestClient(app) as client:
        assert client.get("/health").status_code == 200
        response = client.post("/api/v1/auth/login", data={"username": "test-admin@example.com", "password": "Admin123!"})
        assert response.status_code == 200
        token = response.json()["access_token"]
        dashboard = client.get("/api/v1/admin/dashboard", headers={"Authorization": f"Bearer {token}"})
        assert dashboard.status_code == 200
def test_user_read_accepts_local_system_email():
    from app.schemas import UserRead

    profile = UserRead(id="1", full_name="Admin", email="admin@dalatgo.local", role="ADMIN", is_active=True)
    assert profile.email == "admin@dalatgo.local"
