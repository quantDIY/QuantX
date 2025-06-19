import requests
import json
from topstepx_trader import config
from topstepx_trader.env_utils import update_env_vars

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

        accounts = result.get("accounts", [])
        if accounts:
            json_accounts = json.dumps(accounts)
            update_env_vars({"ACTIVE_ACCOUNTS": json_accounts})
            print("[DEBUG] Updated .env with ACTIVE_ACCOUNTS in JSON format")

        return result
    except Exception:
        print("[DEBUG] Non-JSON response:", response.text)
        return None

