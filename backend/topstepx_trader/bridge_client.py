import requests
from backend.topstepx_trader import config

def listen_to_bridge():
    response = requests.get(f"{config.NODE_BRIDGE_URL}/stream", stream=True)
    for line in response.iter_lines():
        if line:
            print("[Bridge]", line.decode('utf-8'))
