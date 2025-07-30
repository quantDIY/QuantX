# matrix-setup.py
# Minimal setup.py for matrix conda builds - only core CLI dependencies

from setuptools import setup, find_packages

setup(
    name="quantx",
    version="0.0.4",
    packages=find_packages(),
    include_package_data=True,
    install_requires=[
        # Core CLI dependencies only - everything else via conda or pip-extras
        "click",
        "rich", 
        "python-dotenv",
        "requests",
        "flask",
        "flask-cors", 
        "flask-socketio",
        "eventlet",
        # Note: All scientific/ML packages are provided by conda recipe
        # Users install additional packages via 'quantx pip-extras'
    ],
    entry_points={
        "console_scripts": [
            "quantx = quantx.matrix-cli:main",
        ],
    },
    author="QuantDIY",
    description="QuantX Core - Minimal build for matrix testing",
    url="https://github.com/quantDIY/QuantX",
    license="CC-BY-NC-4.0"
)
