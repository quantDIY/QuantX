# tests/test_retrieve_bars.py
import pytest
from dotenv import load_dotenv
from backend.topstepx_trader.retrieve_bars import retrieve_bars
import json


def test_retrieve_bars():
    load_dotenv(override=True)
    result = retrieve_bars("NQ", 5)
    assert result is not None
    assert result.get("success") is True
    assert "bars" in result
    with open("bars_log.json", "w") as f:
        json.dump(result.get("bars"), f, indent=2)
    print("[TEST OUTPUT] Bars returned:", json.dumps(result.get("bars"), indent=2))
