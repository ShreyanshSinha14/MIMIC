if (!window.__relayLoaded) {
  window.__relayLoaded = true;
  var st = document.createElement('style');
  st.textContent =
    '[data-relay-hl]{outline:4px solid #e11d48 !important;outline-offset:3px !important;}' +
    'html.relay-large body{zoom:1.3;}' +
    'html.relay-hc, html.relay-hc *{background:#000 !important;color:#fff !important;border-color:#fff !important;}' +
    'html.relay-hc a, html.relay-hc a *{color:#ffff00 !important;}';
  document.documentElement.appendChild(st);

  var find = function (id) { return document.querySelector('[data-relay-id="' + id + '"]'); };

  chrome.runtime.onMessage.addListener(function (msg, _sender, respond) {
    if (msg.type === 'scan') {
      respond(relayScan(document));
    } else if (msg.type === 'highlight') {
      document.querySelectorAll('[data-relay-hl]').forEach(function (e) { e.removeAttribute('data-relay-hl'); });
      var el = find(msg.id);
      if (el) { el.setAttribute('data-relay-hl', '1'); el.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
      respond({ ok: !!el });
    } else if (msg.type === 'fix') {
      // PREVIEW ONLY – changes the live page in this tab, never the real website.
      var i = msg.issue, t = find(i.id), ok = true;
      if (i.type === 'lang') document.documentElement.lang = 'en';
      else if (i.type === 'title') document.title = 'Untitled page';
      else if (i.type === 'zoom' && t) t.setAttribute('content', 'width=device-width, initial-scale=1');
      else if (!t) ok = false;
      else if (i.type === 'img-alt' || i.type === 'img-alt-bad') t.setAttribute('alt', 'Describe this image');
      else if (i.type === 'form-label' || i.type === 'name') t.setAttribute('aria-label', i.fixLabel || 'Label');
      else if (i.type === 'contrast') t.style.setProperty('color', i.fixColor, 'important');
      else ok = false;
      respond({ ok: ok });
    } else if (msg.type === 'prefs') {
      document.documentElement.classList.toggle('relay-large', !!msg.large);
      document.documentElement.classList.toggle('relay-hc', !!msg.contrast);
      respond({ ok: true });
    }
    return false;
  });
}
