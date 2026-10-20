# 🛡️ Web Monitor

A lightweight browser security extension built with **JavaScript, HTML, CSS, and Chrome Extension Manifest V3**.

Web Monitor monitors web pages for selected security issues, checks loaded HTTP(S) URLs against **VirusTotal**, records security alerts locally, and displays detected alerts in the extension popup.

> **Project status:** Educational / portfolio project

## 🚀 Features

### 🔍 VirusTotal URL Scanning

When an HTTP/HTTPS tab finishes loading, the background service worker submits the URL to VirusTotal and retrieves the analysis statistics.

The extension checks the returned:

- `malicious` detections
- `suspicious` detections

If either value is greater than zero, Web Monitor creates a security alert and displays a browser notification.

### 🔒 Insecure Form Detection

The content script checks forms on web pages for `http://` actions.

If an insecure form is detected, the extension:

- Displays a warning to the user
- Creates an `insecure_form` alert
- Sends the alert to the background service worker
- Stores the alert in `chrome.storage.local`

### 🔔 Alert Storage

Security alerts are stored locally using Chrome's storage API.

The popup reads the stored alerts and displays them with:

- Alert type
- URL
- Timestamp

The most recent alerts are displayed first.

### 🖥️ Security Monitor Popup

The extension provides a simple popup dashboard showing the current alert history and an **Active** status indicator.

## 🧩 Architecture

```text
                         ┌──────────────────────┐
                         │      Web Browser     │
                         └──────────┬───────────┘
                                    │
                     ┌──────────────┴──────────────┐
                     │                             │
                     ▼                             ▼
              ┌─────────────┐              ┌──────────────┐
              │ content.js  │              │ background.js│
              │             │              │              │
              │ Detects     │              │ VirusTotal   │
              │ insecure    │              │ URL scanning │
              │ forms       │              │              │
              └──────┬──────┘              │ Alert logic  │
                     │                     │ Notifications │
                     │                     └──────┬───────┘
                     │                            │
                     ▼                            ▼
              ┌────────────────────────────────────────┐
              │          chrome.storage.local          │
              │              Alert history             │
              └───────────────────┬────────────────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │    popup.html    │
                         │    popup.js      │
                         │    popup.css     │
                         └──────────────────┘
```

## 📁 Project Structure

```text
web-monitor-extension/
│
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
│
├── background.js
│   └── Background service worker
│       ├── Extension installation handling
│       ├── Message handling
│       ├── VirusTotal URL scanning
│       ├── Alert storage
│       └── Browser notifications
│
├── content.js
│   └── Web-page security checks
│       └── Insecure HTTP form detection
│
├── manifest.json
│   └── Manifest V3 configuration and permissions
│
├── popup.html
│   └── Security Monitor popup interface
│
├── popup.css
│   └── Popup styling
│
├── popup.js
│   └── Reads and displays stored alerts
│
├── .gitignore
│   └── Files excluded from Git
│
└── README.md
    └── Project documentation
```

## ⚙️ Technologies

- **JavaScript**
- **HTML5**
- **CSS3**
- **Chrome Extension Manifest V3**
- **Chrome Extension APIs**
- **VirusTotal API**
- **Git**
- **GitHub**

## 🔄 How It Works

### 1. Page monitoring

The extension's content script runs on pages matched by the extension configuration.

It examines HTML forms and identifies forms whose action uses plain HTTP rather than HTTPS.

### 2. URL scanning

When a supported tab finishes loading, the background service worker sends the URL to VirusTotal for analysis.

```text
Browser tab
    │
    ▼
background.js
    │
    ▼
VirusTotal URL API
    │
    ▼
Analysis result
    │
    ├── malicious > 0
    │
    └── suspicious > 0
          │
          ▼
      Security Alert
          │
          ├── Local storage
          │
          └── Browser notification
```

### 3. Alert collection

Alerts are stored in:

```javascript
chrome.storage.local
```

The background service worker also receives alert messages from the content script.

### 4. Popup dashboard

`popup.js` reads the saved alerts and renders them in the popup. Alerts are shown newest-first, with their type, URL, and timestamp.

