import os
import time
from dotenv import load_dotenv
import pytest
from topstepx_trader.order_api_client import (
    search_orders,
    search_open_orders,
    place_order,
    cancel_order,
    modify_order
)

load_dotenv()

ACCOUNT_ID = int(os.getenv("ACCOUNT_ID"))
CONTRACT_ID = os.getenv("CONTRACT_ID")


def test_search_orders():
    from datetime import datetime, timedelta
    end_ts = datetime.utcnow().isoformat()
    start_ts = (datetime.utcnow() - timedelta(days=1)).isoformat()
    response = search_orders(ACCOUNT_ID, start_ts, end_ts)
    print("Search Orders Response:", response)
    assert response["success"] is True


def test_search_open_orders():
    response = search_open_orders(ACCOUNT_ID)
    print("Search Open Orders Response:", response)
    assert response["success"] is True


def place_sample_order():
    order = {
        "accountId": ACCOUNT_ID,
        "contractId": CONTRACT_ID,
        "type": 1,  # Limit
        "side": 1,  # Sell
        "size": 1,
        "limitPrice": 9999,  # High price to avoid immediate fill
        "stopPrice": None,
        "trailPrice": None,
        "customTag": None,
        "linkedOrderId": None
    }
    response = place_order(order)
    print("Place Order Response:", response)
    assert response["success"] is True
    return response["orderId"]


def test_place_order():
    place_sample_order()  # Just place to confirm success


def test_cancel_order():
    order_id = place_sample_order()
    time.sleep(0.5)
    response = cancel_order(ACCOUNT_ID, order_id)
    print("Cancel Order Response:", response)
    assert response["success"] is True


def test_modify_order():
    order = {
        "accountId": ACCOUNT_ID,
        "contractId": CONTRACT_ID,
        "type": 1,  # Limit
        "side": 0,  # Buy
        "size": 1,
        "limitPrice": 5500,  # Low price to avoid fill
        "stopPrice": None,
        "trailPrice": None,
        "customTag": None,
        "linkedOrderId": None
    }
    placed = place_order(order)
    print("Place Order for Modify Response:", placed)
    assert placed["success"] is True
    order_id = placed["orderId"]
    time.sleep(0.5)
    response = modify_order(ACCOUNT_ID, order_id, size=2, limitPrice=5600)
    print("Modify Order Response:", response)
    assert response["success"] is True
