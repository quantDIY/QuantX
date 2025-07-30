# matrix-build/setup-matrix.py
# Minimal setup.py for matrix testing - only core dependencies

from setuptools import setup, find_packages

setup(
    name="quantx-core",
    version="0.0.4",
    packages=find_packages(where=".."),
    package_dir={"": ".."},
    include_package_data=True,
    install_requires=[
        # Only core dependencies - pip-extras handled separately
        "click",
        "rich",
        "python-dotenv",
        "requests",
        "flask",
        "flask-socketio", 
        "flask-cors",
        "eventlet",
    ],
    entry_points={
        "console_scripts": [
            "quantx = quantx.cli_matrix:main",
        ],
    },
    author="QuantDIY",
    description="QuantX Core - Minimal build for matrix testing",
    url="https://github.com/quantDIY/QuantX",
    license="CC-BY-NC-4.0"
)
