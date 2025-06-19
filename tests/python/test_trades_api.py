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
from backend.topstepx_trader.trades_api_client import search_trades

def test_search_trades():
    """
    Test the search_trades function to ensure it retrieves trade data successfully.
    """
    # Retrieve test parameters from environment variables
    account_id = int(os.getenv("ACCOUNT_ID"))
    start_timestamp = os.getenv("START_TIMESTAMP")
    end_timestamp = os.getenv("END_TIMESTAMP")

    # Call the function with test parameters
    result = search_trades(account_id, start_timestamp, end_timestamp)

    # Output the response for debugging purposes
    print("Search Trades Response:", result)

    # Assert that the API call was successful
    assert result["success"] is True

    # Assert that the 'trades' key exists in the response
    assert "trades" in result

    # Additional assertions can be added here to validate the contents of 'trades'
