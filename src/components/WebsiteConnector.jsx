import { useState } from "react";

export default function WebsiteConnector({
  mode, fontSize = 18, highContrast = false, increasedSpacing = false
}) {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [extensionId, setExtensionId] = useState("");
  const [message, setMessage] = useState("");
  const [validUrl, setValidUrl] = useState(false);
  const [checkedUrl, setCheckedUrl] = useState("");
  const [report, setReport] = useState(null);
  const [busy, setBusy] = useState(false);

  function handleConnect(e) {
    e.preventDefault();
    try {
      const parsedUrl = new URL(websiteUrl.trim());
      if (!["http:", "https:"].includes(parsedUrl.protocol) || !parsedUrl.hostname.includes(".")) {
        throw new Error("Invalid website");
      }
      setValidUrl(true);
      setCheckedUrl(parsedUrl.href);
      setMessage("URL format verified. Open this website in a Chrome tab, then connect the MIMIC extension below.");
    } catch {
      setValidUrl(false);
      setCheckedUrl("");
      setMessage("Please enter a valid website URL.");
    }
  }

  async function sendExtension(type, extra = {}) {
    if (!extensionId.trim()) {
      setMessage("Enter the extension ID shown on chrome://extensions.");
      return null;
    }
    if (!window.chrome?.runtime?.sendMessage) {
      setMessage("Open this dashboard in Chrome. External extension messaging is not available in this browser.");
      return null;
    }
    setBusy(true);
    try {
      const response = await window.chrome.runtime.sendMessage(extensionId.trim(), {
        type, version: 1, ...extra
      });
      if (!response?.ok) throw new Error(response?.error || "Extension did not respond.");
      setMessage("MIMIC extension connected to the active Chrome tab.");
      return response.result;
    } catch (error) {
      setMessage(error?.message || "Could not contact the extension. Check its ID, installation and allowed dashboard origin.");
      return null;
    } finally {
      setBusy(false);
    }
  }

  async function applySettings() {
    const result = await sendExtension("RELAY_APPLY_SETTINGS", {
      settings: {
        fontScale: Math.max(1, Math.min(1.3, Number(fontSize) / 18)),
        highContrast: !!highContrast,
        extraSpacing: !!increasedSpacing
      }
    });
    if (result) setMessage("Dashboard accessibility settings applied to the active webpage.");
  }

  async function scanPage() {
    const result = await sendExtension("RELAY_SCAN_PAGE");
    if (result?.report) setReport(result.report);
  }

  async function resetPage() {
    const result = await sendExtension("RELAY_RESET");
    if (result) {
      setReport(null);
      setMessage("MIMIC adaptations reset on the active webpage.");
    }
  }

  return (
    <section className="w-full bg-white text-gray-900 p-5 sm:p-7 md:p-8 rounded-2xl shadow-lg space-y-6">
      <div>
        <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">MIMIC Universal Access</p>
        <h2 className="text-2xl sm:text-3xl font-bold mt-2">Adapt Any Website</h2>
        <p className="text-gray-500 mt-2">Connect the dashboard to the MIMIC Chrome extension to scan and adapt the active webpage.</p>
      </div>

      <form onSubmit={handleConnect} className="space-y-4">
        <label htmlFor="website-url" className="block font-semibold">Website URL (reference)</label>
        <input id="website-url" type="url" value={websiteUrl}
          onChange={e => { setWebsiteUrl(e.target.value); setMessage(""); setValidUrl(false); setCheckedUrl(""); }}
          placeholder="https://example.com" required
          className="w-full min-w-0 border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-blue-500" />
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-4 rounded-xl">
          Verify Website URL
        </button>
      </form>

      {validUrl && (
        <div className="bg-gray-50 border rounded-xl p-4">
          <p className="font-semibold text-sm">Verified URL format</p>
          <p className="text-blue-700 text-sm break-all">{checkedUrl}</p>
          <p className="text-xs text-gray-500 mt-1">Open this URL in a Chrome tab before using Scan or Apply.</p>
        </div>
      )}

      <div className="border-t pt-5 space-y-3">
        <h3 className="font-bold text-lg">Chrome Extension Connection</h3>
        <label htmlFor="mimic-extension-id" className="block text-sm font-medium">MIMIC extension ID</label>
        <input id="mimic-extension-id" value={extensionId} onChange={e => setExtensionId(e.target.value)}
          placeholder="Paste the ID from chrome://extensions"
          className="w-full border border-gray-300 rounded-xl p-3" />
        <p className="text-xs text-gray-500">Load the unpacked MIMIC extension in Chrome and copy its ID from the extension details.</p>
        <div className="flex flex-wrap gap-3">
          <button type="button" disabled={busy} onClick={() => sendExtension("RELAY_GET_STATE")}
            className="bg-indigo-600 text-white px-4 py-3 rounded-xl disabled:opacity-50">Connect</button>
          <button type="button" disabled={busy} onClick={applySettings}
            className="bg-blue-600 text-white px-4 py-3 rounded-xl disabled:opacity-50">Apply dashboard settings</button>
          <button type="button" disabled={busy} onClick={scanPage}
            className="bg-purple-600 text-white px-4 py-3 rounded-xl disabled:opacity-50">Scan active page</button>
          <button type="button" disabled={busy} onClick={resetPage}
            className="bg-gray-200 text-gray-900 px-4 py-3 rounded-xl disabled:opacity-50">Reset page</button>
        </div>
      </div>

      {message && <p role="status" aria-live="polite" className="rounded-xl bg-blue-50 text-blue-900 p-3 text-sm">{message}</p>}

      {report && (
        <section className="border rounded-xl p-4 space-y-3" aria-live="polite">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-bold">Active webpage scan report</h3>
            <span className="font-bold">{report.score}/100</span>
          </div>
          <p className="text-sm text-gray-600 break-all">{report.title || report.url}</p>
          <p className="text-sm">{report.counts?.error ?? 0} errors · {report.counts?.warning ?? 0} warnings · {report.counts?.total ?? 0} total</p>
          {report.issues?.length ? report.issues.slice(0, 15).map(issue => (
            <article key={issue.id} className="border-t pt-3">
              <p className="font-semibold">{issue.title}</p>
              <p className="text-sm text-gray-700">{issue.message}</p>
              <p className="text-sm text-blue-800 mt-1">Suggested fix: {issue.fix}</p>
            </article>
          )) : <p className="text-sm text-green-700">No issues found by these automated checks.</p>}
          <p className="text-xs text-gray-500">Automated heuristic checks only; this is not a complete WCAG audit.</p>
        </section>
      )}

      <div className="bg-indigo-50 p-5 rounded-xl space-y-1">
        <h3 className="font-bold text-indigo-900">Current dashboard settings</h3>
        <p className="text-indigo-800 text-sm">Mode: {mode || "Standard"}</p>
        <p className="text-indigo-800 text-sm">Font size: {fontSize}px</p>
        <p className="text-indigo-800 text-sm">High contrast: {highContrast ? "On" : "Off"}</p>
        <p className="text-indigo-800 text-sm">Increased spacing: {increasedSpacing ? "On" : "Off"}</p>
      </div>
    </section>
  );
}
