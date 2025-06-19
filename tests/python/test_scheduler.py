import os
import sys
from dotenv import load_dotenv

# Fix import paths
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

# Define key paths
ENV_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../.env'))
LOG_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../logs'))

# Load environment
load_dotenv(dotenv_path=ENV_PATH, override=True)

import schedule
from backend.topstepx_trader.scheduler import schedule_reauth

def test_schedule_exists():
    schedule.clear()
    schedule_reauth()
    assert any(job.at_time.strftime("%H:%M") == "17:45" for job in schedule.jobs)
