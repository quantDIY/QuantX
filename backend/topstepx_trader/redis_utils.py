# backend/topstepx_trader/redis_utils.py

import redis
import json
import os

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

def get_redis():
    return redis.Redis.from_url(REDIS_URL, decode_responses=True)

def set_json(key, value):
    client = get_redis()
    client.set(key, json.dumps(value))

def get_json(key, default=None):
    client = get_redis()
    val = client.get(key)
    if val is None:
        return default
    return json.loads(val)

def set_str(key, value):
    client = get_redis()
    client.set(key, value)

def get_str(key, default=None):
    client = get_redis()
    val = client.get(key)
    if val is None:
        return default
    return val
