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

QuantX is a modular cross-platform desktop trading assistant for interfacing with the TopstepX API. This release enables users to authenticate, select accounts, validate connectivity via tests, and launch the interface (UI placeholder for now—full GUI coming next release). Works on **Linux, macOS, and Windows**.

Thank you for helping test this release. Your feedback ensures a consistent user experience across all environments.

---

## ⚙️ Technologies Used

* **Electron** (Desktop Shell)
* **Vite + React** (Frontend)
* **Node via NPM** (Powers Electron and Vite tooling)
* **Flask** (Backend API bridge)
* **Python** (Strategy & Testing Layer)
* **Tailwind CSS** (Styling)
* **Pytest** (API connectivity tests)
* **TopstepX API** (Trading data and order endpoints)

---

## 🔧 Getting Started

Follow these steps to set up QuantX locally. All tools run locally—**do not install anything globally**.

### 1. Clone the Repository

```bash
git clone https://github.com/quantDIY/QuantX.git
cd QuantX
```

### 2. Set Up Python Environment

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Set Up JavaScript Environment

```bash
npm install
```

---

## 🪡 Running the App

Once setup is complete, use this command to launch all services:

```bash
npm run start:all
```

This script runs:

* Flask backend API bridge (Python)
* Vite frontend server (React)

In development mode, you may also run these manually in three separate shells:

**Shell 1: Start Flask Backend**

```bash
source venv/bin/activate  # or venv\Scripts\activate on Windows
FLASK_APP=backend/app.py FLASK_ENV=development PYTHONPATH=./backend flask run --port=5000
```

**Shell 2: Start Frontend**

```bash
npm run dev
```

**Shell 3: Launch Electron Desktop App**

```bash
npm start
```

The Electron entry point is `electron/main.js`. Frontend files are in `frontend/`.

---

## 📂 .env

QuantX uses a `.env` file in the project root. **Do not edit it manually.** The onboarding flow handles all updates automatically.

A template `.env.example` is included. Copy it to get started:

```bash
cp .env.example .env
```

---

## 📈 Running Tests

### JavaScript Tests (Jest)

```bash
npm test
```

### Python Tests (Pytest)

```bash
pytest tests/python
```

Tests are included in `tests/js/` and `tests/python/` that confirm functionality.

---

## 💻 Platforms & Testing Notes

Tested on:

* ✅ macOS (Apple Silicon)
* ✅ Ubuntu Linux
* ✅ Windows 10+

Report issues in the Issues tab.

---

## 🚪 License

QuantX uses a dual-license model:

### ✅ Non-Commercial Use

Creative Commons Attribution-NonCommercial 4.0 (CC BY-NC 4.0). You may use, modify, and redistribute for non-commercial purposes with attribution.

### 💼 Commercial Licensing

Contact us at [**QuantDIY@protonmail.com**](mailto:QuantDIY@protonmail.com) to:

* Integrate into paid tools
* Use for proprietary trading firms
* Monetize modified versions

LICENSE file is included in the repo.

---

## 🤝 Contributing

We welcome contributions of all skill levels!

Steps:

1. Fork the repo
2. Create a feature branch
3. Submit a PR with a clear explanation

See `.github/CONTRIBUTING.md` before submitting PRs.

---

## 🌟 Shoutout

Big thanks to the TopstepX developer community! Your feedback and creativity power this project.

