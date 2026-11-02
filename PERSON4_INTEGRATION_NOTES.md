# MIMIC integration build (Person 4)

This folder contains the React dashboard, Person 2's speech/parser modules, Person 3's scanner, and the Person 4 Chrome extension foundation.

## React dashboard
```bash
npm install
npm run dev
```
Open the Vite URL printed in the terminal (normally `http://localhost:5173`).

Person 2 modules are installed at `src/engines/parser.js` and `src/engines/speech.js`.
- `VoiceInput.jsx` now calls Person 2's `startSpeechRecognition()` while preserving the existing form callback contract.
- `AnnouncementAssistant.jsx` uses both speech recognition and `parseAnnouncement()` to display an action summary.
- Recognition requires microphone permission and a supported browser. The parser is rule-based; verify important details.

Person 3's React scanner is retained in `src/mirror/mirror-scanner.js` and is imported by the existing `AccessibilityScanner.jsx`. It scans the embedded sample page in the dashboard. This is not a live scan of an arbitrary external website.

## Chrome extension
Load the `RELAY_Chrome_Extension` folder as an unpacked extension from `chrome://extensions` (Developer mode → Load unpacked). The folder name is historical; the extension is branded MIMIC.

The extension combines Person 4's reversible font/contrast/spacing controls and external dashboard message bridge with Person 3's detailed scanner. The service worker injects `scanner.js` before `content.js`.

The scan report is a heuristic report, not a certified WCAG audit. It does not fully test keyboard navigation, screen-reader behavior, ARIA correctness, video captions, iframes, or shadow DOM. Contrast checks have known limitations. Preview changes are temporary and affect only the current page.

## Dashboard ↔ extension boundary
The extension manifest allows `http://localhost/*`, `http://127.0.0.1/*`, and `https://*.vercel.app/*`. The React `WebsiteConnector` now accepts the extension ID and provides Connect, Apply dashboard settings, Scan active page, and Reset page actions. The exact production domain must be added to `externally_connectable.matches` if it is not covered by the current Vercel pattern.

Message types supported by the service worker:
- `RELAY_GET_STATE`
- `RELAY_APPLY_SETTINGS` with `settings: {fontScale, highContrast, extraSpacing}`
- `RELAY_SCAN_PAGE`
- `RELAY_RESET`

A browser popup scan uses the same scanner and report. Dashboard calls must be made from a permitted origin in Chrome and require the extension to be installed and the target website tab to be active. The extension ID is copied from `chrome://extensions`.

## Verification status
Source files have been integrated. A full Vite build and real Chrome extension/browser test still need to be run on the team's machine; dependency installation in this execution environment did not complete. Do not present this package as browser-tested.
