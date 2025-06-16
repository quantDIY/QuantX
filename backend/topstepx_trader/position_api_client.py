import os
import requests
from dotenv import load_dotenv

load_dotenv()

BASE_URL = os.getenv("BASE_API_URL")
SESSION_TOKEN = os.getenv("SESSION_TOKEN")

headers = {
    "Authorization": f"Bearer {SESSION_TOKEN}",
    "Content-Type": "application/json"
}

def search_open_positions(account_id):
    url = f"{BASE_URL}/api/Position/searchOpen"
    payload = {"accountId": account_id}
    response = requests.post(url, json=payload, headers=headers)
    return response.json()

def close_position(account_id, contract_id):
    url = f"{BASE_URL}/api/Position/closeContract"
    payload = {
        "accountId": account_id,
        "contractId": contract_id
    }
    response = requests.post(url, json=payload, headers=headers)
    return response.json()

def partial_close_position(account_id, contract_id, size):
    url = f"{BASE_URL}/api/Position/partialCloseContract"
    payload = {
        "accountId": account_id,
        "contractId": contract_id,
        "size": size
    }
    response = requests.post(url, json=payload, headers=headers)
    return response.json()
