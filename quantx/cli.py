# quantx/cli.py

import sys
import click
from rich import print
from rich.console import Console

console = Console()

@click.group()
def main():
    """
    QuantX Command Line Interface

    [bold blue]QuantX[/bold blue]: Next-generation quant research and trading platform.
    """
    pass

@main.command()
def version():
    """Show QuantX version"""
    from quantx import __version__
    print(f"[bold green]QuantX v{__version__}[/bold green]")

@main.command()
def gui():
    """Launch the QuantX Electron GUI."""
    import subprocess
    try:
        console.print("[bold cyan]Launching QuantX Electron GUI...[/bold cyan]")
        subprocess.run(["npm", "start"], cwd="frontend")
    except Exception as e:
        print(f"[red]Failed to launch GUI: {e}[/red]")
        sys.exit(1)

@main.command()
@click.option("--headless", is_flag=True, help="Run QuantX backend API only, no GUI.")
def start(headless):
    """
    Start QuantX backend (and GUI unless --headless).
    """
    import subprocess
    import os

    # Start backend Flask app
    console.print("[bold cyan]Starting QuantX backend...[/bold cyan]")
    backend_proc = subprocess.Popen([sys.executable, "-m", "backend.app"])

    if not headless:
        # Start Electron GUI
        try:
            console.print("[bold cyan]Launching Electron GUI...[/bold cyan]")
            subprocess.run(["npm", "start"], cwd="frontend")
        except Exception as e:
            print(f"[red]Failed to launch GUI: {e}[/red]")
    else:
        console.print("[yellow]Running in headless mode (API only, no GUI)[/yellow]")
        backend_proc.wait()

@main.command()
def token_refresh():
    """Manually refresh your TopstepX session token."""
    try:
        from backend.topstepx_trader.auth import authenticate
        token = authenticate()
        print(f"[green]Session token refreshed: {token}[/green]")
    except Exception as e:
        print(f"[red]Token refresh failed: {e}[/red]")

@main.command()
def check():
    """Perform system checks and show important QuantX info."""
    from quantx.utils import run_checks
    run_checks()

@main.command()
def setup():
    """
    Setup QuantX environment: copy .env, set username/API key, fetch token & account info, choose default account.
    """
    import os
    import shutil
    from rich.prompt import Prompt
    from dotenv import set_key

    console.print("[bold cyan]QuantX Initial Setup[/bold cyan]")

    # Step 1: Copy .env.example to .env if not present
    if not os.path.exists('.env'):
        if os.path.exists('.env.example'):
            shutil.copy('.env.example', '.env')
            print("[green].env.example copied to .env[/green]")
        else:
            print("[red]No .env or .env.example found![/red]")
            return

    # Step 2: Prompt user for USERNAME and API_KEY
    username = Prompt.ask("Enter your TopstepX username")
    api_key = Prompt.ask("Enter your TopstepX API key", password=True)
    set_key('.env', 'USERNAME', username)
    set_key('.env', 'API_KEY', api_key)

    # Step 3: Try to fetch token
    console.print("Authenticating with TopstepX API...")
    try:
        from backend.topstepx_trader.auth import authenticate
        token = authenticate()
        set_key('.env', 'SESSION_TOKEN', token)
        print("[green]Token retrieved and saved to .env[/green]")
    except Exception as e:
        print(f"[red]Error: {e}[/red]\n[red]Failed to authenticate. Check your username/API key.[/red]")
        return

    # Step 4: Populate account info and prompt user to choose a default account
    try:
        from backend.topstepx_trader.accounts import search_accounts
        accounts_result = search_accounts()  # This is a dict!
        acct_list = accounts_result.get("accounts", []) if accounts_result else []
        if not acct_list:
            print("[yellow]No accounts found.[/yellow]")
        else:
            console.print("[cyan]Available Accounts:[/cyan]")
            for idx, acct in enumerate(acct_list):
                print(f"\n[{idx+1}] Account details:")
                for k, v in acct.items():
                    print(f"    {k}: {v}")
            selection = Prompt.ask("Select the default account (number)", choices=[str(i+1) for i in range(len(acct_list))])
            default_account = acct_list[int(selection)-1]
            set_key('.env', 'ACCOUNT_ID', str(default_account['id']))
            print(f"[green]Default ACCOUNT_ID set to {default_account['id']} ({default_account['name']})[/green]")
    except Exception as e:
        print(f"[yellow]Warning: Could not fetch account info: {e}[/yellow]")

    print("[bold green]Setup complete! You can now start QuantX.[/bold green]")

