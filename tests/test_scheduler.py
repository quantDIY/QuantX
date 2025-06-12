import schedule
from topstepx_trader.scheduler import schedule_reauth

def test_schedule_exists():
    schedule.clear()
    schedule_reauth()
    assert any(job.at_time.strftime("%H:%M") == "17:45" for job in schedule.jobs)
