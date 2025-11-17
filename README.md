#  Network Security Scanner

A lightweight Flask-based web application that provides:

✅ Network scanning using Nmap

✅ Simple firewall simulation

✅ Clean UI for entering targets

✅ JSON-based API responses for developers

This tool is built for learning, testing, and local security analysis, not for unauthorized scanning.
Use responsibly.

🚀 Features

Web-based UI (HTML + CSS + JS)

Port scanning using Python-Nmap

Firewall simulation module

Real-time scan results using Fetch API

Debug-friendly API responses (tracebacks included)

Cross-platform support (Windows/Linux)

Simple, clean project structure

📦 Project Structure
network_security_scanner/
│── app.py
│── requirements.txt
│── README.md
│── TODO.md
│── static/
│   ├── style.css
│   └── script.js
│── templates/
│   └── index.html

🛠️ Prerequisites
Windows Requirements

Python 3.10+

Nmap installed & added to PATH
→ Download: https://nmap.org/download.html

Optional (Recommended)

Use a virtual environment (venv)

🧩 Installation & Setup
1. Clone the Repository
git clone https://github.com/YOUR_USERNAME/network_security_scanner.git
cd network_security_scanner

2. Create & Activate Virtual Environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1

3. Install Dependencies
python -m pip install -r requirements.txt

▶️ Run the Application
Option 1 — Direct Python Run
python app.py

Option 2 — Using Flask (Recommended)
$env:FLASK_APP="app.py"
flask run

Linux/Mac Equivalent
export FLASK_APP=app.py
flask run

🌐 Access the Web App

Open your browser and visit:

http://127.0.0.1:5000/

🔍 API Endpoints
1. Scan Endpoint

POST /scan

Body:
{
  "target": "192.168.1.1"
}

Response Example:
{
  "status": "success",
  "result": {...},
  "traceback": null
}


If Nmap or python-nmap is missing:

{
  "status": "error",
  "message": "nmap not installed",
  "traceback": "..."
}

🧱 Firewall Simulation Module

Accessible through the same web interface

Simulates port blocking logic (UI demonstration)

Extendable using Python rules in the backend

🛠️ Troubleshooting
❗ Scan returns 500 error

Cause: Nmap or python-nmap missing
✔ Fix: Install Nmap & ensure it's in PATH

❗ Browser shows "Fetch error"

Open DevTools → Console / Network tab

Check backend console (Flask prints full traceback)

❗ app.py shows permission or port issues

Close other apps using port 5000

Run terminal as Administrator (Windows)

📸 Screenshots (Optional – Add Yours Here)
[Add UI screenshots here]

📝 TODO (From TODO.md)

Add advanced TCP/UDP scanning

Integrate firewall rule editor

Add logging system

Add scan history dashboard

Improve UI and animations

🤝 Contributing

Pull requests are welcome!

Fork the repo

Create a new branch:
git checkout -b feature-new

Commit changes

Push & submit PR


Screenshots:


<img width="742" height="380" alt="image" src="https://github.com/user-attachments/assets/83ce27c7-103a-4666-90ac-13ee66a64547" /> 
<img width="776" height="450" alt="image" src="https://github.com/user-attachments/assets/61356d95-23d1-4ed4-8b21-4833c5b8c495" />
<img width="752" height="424" alt="image" src="https://github.com/user-attachments/assets/582e4e32-feb6-40bd-8558-b59c8e65780f" />

📜 License

This project is open-source under the MIT License.
Feel free to modify and use for learning or development.


