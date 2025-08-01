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

# tests/test_contracts.py
import pytest
from dotenv import load_dotenv
from backend.topstepx_trader.contracts import search_contracts, search_contract_by_id
import json
import os

LOG_DIR = "logs"

def test_search_contracts():
    load_dotenv(override=True)
    result = search_contracts("NQ", live=False)
    assert result is not None
    assert result.get("success") is True
    assert "contracts" in result
    os.makedirs(LOG_DIR, exist_ok=True)
    with open(os.path.join(LOG_DIR, "contracts_log.json"), "w") as f:
        json.dump(result.get("contracts"), f, indent=2)
    print("[TEST OUTPUT] Contracts returned:", json.dumps(result.get("contracts"), indent=2))

def test_search_contract_by_id():
    load_dotenv(override=True)
    result = search_contract_by_id("CON.F.US.ENQ.H25")
    assert result is not None
    assert result.get("success") is True
    assert "contract" in result
    os.makedirs(LOG_DIR, exist_ok=True)
    with open(os.path.join(LOG_DIR, "contract_by_id_log.json"), "w") as f:
        json.dump(result.get("contract"), f, indent=2)
    print("[TEST OUTPUT] Contract by ID returned:", json.dumps(result.get("contract"), indent=2))
