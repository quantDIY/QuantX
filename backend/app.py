from flask import Flask, request, jsonify
from topstepx_trader.accounts import search_accounts
from topstepx_trader.env_utils import update_env_vars
from topstepx_trader.auth import authenticate
import os

app = Flask(__name__)

@app.route('/api/accounts', methods=['POST'])
def api_search_accounts():
    return jsonify(search_accounts())

@app.route('/api/save-creds', methods=['POST'])
def save_creds():
    data = request.json
    if not data or not {"USERNAME", "API_KEY"}.issubset(data):
        return jsonify({"error": "Missing required fields"}), 400

    update_env_vars({
        "USERNAME": data["USERNAME"],
        "API_KEY": data["API_KEY"]
    })

    try:
        token = authenticate()
        return jsonify({"status": "ok", "token": token})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
