import os
from dotenv import load_dotenv
import requests

load_dotenv()

BASE_URL = os.getenv("BASE_API_URL")
SESSION_TOKEN = os.getenv("SESSION_TOKEN")

headers = {
    "Authorization": f"Bearer {SESSION_TOKEN}",
    "Content-Type": "application/json"
}

def search_orders(account_id, start_ts, end_ts):
    url = f"{BASE_URL}/api/Order/search"
    payload = {
        "accountId": account_id,
        "startTimestamp": start_ts,
        "endTimestamp": end_ts
    }
    response = requests.post(url, json=payload, headers=headers)
    return response.json()

def search_open_orders(account_id):
    url = f"{BASE_URL}/api/Order/searchOpen"
    payload = {"accountId": account_id}
    response = requests.post(url, json=payload, headers=headers)
    return response.json()

def place_order(order_data):
    url = f"{BASE_URL}/api/Order/place"
    response = requests.post(url, json=order_data, headers=headers)
    return response.json()

def cancel_order(account_id, order_id):
    url = f"{BASE_URL}/api/Order/cancel"
    payload = {
        "accountId": account_id,
        "orderId": order_id
    }
    response = requests.post(url, json=payload, headers=headers)
    return response.json()

def modify_order(account_id, order_id, **kwargs):
    url = f"{BASE_URL}/api/Order/modify"
    payload = {"accountId": account_id, "orderId": order_id, **kwargs}
    response = requests.post(url, json=payload, headers=headers)
    return response.json()
