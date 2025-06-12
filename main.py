from topstepx_trader.auth import authenticate
from topstepx_trader.scheduler import schedule_reauth
from topstepx_trader.bridge_client import listen_to_bridge
import threading

if __name__ == "__main__":
    token = authenticate()
    print(f"Authenticated. Token: {token[:10]}...")
    schedule_reauth()

    bridge_thread = threading.Thread(target=listen_to_bridge)
    bridge_thread.start()
    bridge_thread.join()
