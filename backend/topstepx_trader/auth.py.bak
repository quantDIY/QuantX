import requests
from dotenv import set_key
from topstepx_trader import config

def authenticate():
    url = f"{config.BASE_API_URL}/api/Auth/loginKey"
    data = {"userName": config.USERNAME, "apiKey": config.API_KEY}
    headers = {
        "accept": "text/plain",
        "Content-Type": "application/json"
    }
    print(f"[DEBUG] Authenticating with USERNAME={config.USERNAME}, API_KEY={'*' * len(config.API_KEY) if config.API_KEY else None}")
    response = requests.post(url, headers=headers, json=data)
    print(f"[DEBUG] Status Code: {response.status_code}")
    try:
        print(f"[DEBUG] Response Body: {response.json()}")
    except Exception as e:
        print(f"[DEBUG] Non-JSON response: {response.text}")

    if response.ok:
        result = response.json()
        token = result.get("token")
        if token:
            set_key(".env", "SESSION_TOKEN", token)
            return token
    raise Exception("Authentication failed")

def validate_token():
    url = f"{config.BASE_API_URL}/api/Auth/validate"
    headers = {
        "accept": "text/plain",
        "Content-Type": "application/json",
        "Authorization": f"Bearer {config.SESSION_TOKEN}"
    }
    print(f"[DEBUG] Validating token: {config.SESSION_TOKEN[:10]}...")
    response = requests.post(url, headers=headers)
    print(f"[DEBUG] Status Code: {response.status_code}")
    try:
        print(f"[DEBUG] Response Body: {response.json()}")
    except Exception as e:
        print(f"[DEBUG] Non-JSON response: {response.text}")

    if response.ok:
        result = response.json()
        if result.get("success") and result.get("newToken"):
            set_key(".env", "SESSION_TOKEN", result["newToken"])
            return True
    return False
