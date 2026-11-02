var $ = function (s) { return document.querySelector(s); };
var tabId = null, report = null;

function send(msg) { return chrome.tabs.sendMessage(tabId, msg); }
function el(tag, cls, text) {
  var e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;   // textContent only – page data is never trusted as HTML
  return e;
}

async function scan() {
  $('#status').textContent = 'Scanning…';
  try {
    var tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    tabId = tabs[0].id;
    await chrome.scripting.executeScript({ target: { tabId: tabId }, files: ['scanner.js', 'content.js'] });
    report = await send({ type: 'scan' });
    render();
  } catch (e) {
    $('#status').textContent = 'This page can\'t be scanned (browser pages like chrome:// and the Web Store are blocked). Try a normal website.';
  }
}

function render() {
  $('#status').textContent = '';
  $('#summary').hidden = false; $('#actions').hidden = false;
  var s = $('#score');
  s.textContent = report.score + ' / 100';
  s.className = 'score ' + (report.score >= 80 ? 'good' : report.score >= 50 ? 'mid' : 'bad');
  $('#counts').textContent = report.counts.error + ' errors, ' + report.counts.warning + ' warnings';
  var ul = $('#list'); ul.textContent = '';
  if (!report.issues.length) { $('#status').textContent = 'No issues found by the automated checks. 🎉 (Manual testing is still needed.)'; return; }
  report.issues.forEach(function (i) {
    var li = el('li', i.severity);
    li.appendChild(el('span', 'badge', i.severity));
    li.appendChild(el('h2', '', i.title));
    li.appendChild(el('p', '', i.message));
    li.appendChild(el('p', 'fix', 'Fix: ' + i.fix));
    li.appendChild(el('code', '', i.selector));
    var row = el('div', 'row');
    var show = el('button', '', 'Show on page');
    show.onclick = function () { send({ type: 'highlight', id: i.id }); };
    var fix = el('button', '', 'Preview fix');
    fix.onclick = async function () {
      var r = await send({ type: 'fix', issue: i });
      fix.textContent = r && r.ok ? 'Fix previewed ✓' : 'Fix manually';
    };
    row.appendChild(show); row.appendChild(fix); li.appendChild(row);
    ul.appendChild(li);
  });
}

function summaryText() {
  return 'RELAY MIRROR report for ' + report.url + ': score ' + report.score + '/100, ' +
    report.counts.error + ' errors and ' + report.counts.warning + ' warnings. ' +
    report.issues.slice(0, 5).map(function (i) { return i.title; }).join('; ') + '.';
}

$('#scan').onclick = scan;
$('#export').onclick = function () {
  var a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' }));
  a.download = 'relay-mirror-report.json'; a.click();
};
$('#copy').onclick = function () { navigator.clipboard.writeText(summaryText()); $('#copy').textContent = 'Copied ✓'; };
$('#speak').onclick = function () { speechSynthesis.cancel(); speechSynthesis.speak(new SpeechSynthesisUtterance(summaryText())); };

async function prefs() {
  if (tabId == null) {
    var tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    tabId = tabs[0].id;
    await chrome.scripting.executeScript({ target: { tabId: tabId }, files: ['scanner.js', 'content.js'] });
  }
  send({ type: 'prefs', large: $('#large').checked, contrast: $('#contrast').checked });
}
$('#large').onchange = prefs; $('#contrast').onchange = prefs;
