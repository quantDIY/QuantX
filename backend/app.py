from flask import Flask, request, jsonify
from topstepx_trader.accounts import search_accounts
import os

app = Flask(__name__)

@app.route('/api/accounts', methods=['POST'])
def api_search_accounts():
    return jsonify(search_accounts())

# ... add /order, /trade, /position routes analogously
