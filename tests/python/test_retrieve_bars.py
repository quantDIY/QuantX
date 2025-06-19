import os
import sys
from dotenv import load_dotenv

# Fix import paths
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

# Define key paths
ENV_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../.env'))
LOG_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../logs'))

# Load environment
load_dotenv(dotenv_path=ENV_PATH, override=True)

# tests/test_retrieve_bars.py
import pytest
from dotenv import load_dotenv
from backend.topstepx_trader.retrieve_bars import retrieve_bars
import json
import os

LOG_DIR = "logs"


def test_retrieve_bars():
    load_dotenv(override=True)
    result = retrieve_bars("NQ", 5)
    assert result is not None
    assert result.get("success") is True
    assert "bars" in result
    os.makedirs(LOG_DIR, exist_ok=True)
    with open(os.path.join(LOG_DIR, "bars_log.json"), "w") as f:
        json.dump(result.get("bars"), f, indent=2)
    print("[TEST OUTPUT] Bars returned:", json.dumps(result.get("bars"), indent=2))
