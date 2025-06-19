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

import os
from backend.topstepx_trader.position_api_client import (
    search_open_positions,
    close_position,
    partial_close_position
)

# Test functions
def test_search_open_positions():
    account_id = int(os.getenv("ACCOUNT_ID"))
    result = search_open_positions(account_id)
    print("Search Open Positions Response:", result)
    assert result["success"] is True

def test_close_position():
    account_id = int(os.getenv("ACCOUNT_ID"))
    contract_id = os.getenv("CONTRACT_ID")
    result = close_position(account_id, contract_id)
    print("Close Position Response:", result)
    # Accept common error codes indicating no open position, action not allowed, or contract not found
    assert result["success"] is True or result["errorCode"] in [1, 2, 5]

def test_partial_close_position():
    account_id = int(os.getenv("ACCOUNT_ID"))
    contract_id = os.getenv("CONTRACT_ID")
    result = partial_close_position(account_id, contract_id, size=1)
    print("Partial Close Position Response:", result)
    # Accept common error codes indicating no position, not allowed, or invalid size
    assert result["success"] is True or result["errorCode"] in [1, 2, 5]
