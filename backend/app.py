# backend/app.py

from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from topstepx_trader.accounts import search_accounts
from topstepx_trader.auth import authenticate
from topstepx_trader.redis_utils import get_json, set_str, get_str
import os

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# ---------------- SCHEDULER HOOK ----------------
try:
    from topstepx_trader.scheduler import schedule_reauth
    print("[cyan]Starting token auto-refresh scheduler (5:45pm ET daily)[/cyan]")
    schedule_reauth()
except Exception as e:
    print(f"[WARNING] Could not start token refresh scheduler: {e}")
# ------------------------------------------------

@app.route('/api/accounts', methods=['GET'])
def get_accounts():
    accounts = get_json("accounts", [])
    return jsonify(accounts)

@app.route('/api/save-creds', methods=['POST'])
def save_creds():
    data = request.json
    if not data or not {"USERNAME", "API_KEY"}.issubset(data):
        return jsonify({"error": "Missing required fields"}), 400
    set_str("USERNAME", data["USERNAME"])
    set_str("API_KEY", data["API_KEY"])
    try:
        token = authenticate()
        set_str("SESSION_TOKEN", token)
        return jsonify({"status": "ok", "token": token})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/dashboard-metrics', methods=['GET'])
def dashboard_metrics():
    accounts = get_json("accounts", [])
    metrics = {
        "num_accounts": len(accounts),
        "total_equity": sum(a.get("balance", 0) or 0 for a in accounts),
        "num_active": sum(1 for a in accounts if a.get("status") == "active"),
        "num_demo": sum(1 for a in accounts if a.get("status") == "demo"),
        "total_positions": sum(a.get("positions", 0) or 0 for a in accounts),
        "total_pnl": sum(a.get("dailyPnL", 0) or 0 for a in accounts),
        "max_loss_limit": sum(a.get("maxLossLimit", 0) or 0 for a in accounts),
        "last_updated": None,
    }
    if accounts:
        metrics["last_updated"] = accounts[0].get("lastUpdated")
    return jsonify(metrics)

@socketio.on('subscribe_accounts')
def handle_subscribe_accounts():
    emit("accounts_update", get_json("accounts", []))

@socketio.on('refresh_accounts')
def handle_refresh_accounts():
    search_accounts()
    emit("accounts_update", get_json("accounts", []), broadcast=True)

def emit_accounts_update():
    socketio.emit("accounts_update", get_json("accounts", []), broadcast=True)

def main():
    # Use port from environment or fallback to a safe high port
    port = int(os.environ.get("QUANTX_BACKEND_PORT", 5999))
    import eventlet
    eventlet.monkey_patch()
    socketio.run(app, host='0.0.0.0', port=port)

if __name__ == "__main__":
    main()
