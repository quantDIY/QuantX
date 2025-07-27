# setup.py

from setuptools import setup, find_packages

setup(
    name="quantx",
    version="0.0.4",
    packages=find_packages(),
    include_package_data=True,
    install_requires=[
        "click",
        "cupy",
        "eventlet",
        "flask",
        "flask-cors",
        "flask-socketio",
        "gym",
        "h5py",
        "jupyter",
        "keras",
        "matplotlib",
        "mlflow",
        "notebook",
        "numba",
        "numpy",
        "pandas",
        "plotly",
        "psycopg2",
        "pyopengl",
        "python-ta-lib",    # conda-forge: python-ta-lib
        "pyzmq",
        "QuantLib",         # conda-forge: QuantLib
        "pytorch",
        "redis",
        "rich",
        "scikit-learn",
        "scipy",
        "statsmodels",
        "tensorflow",
        "vectorbt",
        "xlwings"
        # Do not include pip-only packages here!
    ],
    entry_points={
        "console_scripts": [
            "quantx = quantx.cli:main",
        ],
    },
    author="QuantDIY",
    description="QuantX - Open Source Software for the DIY Quant Revolution",
    url="https://github.com/quantDIY/QuantX",
    license="CC-BY-NC-4.0"
)
