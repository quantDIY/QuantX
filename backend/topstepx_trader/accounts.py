# topstepx_trader/accounts.py
import requests
from backend.topstepx_trader import config
from dotenv import set_key
import json

def search_accounts(only_active=True):
    url = f"{config.BASE_API_URL}/api/Account/search"
    headers = {
        "accept": "text/plain",
        "Content-Type": "application/json",
        "Authorization": f"Bearer {config.SESSION_TOKEN}"
    }
    payload = {"onlyActiveAccounts": only_active}
    print("[DEBUG] Searching accounts with token:", config.SESSION_TOKEN[:10])
    response = requests.post(url, headers=headers, json=payload)
    print(f"[DEBUG] Status Code: {response.status_code}")
    try:
        result = response.json()
        print("[DEBUG] Response:", result)
        
        # Extract and update active accounts in JSON format in .env
        accounts = result.get("accounts", [])
        if accounts:
            json_accounts = json.dumps(accounts)
            set_key(".env", "ACTIVE_ACCOUNTS", json_accounts)
            print("[DEBUG] Updated .env with ACTIVE_ACCOUNTS in JSON format")

        return result
    except Exception:
        print("[DEBUG] Non-JSON response:", response.text)
        return None