@main.command("in-browser")
def in_browser():
    """Run QuantX backend and open React UI in your browser (no Electron)."""
    import subprocess
    import webbrowser
    import time

    # Start backend Flask app
    console.print("[bold cyan]Starting QuantX backend...[/bold cyan]")
    backend_proc = subprocess.Popen([sys.executable, "-m", "backend.app"])

    # Start Vite/React frontend
    console.print("[bold cyan]Starting React frontend (browser mode)...[/bold cyan]")
    frontend_proc = subprocess.Popen(["npm", "run", "start:browser"])

    # Give frontend time to start up
    time.sleep(1)
    url = "http://localhost:5173"
    console.print(f"[green]Opening {url} in your browser...[/green]")
    webbrowser.open(url)

    try:
        backend_proc.wait()
        frontend_proc.wait()
    except KeyboardInterrupt:
        console.print("[yellow]Shutting down...[/yellow]")
        backend_proc.terminate()
        frontend_proc.terminate()

@main.command()
def help():
    click.echo(main.get_help(click.Context(main)))

@main.command("pip-extras")
@click.option("--all", "install_all", is_flag=True, help="Install all optional pip packages without prompting.")
@click.option("--uninstall", "uninstall_mode", is_flag=True, help="Uninstall selected/all pip extras.")
def pip_extras(install_all, uninstall_mode):
    """
    Install or uninstall recommended PyPI-only packages (not available on conda).
    Use --all to install all, --uninstall to uninstall instead of install.
    """
    import subprocess
    from rich.prompt import Confirm, Prompt
    from rich.table import Table

    pip_packages = [
        {
            "name": "vectorbt",
            "desc": "Next-gen Python library for quantitative analysis, backtesting, and algorithmic trading.",
            "pip": "vectorbt"
        },
        {
            "name": "orange3",
            "desc": "Data mining, machine learning, and visualization suite.",
            "pip": "orange3"
        },
        {
            "name": "gym",
            "desc": "OpenAI Gym for developing and comparing reinforcement learning algorithms.",
            "pip": "gym"
        },
        {
            "name": "TA-Lib",
            "desc": "TA-Lib for Python (requires TA-Lib C library preinstalled, see docs).",
            "pip": "TA-Lib"
        },
        {
            "name": "torch",
            "desc": "PyTorch machine learning framework (use pip if conda is problematic).",
            "pip": "torch"
        },
        {
            "name": "backtrader",
            "desc": "Popular backtesting engine for trading strategies.",
            "pip": "backtrader"
        },
        {
            "name": "pyoo",
            "desc": "Python bridge for LibreOffice & OpenOffice (open source MS 365 alternative).",
            "pip": "pyoo"
        },
        {
            "name": "opengl",
            "desc": "OpenGL for Python (PyOpenGL is usually enough, this is for edge cases).",
            "pip": "opengl"
        },
        # Add more packages as you wish...
    ]

    action_word = "Uninstalling" if uninstall_mode else "Installing"
    console.print(f"[bold cyan]{action_word} Optional PyPI-Only Extras[/bold cyan]")

    if install_all:
        selected_pkgs = pip_packages
        console.print(f"[bold cyan]{action_word.upper()} ALL pip-only extras...[/bold cyan]")
    else:
        if uninstall_mode:
            if not Confirm.ask("Would you like to UNINSTALL extra pip-only packages?"):
                console.print("[yellow]Skipping pip extras uninstall.[/yellow]")
                return
        else:
            if not Confirm.ask("Would you like to install extra pip-only packages (these are NOT available on conda)?"):
                console.print("[yellow]Skipping pip extras install. You can run this wizard later with 'quantx pip-extras'.[/yellow]")
                return

        from rich.console import Console
        table = Table(title="Recommended PyPI Packages")
        table.add_column("No.", style="cyan", width=4)
        table.add_column("Package", style="bold")
        table.add_column("Description", style="dim")

        for idx, pkg in enumerate(pip_packages):
            table.add_row(str(idx + 1), pkg["name"], pkg["desc"])

        console = Console()
        console.print(table)
        choices = Prompt.ask(
            f"Enter comma-separated numbers for packages to {'uninstall' if uninstall_mode else 'install'} (e.g. 1,2) or 'a' for all, or leave blank to cancel",
            default=""
        ).replace(" ", "")

        if not choices:
            console.print(f"[yellow]No packages selected. Nothing to {'uninstall' if uninstall_mode else 'install'}.[/yellow]")
            return

        # Parse user choices
        if choices.lower() == "a":
            selection = list(range(1, len(pip_packages)+1))
        else:
            try:
                selection = [int(x) for x in choices.split(",") if x.isdigit() and 1 <= int(x) <= len(pip_packages)]
            except Exception:
                console.print(f"[red]Invalid selection. Exiting pip extras {'uninstall' if uninstall_mode else 'wizard'}.[/red]")
                return

        selected_pkgs = [pip_packages[i-1] for i in selection]

    # Install or uninstall selected packages
    for pkg in selected_pkgs:
        if uninstall_mode:
            console.print(f"[cyan]Uninstalling [bold]{pkg['name']}[/bold]...[/cyan]")
            result = subprocess.run([sys.executable, "-m", "pip", "uninstall", "-y", pkg["pip"]])
            if result.returncode == 0:
                console.print(f"[green]{pkg['name']} uninstalled successfully.[/green]")
            else:
                console.print(f"[red]Failed to uninstall {pkg['name']}. You may try manually: pip uninstall {pkg['pip']}[/red]")
        else:
            console.print(f"[cyan]Installing [bold]{pkg['name']}[/bold]...[/cyan]")
            result = subprocess.run([sys.executable, "-m", "pip", "install", pkg["pip"]])
            if result.returncode == 0:
                console.print(f"[green]{pkg['name']} installed successfully.[/green]")
            else:
                console.print(f"[red]Failed to install {pkg['name']}. You may try manually: pip install {pkg['pip']}[/red]")

    if uninstall_mode:
        console.print("[bold green]Pip-extras uninstall complete![/bold green]")
        console.print("[yellow]You can run this wizard again anytime to add/remove features -- run [bold]quantx pip-extras[/bold][/yellow]")
    else:
        console.print("[bold green]Pip-extras installation complete![/bold green]")
        console.print("[yellow]You can run this wizard again anytime to add features -- run [bold]quantx pip-extras[/bold] or [bold]quantx pypi-extras[/bold][/yellow]")

