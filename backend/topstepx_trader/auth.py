# backend/topstepx_trader/auth.py

import requests
from dotenv import load_dotenv
from topstepx_trader import config
from topstepx_trader.redis_utils import set_str, get_str

def authenticate():
    load_dotenv(override=True)
    url = f"{config.BASE_API_URL}/api/Auth/loginKey"
    data = {"userName": config.USERNAME, "apiKey": config.API_KEY}
    headers = {
        "accept": "text/plain",
        "Content-Type": "application/json"
    }
    response = requests.post(url, headers=headers, json=data)
    if response.ok:
        result = response.json()
        token = result.get("token")
        if token:
            set_str("SESSION_TOKEN", token)
            return token
    raise Exception("Authentication failed")

def validate_token():
    load_dotenv(override=True)
    url = f"{config.BASE_API_URL}/api/Auth/validate"
    session_token = get_str("SESSION_TOKEN")
    headers = {
        "accept": "text/plain",
        "Content-Type": "application/json",
        "Authorization": f"Bearer {session_token}"
    }
    response = requests.post(url, headers=headers)
    if response.ok:
        result = response.json()
        if result.get("success") and result.get("newToken"):
            set_str("SESSION_TOKEN", result["newToken"])
            return True
    return False
