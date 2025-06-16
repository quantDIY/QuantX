# topstepx_trader/retrieve_bars.py
import os
import requests
import json
from datetime import datetime, timedelta
from dotenv import load_dotenv
from backend.topstepx_trader.contracts import search_contracts

load_dotenv()

BASE_API_URL = os.getenv("BASE_API_URL", "https://api.topstepx.com")
SESSION_TOKEN = os.getenv("SESSION_TOKEN")
LIVE_MODE = os.getenv("LIVE_MODE", "true").lower() == "true"

HEADERS = {
    "accept": "text/plain",
    "Content-Type": "application/json",
    "Authorization": f"Bearer {SESSION_TOKEN}"
}

def get_current_front_month_contract_id(symbol: str = "NQ") -> str:
    result = search_contracts(symbol, live=LIVE_MODE)
    contracts = result.get("contracts", [])
    if not contracts:
        raise Exception("No contracts found for symbol")
    return contracts[0]["id"]

def retrieve_bars(symbol="NQ", minutes=100):
    contract_id = get_current_front_month_contract_id(symbol)

    end_time = datetime.utcnow()
    start_time = end_time - timedelta(minutes=minutes)

    payload = {
        "contractId": contract_id,
        "live": LIVE_MODE,
        "startTime": start_time.isoformat() + "Z",
        "endTime": end_time.isoformat() + "Z",
        "unit": 2,  # Minute
        "unitNumber": 1,
        "limit": minutes,
        "includePartialBar": False
    }

    response = requests.post(f"{BASE_API_URL}/api/History/retrieveBars", headers=HEADERS, json=payload)
    print("[DEBUG] Status Code:", response.status_code)
    print("[DEBUG] Payload:", json.dumps(payload, indent=2))
    result = response.json()
    print("[DEBUG] Response:", json.dumps(result, indent=2))
    return result
