# quantx/cli-matrix.py
# Separate CLI for matrix build with pip-extras installer

import sys
import click
import subprocess
from rich.console import Console
from rich.prompt import Confirm, Prompt
from rich.table import Table

console = Console()

# --- Full list of Python packages to install post-conda ---
PIP_EXTRAS = [
    # Machine Learning & AI
    {"name": "TensorFlow", "pip": "tensorflow"},
    {"name": "PyTorch", "pip": "torch"},
    {"name": "Keras", "pip": "keras"},
    {"name": "scikit-learn", "pip": "scikit-learn"},
    {"name": "MLflow", "pip": "mlflow"},
    # Quant Finance & Backtesting
    {"name": "vectorbt", "pip": "vectorbt"},
    {"name": "QuantLib", "pip": "QuantLib"},
    {"name": "TA-Lib", "pip": "TA-Lib"},
    # Scientific Computing & Data Analysis
    {"name": "pandas", "pip": "pandas"},
    {"name": "numpy", "pip": "numpy"},
    {"name": "scipy", "pip": "scipy"},
    {"name": "h5py", "pip": "h5py"},
    # GPU & Performance
    {"name": "cupy", "pip": "cupy"},
    {"name": "numba", "pip": "numba"},
    # Visualization & UI
    {"name": "matplotlib", "pip": "matplotlib"},
    {"name": "plotly", "pip": "plotly"},
    {"name": "PyOpenGL", "pip": "pyopengl"},
    # Development & IDEs
    {"name": "jupyter", "pip": "jupyter"},
    {"name": "jupyterlab", "pip": "jupyterlab"},
    {"name": "spyder", "pip": "spyder"},
    {"name": "qtconsole", "pip": "qtconsole"},
    # Database & Connectivity
    {"name": "psycopg2", "pip": "psycopg2"},
    {"name": "pyzmq", "pip": "pyzmq"},
    # Other
    {"name": "gym", "pip": "gym"},
    {"name": "orange3", "pip": "orange3"},
    {"name": "glueviz", "pip": "glueviz"},
    {"name": "xlwings", "pip": "xlwings"}
]


@click.group()
def main():
    pass

@main.command()
def version():
    from quantx import __version__
    console.print(f"[bold green]QuantX Core v{__version__}[/bold green]")

@main.command()
@click.option("--all", "install_all", is_flag=True, help="Install all optional pip packages.")
@click.option("--uninstall", "uninstall_mode", is_flag=True, help="Uninstall selected/all pip extras.")
def install_py(install_all, uninstall_mode):
    """Install all the Python packages via pip after conda setup."""
    action = "uninstall" if uninstall_mode else "install"
    console.print(f"[bold cyan]Starting Python package {action}...[/bold cyan]")

    if install_all:
        selected_pkgs = PIP_EXTRAS
    else:
        table = Table(title="Available Python Packages")
        table.add_column("No.", style="cyan", width=4)
        table.add_column("Package", style="bold")
        console.print(table)
        for idx, pkg in enumerate(PIP_EXTRAS):
            table.add_row(str(idx + 1), pkg["name"])

        choices = Prompt.ask(
            f"Enter comma-separated numbers to {action} (e.g., 1,2), 'a' for all, or blank to cancel",
            default=""
        ).replace(" ", "")
        if not choices: return
        if choices.lower() == 'a':
            selected_pkgs = PIP_EXTRAS
        else:
            selected_pkgs = [PIP_EXTRAS[int(i)-1] for i in choices.split(",") if i.isdigit() and 1 <= int(i) <= len(PIP_EXTRAS)]

    for pkg in selected_pkgs:
        console.print(f"[cyan]{action.capitalize()}ing [bold]{pkg['name']}[/bold]...[/cyan]")
        result = subprocess.run([sys.executable, "-m", "pip", action, pkg["pip"]])
        if result.returncode != 0:
            console.print(f"[red]Failed to {action} {pkg['name']}.[/red]")

if __name__ == "__main__":
    main()

