# quantx/utils.py

import platform
from rich import print

def run_checks():
    print(f"[bold blue]QuantX System Check[/bold blue]")
    print(f"Python: {platform.python_version()} ({platform.python_implementation()})")
    print(f"Platform: {platform.system()} {platform.release()}")
    # Add more dependency checks as you wish!
