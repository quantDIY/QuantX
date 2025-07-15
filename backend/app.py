# backend/app.py

from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS  # <-- Add this import
from topstepx_trader.accounts import search_accounts
from topstepx_trader.auth import authenticate
from topstepx_trader.redis_utils import get_json, set_str, get_str
import os

app = Flask(__name__)
CORS(app)  # <-- This enables CORS for all routes
socketio = SocketIO(app, cors_allowed_origins="*")

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

@socketio.on('subscribe_accounts')
def handle_subscribe_accounts():
    emit("accounts_update", get_json("accounts", []))

@socketio.on('refresh_accounts')
def handle_refresh_accounts():
    search_accounts()
    emit("accounts_update", get_json("accounts", []), broadcast=True)

def emit_accounts_update():
    socketio.emit("accounts_update", get_json("accounts", []), broadcast=True)

if __name__ == '__main__':
    # Use eventlet for production-like SocketIO experience
    import eventlet
    eventlet.monkey_patch()
    socketio.run(app, host='0.0.0.0', port=5000)