@main.command("pypi-extras")  # alias for pip-extras
@click.option("--all", "install_all", is_flag=True, help="Install all optional pip packages without prompting.")
@click.option("--uninstall", "uninstall_mode", is_flag=True, help="Uninstall selected/all pip extras.")
def pypi_extras(install_all, uninstall_mode):
    pip_extras.callback(install_all, uninstall_mode)

@main.command()
@click.option("--lab", is_flag=True, help="Launch JupyterLab instead of Notebook.")
def jupyter(lab):
    """Launch Jupyter Notebook or JupyterLab in the active QuantX environment."""
    import subprocess
    app = "jupyter-lab" if lab else "jupyter-notebook"
    console.print(f"[bold cyan]Launching {app}...[/bold cyan]")
    try:
        subprocess.run([app])
    except Exception as e:
        print(f"[red]Failed to launch {app}: {e}[/red]")

@main.command()
def update():
    """Show update/upgrade instructions for QuantX."""
    import os
    console.print("[bold cyan]QuantX Update/Upgrade Instructions[/bold cyan]")
    if "CONDA_DEFAULT_ENV" in os.environ:
        console.print("[green]You are running in a Conda environment.[/green]")
        console.print("To update QuantX via conda (if published):\n")
        console.print("  [bold]conda update quantx[/bold]\n")
    else:
        console.print("[yellow]If you installed via pip:[/yellow]")
        console.print("  [bold]pip install --upgrade quantx[/bold]\n")
    console.print("If you installed from GitHub, pull latest and run:")
    console.print("  [bold]pip install .[/bold]  (from the QuantX directory)")

@main.command()
def spyder():
    """Launch Spyder IDE in the QuantX environment."""
    import subprocess
    console.print("[bold cyan]Launching Spyder...[/bold cyan]")
    try:
        subprocess.run(["spyder"])
    except Exception as e:
        print(f"[red]Failed to launch Spyder: {e}[/red]")

@main.command()
def vscode():
    """Launch VS Code in the QuantX environment."""
    import subprocess
    console.print("[bold cyan]Launching VS Code...[/bold cyan]")
    try:
        subprocess.run(["code"])
    except Exception as e:
        print(f"[red]Failed to launch VS Code: {e}[/red]")

@main.command("navigator-apps")
def navigator_apps():
    """Install the most popular Anaconda Navigator dashboard tools in the QuantX env."""
    import subprocess
    apps = [
        "jupyter", "jupyterlab", "spyder", "vscode", "orange3", "glueviz", "qtconsole", "anaconda-navigator"
    ]
    console.print("[bold cyan]Installing Anaconda Navigator dashboard tools...[/bold cyan]")
    result = subprocess.run(["conda", "install", "-n", "quantx", "-y"] + apps)
    if result.returncode == 0:
        console.print("[green]Navigator apps installed! Restart Anaconda Navigator to see them.[/green]")
    else:
        console.print("[red]Failed to install some dashboard tools. Try installing manually in your environment.[/red]")

if __name__ == "__main__":
    main()
