# tests/test_accounts.py
import pytest
import json
from dotenv import load_dotenv, find_dotenv
import os
from topstepx_trader.accounts import search_accounts
from topstepx_trader.auth import authenticate

def test_search_accounts():
    load_dotenv(override=True)
    token = authenticate()

    # Update SESSION_TOKEN in .env
    env_path = find_dotenv(filename=".env", raise_error_if_not_found=True)

    with open(env_path, 'r') as f:
        lines = f.readlines()

    updated_lines = []
    token_updated = False
    for line in lines:
        if line.startswith("SESSION_TOKEN="):
            updated_lines.append(f'SESSION_TOKEN="{token}"\n')
            token_updated = True
        else:
            updated_lines.append(line)
    if not token_updated:
        updated_lines.append(f'SESSION_TOKEN="{token}"\n')

    with open(env_path, 'w') as f:
        f.writelines(updated_lines)

    load_dotenv(override=True)
    result = search_accounts()
    accounts = result.get("accounts", [])

    with open("account_log.json", "w") as f:
        json.dump(accounts, f, indent=2)

    print("[DEBUG] API Returned Accounts:", json.dumps(accounts, indent=2))

    # Update or append TSX_ACTIVE_ACCOUNTS
    with open(env_path, 'r') as f:
        lines = f.readlines()

    updated_lines = []
    accounts_updated = False
    for line in lines:
        if line.startswith("TSX_ACTIVE_ACCOUNTS="):
            updated_lines.append(f'TSX_ACTIVE_ACCOUNTS={json.dumps(accounts)}\n')
            accounts_updated = True
        else:
            updated_lines.append(line)
    if not accounts_updated:
        updated_lines.append(f'TSX_ACTIVE_ACCOUNTS={json.dumps(accounts)}\n')

    with open(env_path, 'w') as f:
        f.writelines(updated_lines)

    # Reload to validate
    load_dotenv(override=True)
    env_accounts_raw = os.getenv("TSX_ACTIVE_ACCOUNTS")
    assert env_accounts_raw is not None, "TSX_ACTIVE_ACCOUNTS not found in .env"

    try:
        env_accounts = json.loads(env_accounts_raw)
        print("[DEBUG] TSX_ACTIVE_ACCOUNTS in .env:", json.dumps(env_accounts, indent=2))
        assert isinstance(env_accounts, list), "TSX_ACTIVE_ACCOUNTS is not a valid list"
        assert env_accounts == accounts, "Mismatch between returned accounts and .env"
    except json.JSONDecodeError:
        pytest.fail("Failed to decode TSX_ACTIVE_ACCOUNTS JSON from .env")

