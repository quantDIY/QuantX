import schedule
import time
import threading
from topstepx_trader.auth import authenticate

def schedule_reauth():
    schedule.every().day.at("17:45").do(authenticate)
    def run_scheduler():
        while True:
            schedule.run_pending()
            time.sleep(60)
    threading.Thread(target=run_scheduler, daemon=True).start()
