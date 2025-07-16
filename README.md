# 🚀 QuantX

![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC--BY--NC%204.0-lightgrey.svg)
![Platform Support](https://img.shields.io/badge/platform-macOS%20%7C%20Ubuntu%20%7C%20Windows-blue)
![Node.js](https://img.shields.io/badge/node-%3E=18.x-brightgreen)
![Python](https://img.shields.io/badge/python-3.9%2B-blue)
<!-- Uncomment once CI is enabled -->
<!-- ![Build Status](https://github.com/quantDIY/QuantX/actions/workflows/test.yml/badge.svg) -->

---

## 🛡️ License

QuantX is released under a **dual-license model**:

- **Non-Commercial License:**  
  [Creative Commons Attribution-NonCommercial 4.0 (CC BY-NC 4.0)](https://creativecommons.org/licenses/by-nc/4.0/)  
  You may use, modify, and redistribute QuantX for personal or academic, non-commercial purposes.  
  **Attribution is required.**

- **Commercial License:**  
  For use within proprietary tools, paid software, or by proprietary trading firms, a commercial license is required.  
  Please contact [QuantDIY@protonmail.com](mailto:QuantDIY@protonmail.com) for terms and integration options.

See the **LICENSE** file included in this repository for the full legal text of both license types.

---

# QuantX

QuantX is a modular, cross-platform desktop trading assistant designed for seamless integration with the [TopstepX API](https://gateway.docs.projectx.com/docs/intro/). Built by traders for traders, QuantX automates connectivity, account management, and live trading—while providing a robust foundation for custom strategies and future-proof expansion.

---

## 📢 **What’s New in v0.0.3?**

QuantX v0.0.3 is a **major architectural overhaul**:

- Electron shell for a native cross-platform GUI
- Modern frontend: React + Vite + TypeScript
- Refactored backend: Flask, Socket.IO, Redis, Node.js SignalR bridge
- Full separation of concerns:  
  - All business logic in the backend  
  - Electron is now purely for desktop presentation and IPC  
- Easy local dev workflow: all services can be built and run in parallel  
- Extensible, modular stack: perfect for both advanced users and future contributors

---

## ⚙️ **Technology Stack**

| Layer           | Technology                       | Purpose                                                        |
|-----------------|----------------------------------|----------------------------------------------------------------|
| **Frontend**    | React, Vite, TypeScript, Tailwind| Modern, high-performance UI                                    |
| **Desktop**     | Electron (TypeScript)            | Cross-platform desktop window, IPC, UI shell                   |
| **Backend**     | Python (Flask, Socket.IO)        | REST API, real-time events, strategy runner                    |
| **Data Bus**    | Redis                            | Fast pub/sub, caching, inter-process messaging                 |
| **SignalR**     | Node.js + @microsoft/signalr     | Bridge for robust SignalR connectivity (TopstepX market data)  |
| **Testing**     | Pytest, Jest                     | End-to-end tests in both Python and JS                         |
| **Styling**     | Tailwind CSS                     | Consistent, modern styles                                      |

---

## 🛠️ **Architecture Overview**

        +-------------------+
        |     Electron      |   (window, menu, IPC)
        +---------+---------+
                  |
       IPC / HTTP / Websocket
                  |
        +---------v---------+
        |    Flask API      |   (Python backend, Socket.IO)
        +---------+---------+
                  |
      +-----------+-----------+
      |                       |

+---------v--------+ +--------v---------+
| Redis |<--->| Node SignalR |
| (cache, pub/sub) | | Bridge |
+------------------+ +------------------+
(connects to TopstepX)

- **Electron** = UI only, runs locally, communicates via IPC to backend
- **Backend** = Python Flask API (handles logic, account mgmt, signals)
- **Redis** = fast caching + cross-process events
- **Node Bridge** = connects to TopstepX’s real-time SignalR feeds, feeds Python backend

---

## 🧑‍💻 **Installation & Setup**

### 1. Clone the Repository

```bash
git clone https://github.com/quantDIY/QuantX.git
cd QuantX

2. Python Environment Setup

python3 -m venv venv
source venv/bin/activate       # On Windows: venv\Scripts\activate
pip install -r requirements.txt

3. JavaScript/Node Environment Setup

npm install

4. Install & Start Redis

    Linux/macOS:

    redis-server

    Windows:
    Download and run Redis for Windows or use WSL.

5. (Optional) Node.js SignalR Bridge

If you want live TopstepX market data, run the Node.js bridge (see /node_bridge/):

cd node_bridge
npm install
node bridge.js

6. Build the Frontend

npm run build

7. Build Electron

npm run build:electron

🏁 Running QuantX Locally

You can start all services for development in parallel with:

npm run start:all

Or manually, in separate shells:

Shell 1: Start Python Backend

source venv/bin/activate   # or venv\Scripts\activate on Windows
FLASK_APP=backend/app.py FLASK_ENV=development PYTHONPATH=./backend flask run --port=5000

Shell 2: Start Redis

redis-server

Shell 3: Start Node Bridge (if using)

cd node_bridge
node bridge.js

Shell 4: Launch Electron

npm run start:electron

📝 .env File

QuantX uses a .env in the project root for sensitive info.
A sample is provided:

cp .env.example .env

The onboarding flow will auto-update this file.
📊 Running Tests

JS (Jest):

npm test

Python (Pytest):

pytest tests/python

🖥️ Supported Platforms

    macOS (Apple Silicon & Intel)

    Ubuntu Linux

    Windows 10+

📢 Changelog Since v0.0.2

    Major refactor to Electron shell—modern, native desktop feel

    New frontend: Vite + React + TypeScript

    Python backend refactored for clarity and extensibility

    Redis introduced for ultra-fast caching and event bus

    Node SignalR bridge for stable, real-time TopstepX data

    Clean build scripts and local-only, dev-friendly workflow

    Easy extension: add new routes, strategies, and UI features quickly

🚪 License Details

QuantX is dual-licensed:
Non-Commercial Use

    License: CC BY-NC 4.0

    You may use, modify, and redistribute QuantX for personal, academic, or non-commercial purposes.

    Attribution required:
    Cite "QuantX – QuantDIY" in derived works, research, or educational use.

Commercial Licensing

    Commercial/proprietary use requires a separate license.

    This includes (but is not limited to):

        Integration with paid tools

        Use by proprietary trading firms

        Monetization or redistribution in commercial software

    Contact: QuantDIY@protonmail.com for terms and pricing.

    The LICENSE file in this repo contains the full legal text for both licenses. Please read it before use.

🤝 Contributing

We love contributors!

    Fork, branch, code, PR!

    See .github/CONTRIBUTING.md for more details.

🌟 Thanks

Big shoutout to the TopstepX developer community and all testers for making QuantX better with every release!

For questions or support, open an Issue or email QuantDIY@protonmail.com
