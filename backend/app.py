# backend/app.py

from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from backend.topstepx_trader.accounts import search_accounts
from backend.topstepx_trader.auth import authenticate
from backend.topstepx_trader.redis_utils import get_json, set_str, get_str
from backend.design_mcp_server import QuantXDesignMCPServer, load_design_env
import os
import asyncio
import json

# Load design system configuration
design_env = load_design_env()

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# ---------------- SCHEDULER HOOK ----------------
try:
    from backend.topstepx_trader.scheduler import schedule_reauth
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

# Design System and Figma Integration Endpoints
@app.route('/api/design-tokens', methods=['GET'])
def get_design_tokens():
    """Get current design tokens from Redis cache"""
    tokens = get_json("design_tokens", [])
    return jsonify({
        "tokens": tokens,
        "count": len(tokens),
        "last_synced": get_str("design_tokens_last_synced")
    })

@app.route('/api/design-tokens/sync-figma', methods=['POST'])
def sync_figma_tokens():
    """Sync design tokens from Figma file"""
    data = request.json
    if not data or not data.get('figma_file_key'):
        return jsonify({"error": "Figma file key required"}), 400
    
    figma_token = get_str("FIGMA_TOKEN")
    if not figma_token:
        return jsonify({"error": "Figma token not configured"}), 400
    
    try:
        # Initialize design server
        design_server = QuantXDesignMCPServer(figma_token=figma_token)
        
        # Extract tokens from Figma
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        tokens = loop.run_until_complete(
            design_server.extract_design_tokens_from_figma(
                data['figma_file_key'],
                data.get('page_name', 'Design System')
            )
        )
        
        # Convert tokens to dict format for JSON storage
        tokens_data = [{
            "name": token.name,
            "value": token.value,
            "category": token.category,
            "figma_node_id": token.figma_node_id,
            "last_synced": token.last_synced.isoformat() if token.last_synced else None,
            "description": token.description
        } for token in tokens]
        
        # Store in Redis
        set_str("design_tokens", json.dumps(tokens_data))
        set_str("design_tokens_last_synced", json.dumps({"timestamp": tokens[0].last_synced.isoformat() if tokens else None}))
        
        # Sync with globals.css
        globals_path = os.path.join(os.path.dirname(__file__), '../frontend/styles/globals.css')
        sync_result = loop.run_until_complete(
            design_server.sync_with_quantx_globals(globals_path)
        )
        
        loop.close()
        
        # Emit update to connected clients
        socketio.emit('design_tokens_updated', {
            "tokens": tokens_data,
            "count": len(tokens_data),
            "sync_result": sync_result
        }, broadcast=True)
        
        return jsonify({
            "status": "success",
            "tokens_synced": len(tokens_data),
            "css_sync_result": sync_result
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/design-tokens/generate-css', methods=['GET'])
def generate_css_variables():
    """Generate CSS variables from current design tokens"""
    tokens_data = get_json("design_tokens", [])
    
    if not tokens_data:
        return jsonify({"error": "No design tokens found"}), 404
    
    try:
        # Reconstruct DesignToken objects
        design_server = QuantXDesignMCPServer()
        design_server.design_tokens = []
        
        for token_data in tokens_data:
            from backend.design_mcp_server import DesignToken
            from datetime import datetime
            
            token = DesignToken(
                name=token_data['name'],
                value=token_data['value'],
                category=token_data['category'],
                figma_node_id=token_data.get('figma_node_id'),
                last_synced=datetime.fromisoformat(token_data['last_synced']) if token_data.get('last_synced') else None,
                description=token_data.get('description')
            )
            design_server.design_tokens.append(token)
        
        css_variables = design_server.generate_css_variables()
        tailwind_config = design_server.generate_tailwind_config_extension()
        
        return jsonify({
            "css_variables": css_variables,
            "tailwind_config_extension": tailwind_config,
            "tokens_count": len(tokens_data)
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/design-system/figma-config', methods=['POST'])
def save_figma_config():
    """Save Figma configuration"""
    data = request.json
    if not data:
        return jsonify({"error": "Configuration data required"}), 400
    
    # Store Figma configuration in Redis
    set_str("FIGMA_TOKEN", data.get('figma_token', ''))
    set_str("FIGMA_FILE_KEY", data.get('figma_file_key', ''))
    set_str("FIGMA_PAGE_NAME", data.get('figma_page_name', 'Design System'))
    
    return jsonify({"status": "success", "message": "Figma configuration saved"})

@app.route('/api/design-system/figma-config', methods=['GET'])
def get_figma_config():
    """Get current Figma configuration"""
    return jsonify({
        "figma_token_configured": bool(get_str("FIGMA_TOKEN")),
        "figma_file_key": get_str("FIGMA_FILE_KEY"),
        "figma_page_name": get_str("FIGMA_PAGE_NAME") or "Design System"
    })

# SocketIO events for real-time design system updates
@socketio.on('subscribe_design_tokens')
def handle_subscribe_design_tokens():
    """Subscribe to design token updates"""
    tokens = get_json("design_tokens", [])
    emit("design_tokens_update", {
        "tokens": tokens,
        "count": len(tokens),
        "last_synced": get_str("design_tokens_last_synced")
    })

@socketio.on('sync_figma_tokens')
def handle_sync_figma_tokens(data):
    """Handle real-time Figma token sync request"""
    figma_file_key = data.get('figma_file_key') or get_str("FIGMA_FILE_KEY")
    if not figma_file_key:
        emit('design_sync_error', {'error': 'No Figma file key configured'})
        return
    
    try:
        # This would trigger the sync process
        # For now, emit a placeholder response
        emit('design_sync_started', {'message': 'Starting Figma sync...'})
        
        # In a real implementation, you'd call the sync function here
        # and emit the results when complete
        
    except Exception as e:
        emit('design_sync_error', {'error': str(e)})

def main():
    # Use port from environment or fallback to a safe high port
    port = int(os.environ.get("QUANTX_BACKEND_PORT", 5999))
    import eventlet
    eventlet.monkey_patch()
    socketio.run(app, host='0.0.0.0', port=port)

if __name__ == "__main__":
    main()
