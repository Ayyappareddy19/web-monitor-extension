document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll("form");
  forms.forEach(form => {
    const action = form.getAttribute("action");
    if (action && action.startsWith("http://")) {
      alert("⚠️ Insecure form detected (non-HTTPS).");
    }
  });
});
function logAlert(alert) {
  chrome.runtime.sendMessage({ action: "log_alert", data: alert });
}

document.querySelectorAll('form').forEach(form => {
  if (form.action.startsWith('http://')) {
    const alert = {
      type: 'insecure_form',
      url: window.location.href,
      timestamp: new Date().toISOString()
    };
    logAlert(alert);
    alert("⚠️ Warning: This form is not secure!");
  }
});
