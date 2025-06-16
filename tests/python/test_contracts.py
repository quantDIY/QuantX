# tests/test_contracts.py
import pytest
from dotenv import load_dotenv
from topstepx_trader.contracts import search_contracts, search_contract_by_id
import json

def test_search_contracts():
    load_dotenv(override=True)
    result = search_contracts("NQ", live=False)
    assert result is not None
    assert result.get("success") is True
    assert "contracts" in result
    with open("contracts_log.json", "w") as f:
        json.dump(result.get("contracts"), f, indent=2)
    print("[TEST OUTPUT] Contracts returned:", json.dumps(result.get("contracts"), indent=2))

def test_search_contract_by_id():
    load_dotenv(override=True)
    result = search_contract_by_id("CON.F.US.ENQ.H25")
    assert result is not None
    assert result.get("success") is True
    assert "contract" in result
    with open("contract_by_id_log.json", "w") as f:
        json.dump(result.get("contract"), f, indent=2)
    print("[TEST OUTPUT] Contract by ID returned:", json.dumps(result.get("contract"), indent=2))
