document.addEventListener('DOMContentLoaded', function() {
    // Load existing rules on page load
    loadRules();

    // Scan form submission
    document.getElementById('scan-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const form = this;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.textContent : null;
        if (submitBtn) submitBtn.disabled = true;

        const formData = new FormData(this);
        const data = {
            target: formData.get('target'),
            scan_type: formData.get('scan-type')
        };

        fetch('/scan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            return response.text().then(text => {
                if (!response.ok) {
                    // Try to parse JSON error details
                    try { const json = JSON.parse(text); throw new Error((json.error || json.message || text)); } catch (e) { throw new Error(text || response.statusText); }
                }
                return text ? JSON.parse(text) : {};
            });
        })
        .then(data => {
            displayScanResults(data);
        })
        .catch(error => {
            console.error('Error:', error);
            const resultsDiv = document.getElementById('scan-results');
            resultsDiv.innerHTML = `<p class="error">Error occurred during scan: ${escapeHtml(error.message)}</p>`;
        })
        .finally(() => { if (submitBtn) { submitBtn.disabled = false; if (originalText) submitBtn.textContent = originalText; } });
    });

    // Rule form submission
    document.getElementById('rule-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const data = {
            action: formData.get('action'),
            source_ip: formData.get('source_ip'),
            destination_ip: formData.get('destination_ip'),
            port: formData.get('port'),
            protocol: formData.get('protocol'),
            priority: parseInt(formData.get('priority'))
        };

        fetch('/firewall/add_rule', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) return response.text().then(t => { throw new Error(t || response.statusText) });
            return response.json();
        })
        .then(data => {
            if (data.error) {
                alert('Error: ' + data.error);
            } else {
                alert('Rule added successfully!');
                loadRules();
                // only reset after a successful add
                if (typeof this.reset === 'function') this.reset();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error adding rule: ' + error.message);
        });
    });

    // Simulation form submission
    document.getElementById('simulate-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const data = {
            source_ip: formData.get('source_ip'),
            destination_ip: formData.get('destination_ip'),
            port: formData.get('port'),
            protocol: formData.get('protocol')
        };

        fetch('/firewall/simulate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) return response.text().then(t => { throw new Error(t || response.statusText) });
            return response.json();
        })
        .then(data => {
            displaySimulationResult(data);
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('simulation-result').innerHTML = `<p class="error">Error occurred during simulation: ${error.message}</p>`;
        });
    });
});

function loadRules() {
    fetch('/firewall/rules')
    .then(response => response.json())
    .then(data => {
        displayRules(data.rules);
    })
    .catch(error => {
        console.error('Error loading rules:', error);
    });
}

function displayScanResults(data) {
    const resultsDiv = document.getElementById('scan-results');
    if (data.error) {
        resultsDiv.innerHTML = `<p class="error">${data.error}</p>`;
        return;
    }

    let html = '<h3>Scan Results</h3><table><tr><th>Host</th><th>State</th><th>Ports</th></tr>';
    for (const [host, info] of Object.entries(data.results)) {
        let portsHtml = '<table>';
        for (const [port, portInfo] of Object.entries(info.ports)) {
            portsHtml += `<tr><td>${port}</td><td>${portInfo.state}</td><td>${portInfo.service}</td></tr>`;
        }
        portsHtml += '</table>';
        html += `<tr><td>${host}</td><td>${info.state}</td><td>${portsHtml}</td></tr>`;
    }
    html += '</table>';
    resultsDiv.innerHTML = html;
}

function displayRules(rules) {
    const rulesDiv = document.getElementById('rules-list');
    if (rules.length === 0) {
        rulesDiv.innerHTML = '<p>No rules added yet.</p>';
        return;
    }

    let html = '<table><tr><th>ID</th><th>Action</th><th>Source IP</th><th>Destination IP</th><th>Port</th><th>Protocol</th><th>Priority</th></tr>';
    rules.forEach(rule => {
        html += `<tr><td>${rule.id}</td><td>${rule.action}</td><td>${rule.source_ip}</td><td>${rule.destination_ip}</td><td>${rule.port}</td><td>${rule.protocol}</td><td>${rule.priority}</td></tr>`;
    });
    html += '</table>';
    rulesDiv.innerHTML = html;
}

function displaySimulationResult(data) {
    const resultDiv = document.getElementById('simulation-result');
    if (data.error) {
        resultDiv.innerHTML = `<p class="error">${data.error}</p>`;
        return;
    }

    let html = `<h3>Simulation Result</h3><p class="${data.result === 'allowed' ? 'success' : 'error'}">Traffic ${data.result}</p>`;
    if (data.matched_rule) {
        html += `<p>Matched Rule: ${data.matched_rule.action} from ${data.matched_rule.source_ip} to ${data.matched_rule.destination_ip} on port ${data.matched_rule.port} (${data.matched_rule.protocol})</p>`;
    } else {
        html += '<p>No matching rule found. Default deny applied.</p>';
    }
    resultDiv.innerHTML = html;
}

// small helper to escape HTML displayed from server messages
function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
}
