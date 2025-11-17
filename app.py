from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import json
import logging
import traceback

# nmap is optional at import-time; if missing, we'll surface a clear error
try:
    import nmap
except Exception:
    nmap = None

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend-backend communication

logging.basicConfig(level=logging.DEBUG)

# Global list to store firewall rules
firewall_rules = []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/scan', methods=['POST'])
def scan_network():
    data = request.get_json()
    target = data.get('target')
    scan_type = data.get('scan_type', 'tcp_syn')  # Default to TCP SYN scan

    if not target:
        return jsonify({'error': 'Target IP or hostname is required'}), 400

    try:
        if nmap is None:
            # If python-nmap isn't installed, fall back to a mock response
            raise RuntimeError('python-nmap is not installed or nmap import failed. Install `python-nmap` and the Nmap binary.')
        nm = nmap.PortScanner()
        if scan_type == 'tcp_syn':
            nm.scan(target, arguments='-sS')  # SYN scan
        elif scan_type == 'udp':
            nm.scan(target, arguments='-sU')  # UDP scan
        elif scan_type == 'full_connect':
            nm.scan(target, arguments='-sT')  # Full connect scan
        else:
            return jsonify({'error': 'Invalid scan type'}), 400

        results = {}
        for host in nm.all_hosts():
            results[host] = {
                'state': nm[host].state(),
                'ports': {}
            }
            for proto in nm[host].all_protocols():
                lport = nm[host][proto].keys()
                for port in lport:
                    results[host]['ports'][port] = {
                        'state': nm[host][proto][port]['state'],
                        'service': nm[host][proto][port]['name']
                    }

        return jsonify({'results': results})
    except Exception as e:
        tb = traceback.format_exc()
        app.logger.error('Scan error:\n%s', tb)
        # If the failure is due to the Nmap binary missing, return a harmless mock result
        msg = str(e).lower()
        if 'nmap program was not found' in msg or 'python-nmap is not installed' in msg or nmap is None:
            # Provide a simulated scan result so the frontend shows output instead of silently clearing inputs
            mock_results = {
                target: {
                    'state': 'up',
                    'ports': {
                        '22': {'state': 'open', 'service': 'ssh'},
                        '80': {'state': 'open', 'service': 'http'},
                        '443': {'state': 'closed', 'service': 'https'}
                    }
                }
            }
            hint = ('Nmap binary not found on PATH. Returned a mock scan result. '
                    'To enable real scanning, install Nmap and ensure it is on PATH.')
            return jsonify({'results': mock_results, 'mock': True, 'hint': hint}), 200

        return jsonify({'error': str(e), 'traceback': tb}), 500

@app.route('/firewall/add_rule', methods=['POST'])
def add_firewall_rule():
    data = request.get_json()
    rule = {
        'id': len(firewall_rules) + 1,
        'action': data.get('action'),  # 'allow' or 'deny'
        'source_ip': data.get('source_ip'),
        'destination_ip': data.get('destination_ip'),
        'port': data.get('port'),
        'protocol': data.get('protocol'),
        'priority': int(data.get('priority', 1))  # Default priority 1
    }

    if not all([rule['action'], rule['source_ip'], rule['destination_ip'], rule['port'], rule['protocol']]):
        return jsonify({'error': 'All rule fields are required'}), 400

    firewall_rules.append(rule)
    return jsonify({'message': 'Rule added successfully', 'rule': rule})

@app.route('/firewall/rules', methods=['GET'])
def get_firewall_rules():
    return jsonify({'rules': firewall_rules})

@app.route('/firewall/simulate', methods=['POST'])
def simulate_firewall():
    data = request.get_json()
    packet = {
        'source_ip': data.get('source_ip'),
        'destination_ip': data.get('destination_ip'),
        'port': data.get('port'),
        'protocol': data.get('protocol')
    }

    if not all(packet.values()):
        return jsonify({'error': 'All packet fields are required'}), 400

    # Sort rules by priority (higher priority first)
    sorted_rules = sorted(firewall_rules, key=lambda r: int(r.get('priority', 1)), reverse=True)

    for rule in sorted_rules:
        match = True
        for key in ['source_ip', 'destination_ip', 'port', 'protocol']:
            if rule[key] != '*' and rule[key] != packet[key]:
                match = False
                break
        if match:
            result = 'allowed' if rule.get('action') == 'allow' else 'denied'
            return jsonify({'result': result, 'matched_rule': rule})

    # Default deny if no rule matches
    return jsonify({'result': 'denied', 'matched_rule': None})

if __name__ == '__main__':
    app.run(debug=True)
