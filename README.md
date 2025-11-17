<<<<<<< HEAD
# Network Security Scanner

This is a small Flask web app that provides a network scanner UI and a simple firewall simulator.

Prerequisites (Windows):

- Python 3.10+ installed and on PATH
- Nmap installed (the nmap binary) and available on PATH: https://nmap.org/download.html
- Recommended: create and use a virtual environment

Setup (PowerShell):

```powershell
Set-Location -Path 'C:\Users\Faizy\Desktop\network_security_scanner'
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

Run (PowerShell):

```powershell
Set-Location -Path 'C:\Users\Faizy\Desktop\network_security_scanner'
python app.py
# or (preferable) FLASK_APP=app.py flask run
```

Notes:
- If the scan endpoint returns a 500 with a message that python-nmap or nmap is missing, ensure both the package and the Nmap binary are installed.
- Use the browser DevTools Console/Network tab to inspect any fetch errors.

If you'd like, I can run the setup steps and start the server for you now.
# Network Security Scanner

This project is a small Flask web app that provides a network scanner and a firewall simulation UI.

Prerequisites (Windows):

- Python 3.8+ installed and on PATH
- Nmap binary installed (download from https://nmap.org/download.html) and added to PATH

Python dependencies:

Install dependencies in PowerShell:

```powershell
Set-Location -Path 'C:\Users\Faizy\Desktop\network_security_scanner'
python -m pip install -r requirements.txt
```

Run the app (PowerShell):

```powershell
Set-Location -Path 'C:\Users\Faizy\Desktop\network_security_scanner'
python -u app.py
```

Notes:
- The scanner uses the system `nmap` binary via the `python-nmap` package. If `nmap` is not installed or not on PATH, the `/scan` endpoint will return an error explaining the issue.
- If you see 500 errors from `/scan`, check the terminal where `app.py` is running — the server now returns a `traceback` field in JSON to help debugging.
=======
# Network-Security-Scanner
>>>>>>> 04924727d6ff606ab9a7c0c003558fad9c537f11
