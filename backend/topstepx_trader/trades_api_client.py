import os
import requests
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

# Base URL and session token for API authentication
BASE_URL = os.getenv("BASE_API_URL")
SESSION_TOKEN = os.getenv("SESSION_TOKEN")

# Headers including the authorization token
headers = {
    "Authorization": f"Bearer {SESSION_TOKEN}",
    "Content-Type": "application/json"
}

def search_trades(account_id, start_timestamp, end_timestamp=None):
    """
    Search for trades within a specified time range for a given account.

    Parameters:
        account_id (int): The account ID.
        start_timestamp (str): The start of the timestamp filter in ISO format.
        end_timestamp (str, optional): The end of the timestamp filter in ISO format.

    Returns:
        dict: The JSON response from the API containing trade data.
    """
    url = f"{BASE_URL}/api/Trade/search"
    payload = {
        "accountId": account_id,
        "startTimestamp": start_timestamp
    }
    # Include endTimestamp in payload if provided
    if end_timestamp:
        payload["endTimestamp"] = end_timestamp

    response = requests.post(url, json=payload, headers=headers)
    return response.json()