## 🛠️ Installation

### Prerequisites

- Google Chrome or another compatible Chromium-based browser
- A VirusTotal API key for URL scanning
- Git (optional, for development)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/web-monitor-extension.git
cd web-monitor-extension
```

Replace `YOUR-USERNAME` with your GitHub username.

### 2. Configure the VirusTotal API key

The current prototype uses an API key in `background.js`.

**Do not commit a real API key to a public GitHub repository.**

For example, do not leave:

```javascript
const API_KEY = "YOUR_REAL_API_KEY";
```

in a public repository.

For a production-quality version, move secret handling to a secure backend or redesign the architecture so a long-lived private API key is not exposed in a distributed browser extension.

### 3. Load the extension

In Chrome:

```text
chrome://extensions/
```

Then:

1. Enable **Developer mode**.
2. Select **Load unpacked**.
3. Choose the `web-monitor-extension` folder.
4. Pin Web Monitor to the browser toolbar.

## 🧪 Testing

C:\Users\Dell\OneDrive\Desktop\web_monitor>git push
To https://github.com/Ayyappareddy19/web-monitor-extension.git
 ! [rejected]        main -> main (fetch first)
error: failed to push some refs to 'https://github.com/Ayyappareddy19/web-monitor-extension.git'
hint: Updates were rejected because the remote contains work that you do not
hint: have locally. This is usually caused by another repository pushing to
hint: the same ref. If you want to integrate the remote changes, use
hint: 'git pull' before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.

## 🔐 Security Considerations

This is a cybersecurity learning project, so secure development practices are important.

### API key protection

The current prototype expects a VirusTotal API key in the extension's background code. **Do not publish a real key in GitHub.**

If a real API key was ever committed to a public repository, revoke/rotate it immediately.

### Browser permissions

The current Manifest V3 configuration requests broad permissions, including:

- `storage`
- `activeTab`
- `scripting`
- `webRequest`
- `notifications`
- `webNavigation`

and `<all_urls>` host access.

These permissions should be reviewed and minimized as the project matures.

### Data handling

The project stores generated alerts locally through `chrome.storage.local`.

Avoid collecting or storing unnecessary browsing information.

### Detection limitations

A VirusTotal result is a security signal, not absolute proof that a URL is malicious or safe. Detection results can change over time and different security engines may disagree.

## 📌 Current Detection Coverage

| Detection | Implemented |
|---|---|
| VirusTotal URL analysis | ✅ |
| Malicious URL alert | ✅ |
| Suspicious URL alert | ✅ |
| Insecure HTTP form detection | ✅ |
| Local alert storage | ✅ |
| Browser notification | ✅ |
| Popup alert history | ✅ |
| Brute-force detection | ❌ Not implemented in current code |
| Network security monitoring | ❌ Not implemented in current code |

This table intentionally reflects the functionality present in the current prototype rather than planned features.

## 🔮 Future Improvements

Potential improvements for future versions:

- Move VirusTotal API access behind a secure backend
- Add configurable monitoring rules
- Improve URL reputation analysis
- Add more web-security detections
- Add alert severity levels
- Add alert filtering and search
- Add alert deletion/clearing
- Improve popup dashboard UI
- Add security event statistics
- Add automated testing
- Reduce unnecessary browser permissions
- Add better error handling for VirusTotal API responses
- Add rate-limit handling and caching
- Support additional Chromium-based browsers

## 📚 Learning Outcomes

This project provides hands-on experience with:

- Browser extension architecture
- Manifest V3
- Service workers
- Content scripts
- Browser APIs
- Chrome storage
- Browser notifications
- Web-page DOM inspection
- HTTP vs HTTPS security concepts
- Threat-intelligence API integration
- Security alert generation
- Git and GitHub
- Secure handling of API credentials

## 👨‍💻 Author

**Ayyappa Reddy**

B.Tech — Computer Science and Engineering (Cyber Security)

GitHub: `https://github.com/YOUR-USERNAME`

---

⭐ If you find this project useful, consider starring the repository.
