# RELAY – MIRROR (Chrome extension + scanner)
Load: chrome://extensions → Developer mode → Load unpacked → select this folder.
Test: open sample-bad-page.html in Chrome, click the extension, press "Scan this page".

## For the web app (Person 4)
Copy mirror-scanner.esm.js to src/mirror/. Then:
  import { scanDocument } from './mirror/mirror-scanner';
  const report = scanDocument(iframe.contentDocument);   // scan a same-origin iframe/srcdoc
Report shape: { score, counts:{error,warning,total}, url, title, scannedAt,
  issues:[{ id, type, severity:'error'|'warning', title, message, fix, selector, snippet }] }
