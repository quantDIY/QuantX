import os
import pytest

@pytest.fixture(autouse=True, scope="session")
def ensure_logs_dir():
    os.makedirs("logs", exist_ok=True)
    return "logs"

