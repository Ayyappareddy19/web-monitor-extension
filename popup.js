chrome.storage.local.get("alerts", (data) => {
  const container = document.getElementById("alerts");
  const alerts = data.alerts || [];

  if (alerts.length === 0) {
    container.textContent = "No alerts yet.";
    return;
  }

  const bellEmoji = '🔔'; // ✅ Emoji directly

  container.innerHTML = '';
  alerts.slice().reverse().forEach(alert => {
    const formattedType = alert.type.replace(/_/g, ' '); // "malicious_url_virustotal" → "malicious url virustotal"
    const div = document.createElement("div");
    div.className = "alert";
    div.innerHTML = `
      <div class="type">${bellEmoji} ${formattedType}</div>
      <div class="url">${alert.url}</div>
      <div class="time">${new Date(alert.timestamp).toLocaleString()}</div>
    `;
    container.appendChild(div);
  });
});
