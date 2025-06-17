# 🚀 QuantX
![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC--BY--NC%204.0-lightgrey.svg)
![Platform Support](https://img.shields.io/badge/platform-macOS%20%7C%20Ubuntu%20%7C%20Windows-blue)
![Node.js](https://img.shields.io/badge/node-%3E=18.x-brightgreen)
![Python](https://img.shields.io/badge/python-3.9%2B-blue)
<!-- Uncomment once CI is enabled -->
<!-- ![Build Status](https://github.com/quantDIY/QuantX/actions/workflows/test.yml/badge.svg) -->


QuantX is a modular, cross-platform desktop trading assistant designed to interface with the [TopstepX API](https://gateway.docs.projectx.com/docs/intro/). Built for traders by traders, QuantX automates the heavy lifting of connectivity, testing, and account management—providing a foundation for custom strategy deployment.

---

## 📘 Overview

QuantX is a modular cross-platform desktop trading assistant for interfacing with the TopstepX API.  
This release enables users to authenticate, select accounts, validate connectivity via tests (all API endpoints are tested), and launch (UI placeholder for now -- full GUI coming next release), working on **Linux, macOS, and Windows**.

This release is intended to help the Topstep API trading community test the app on their local machines and report any bugs. Because QuantX is platform-agnostic, your testing ensures a consistent user experience across all environments.

Once testing is complete and issues are addressed, we'll integrate the full GUI with the plug-and-play Python trading engine.

Thank you for being a part of this effort to build a free, open-source trading tool that helps everyone bring automated strategies to life quickly and efficiently.

---

## ⚙️ Technologies Used

- **Electron** (Desktop Shell)
- **Vite + React** (Frontend)
- **Node via NPM** (Powers Electron and Vite tooling)
- **Flask** (Backend API bridge)
- **Python** (Strategy & Testing Layer)
- **Tailwind CSS** (Styling)
- **Pytest** (API connectivity tests)
- **TopstepX API** (Trading data and order endpoints)

---

## 🔧 Getting Started

These instructions will help you replicate the exact development environment used to build QuantX. All tools run locally—**do not install anything globally.**

### 1. Clone the Repository

```bash
git clone https://github.com/quantDIY/QuantX.git
cd QuantX

2. Setup Python Environment

python3 -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt

3. Setup JavaScript Environment

npm install

🧪 Running the App

    ⚠️ Anyone testing on their system, please run all three development shells below in order, or you will encounter errors.

Shell 1: Start Flask Bridge

source venv/bin/activate  # (or Windows equivalent)
export FLASK_APP=backend/app.py
export FLASK_ENV=development
PYTHONPATH=./backend flask run --port=5000

Shell 2: Start Vite Frontend

npm run dev  # serves ./frontend via Vite

Shell 3: Start Electron Shell

npm start # or npm run electron (entry: electron/main.js)

The Electron entry point is located at `electron/main.js`. The frontend code resides in the `frontend/` directory.

📂 .env

This app uses an .env file located in the root directory. You do not need to create or modify this file manually. The app handles .env updates dynamically through the onboarding UI.

This file is included in the repo using placeholder credentials.
A `.env.example` file is provided in the root directory. You may copy it to `.env` to configure your local environment.

### Running Tests

After installing dependencies, you can run the Jest test suite with:

```bash
npm test
```

To run the Python test suite:

```bash
pytest tests/python
```

This repository includes a simple sample test in `tests/js/` to verify your environment is configured correctly.
💻 Platforms & Testing Notes

QuantX is actively tested on:

    ✅ macOS (Apple Silicon)

    ✅ Ubuntu Linux

    ✅ Windows 10+

Please report issues specific to your OS or environment in the Issues tab.
🪪 License

QuantX is released under a dual-license model:

    Default license: Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)

    Commercial license: Available upon request

✅ Non-Commercial Use

You may use, modify, and redistribute the source code for non-commercial purposes, provided that:

    Proper attribution is given (see CC BY-NC 4.0)

    You do not use the software in commercial projects

💼 Commercial Licensing

If you wish to use QuantX in a commercial context, including but not limited to:

    Integrating it into a paid product or service

    Using it for proprietary trading platforms

    Distributing modified versions with monetization

Please contact us to obtain a commercial license:

📫 QuantDIY@protonmail.com

A formal LICENSE file is included in the repository root containing the full CC BY-NC 4.0 text. Commercial license terms are negotiated individually.
🤝 Contributing

We welcome contributors of all experience levels!

To get started:

    Fork the repo

    Create a feature branch

    Submit a PR with clear explanation

Please read CONTRIBUTING.md before submitting PRs.
🧪 Optional: Contribution Guidelines & Templates

This repo includes:

    .github/CONTRIBUTING.md

    .github/ISSUE_TEMPLATE.md

    .github/PULL_REQUEST_TEMPLATE.md

These help standardize the process for contributors.
🌟 Shoutout

Huge thanks to the TopstepX developer community! This project would not exist without the feedback, testing, and creativity of traders building the future.
