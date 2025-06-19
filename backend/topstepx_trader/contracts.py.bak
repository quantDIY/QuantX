# topstepx_trader/contracts.py
import requests
from topstepx_trader import config

def search_contracts(search_text="NQ", live=False):
    url = f"{config.BASE_API_URL}/api/Contract/search"
    headers = {
        "accept": "text/plain",
        "Content-Type": "application/json",
        "Authorization": f"Bearer {config.SESSION_TOKEN}"
    }
    payload = {"searchText": search_text, "live": live}
    print("[DEBUG] Searching contracts with token:", config.SESSION_TOKEN[:10])
    response = requests.post(url, headers=headers, json=payload)
    print(f"[DEBUG] Status Code: {response.status_code}")
    try:
        print("[DEBUG] Response:", response.json())
        return response.json()
    except Exception:
        print("[DEBUG] Non-JSON response:", response.text)
        return None

def search_contract_by_id(contract_id):
    url = f"{config.BASE_API_URL}/api/Contract/searchById"
    headers = {
        "accept": "text/plain",
        "Content-Type": "application/json",
        "Authorization": f"Bearer {config.SESSION_TOKEN}"
    }
    payload = {"contractId": contract_id}
    print("[DEBUG] Searching contract by ID with token:", config.SESSION_TOKEN[:10])
    response = requests.post(url, headers=headers, json=payload)
    print(f"[DEBUG] Status Code: {response.status_code}")
    try:
        print("[DEBUG] Response:", response.json())
        return response.json()
    except Exception:
        print("[DEBUG] Non-JSON response:", response.text)
        return None
