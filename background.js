// ✅ Replace this with your actual VirusTotal API key
const API_KEY = "enter_your_virustotal_api_key_here";

// ✅ On extension install
chrome.runtime.onInstalled.addListener(() => {
  console.log("Web Monitor installed.");
});

// ✅ Handle alerts sent from other parts of the extension (like content.js)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "log_alert") {
    chrome.storage.local.get({ alerts: [] }, (result) => {
      const alerts = result.alerts;
      alerts.push(message.data);
      chrome.storage.local.set({ alerts });
    });
  }
});

// ✅ Real-time VirusTotal Scan When Tabs Finish Loading
chrome.tabs.onUpdated.addListener(async function handleTabUpdate(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('http')) {
    const url = tab.url;

    try {
      console.log("Scanning with VirusTotal:", url);

      // Step 1: Submit URL to VirusTotal
      const submitRes = await fetch("https://www.virustotal.com/api/v3/urls", {
        method: "POST",
        headers: {
          "x-apikey": API_KEY,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `url=${encodeURIComponent(url)}`
      });

      const submitData = await submitRes.json();
      const analysisId = submitData.data.id;

      // Step 2: Wait 2 seconds and get analysis report
      await new Promise(resolve => setTimeout(resolve, 2000));

      const resultRes = await fetch(`https://www.virustotal.com/api/v3/analyses/${analysisId}`, {
        headers: { "x-apikey": API_KEY }
      });

      const resultData = await resultRes.json();
      const stats = resultData.data.attributes.stats;

      const malicious = stats.malicious || 0;
      const suspicious = stats.suspicious || 0;

      // Step 3: If flagged, log and notify
      if (malicious > 0 || suspicious > 0) {
        const alert = {
          type: 'Malicious URL',
          url: url,
          malicious: malicious,
          suspicious: suspicious,
          timestamp: new Date().toISOString()
        };

        // Save alert
        chrome.storage.local.get({ alerts: [] }, (result) => {
          const alerts = result.alerts;
          alerts.push(alert);
          chrome.storage.local.set({ alerts });
        });

        // Notify user
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icons/icon16.png", // Make sure icon exists
          title: "⚠️ Warning",
          message: `Malicious flags detected!\n${url}`
        });

        console.log("⚠️ Detected Malicious:", alert);
      } else {
        console.log("✅ URL is clean:", url);
      }

    } catch (err) {
      console.error("❌ VirusTotal scan failed:", err);
    }
  }
});
