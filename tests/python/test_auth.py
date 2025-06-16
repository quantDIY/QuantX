# tests/test_auth.py
import pytest
import os
from dotenv import load_dotenv, dotenv_values
from backend.topstepx_trader.auth import authenticate, validate_token


def test_authenticate():
    token = authenticate()
    assert token is not None and len(token) > 0

    # Load from file, not environment
    env = dotenv_values(".env")
    assert env.get("SESSION_TOKEN") == token


def test_validate_token():
    assert validate_token() is True


def test_revalidate_and_use_new_token():
    original_token = dotenv_values(".env").get("SESSION_TOKEN")
    assert original_token is not None

    # Validate and get the new token from .env again
    assert validate_token() is True
    env = dotenv_values(".env")
    new_token = env.get("SESSION_TOKEN")

    # Assert new_token is not empty, and log if unchanged
    assert new_token is not None
    if new_token == original_token:
        print("[INFO] Token was valid and not updated.")
    else:
        print("[INFO] Token was updated.")
