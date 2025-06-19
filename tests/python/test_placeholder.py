import os
import sys
from dotenv import load_dotenv

# Add backend path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

# Define key paths
ENV_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../.env'))
LOG_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../logs'))

# Load environment
load_dotenv(dotenv_path=ENV_PATH, override=True)

import pytest

def test_dummy():
    os.makedirs(LOG_DIR, exist_ok=True)
    with open(os.path.join(LOG_DIR, "dummy_log.json"), "w") as f:
        f.write('{"status": "ok"}')
    assert os.path.exists(ENV_PATH)
