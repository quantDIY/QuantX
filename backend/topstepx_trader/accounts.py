# backend/topstepx_trader/accounts.py

import requests
from topstepx_trader import config
from topstepx_trader.redis_utils import set_json

def search_accounts(only_active=True):
    url = f"{config.BASE_API_URL}/api/Account/search"
    headers = {
        "accept": "text/plain",
        "Content-Type": "application/json",
        "Authorization": f"Bearer {config.SESSION_TOKEN}"
    }
    payload = {"onlyActiveAccounts": only_active}
    response = requests.post(url, headers=headers, json=payload)
    try:
        result = response.json()
        accounts = result.get("accounts", [])
        if accounts:
            set_json("accounts", accounts)
        return result
    except Exception:
        return None
