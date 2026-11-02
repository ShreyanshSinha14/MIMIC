/* RELAY MIRROR scanner – works in the Chrome extension AND the React web app.
   Usage: const report = relayScan(document)  (or iframe.contentDocument)  */
function relayScan(doc) {
  doc = doc || document;
  var win = doc.defaultView || window;
  var issues = [];
  var counter = 0;
  doc.querySelectorAll('[data-relay-id]').forEach(function (e) { e.removeAttribute('data-relay-id'); });

  function selectorOf(el) {
    var s = el.tagName.toLowerCase();
    if (el.id) return s + '#' + el.id;
    var c = (el.getAttribute('class') || '').trim().split(/\s+/)[0];
    return c ? s + '.' + c : s;
  }
  function add(el, type, severity, title, message, fix, extra) {
    var id = 'relay-' + (++counter);
    if (el && el.setAttribute) el.setAttribute('data-relay-id', id);
    var issue = Object.assign({
      id: id, type: type, severity: severity, title: title, message: message, fix: fix,
      selector: el ? selectorOf(el) : 'document',
      snippet: el && el.outerHTML ? el.outerHTML.slice(0, 140) : ''
    }, extra || {});
    issues.push(issue);
    return issue;
  }
  function visible(el) {
    var cs = win.getComputedStyle(el), r = el.getBoundingClientRect();
    return cs.display !== 'none' && cs.visibility !== 'hidden' && (r.width > 0 || r.height > 0);
  }
  function accName(el) {
    var al = el.getAttribute('aria-label');
    if (al && al.trim()) return al.trim();
    var lb = el.getAttribute('aria-labelledby');
    if (lb) {
      var t = lb.split(/\s+/).map(function (i) { var n = doc.getElementById(i); return n ? n.textContent : ''; }).join(' ').trim();
      if (t) return t;
    }
    var txt = (el.textContent || '').trim();
    if (txt) return txt;
    var img = el.querySelector('img[alt]');
    if (img && img.alt.trim()) return img.alt.trim();
    var st = el.querySelector('svg title');
    if (st && st.textContent.trim()) return st.textContent.trim();
    if (el.tagName === 'INPUT' && el.value) return el.value;
    return (el.getAttribute('title') || '').trim();
  }

  /* ---- colour helpers ---- */
  function parseColor(s) {
    var m = /rgba?\(([^)]+)\)/.exec(s || '');
    if (!m) return null;
    var p = m[1].split(/[,\s\/]+/).filter(Boolean).map(parseFloat);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  }
  function lin(c) { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
  function lum(c) { return 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b); }
  function ratio(a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
  function blend(t, b) { var a = t.a; return { r: t.r * a + b.r * (1 - a), g: t.g * a + b.g * (1 - a), b: t.b * a + b.b * (1 - a), a: 1 }; }
  function hex(c) { return '#' + [c.r, c.g, c.b].map(function (v) { return ('0' + Math.round(v).toString(16)).slice(-2); }).join(''); }
  function bgOf(el) {
    var layers = [], cur = el;
    while (cur && cur.nodeType === 1) {
      var cs = win.getComputedStyle(cur);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') return null; // can't judge gradients/images
      var c = parseColor(cs.backgroundColor);
      if (c && c.a > 0) { layers.push(c); if (c.a >= 1) break; }
      cur = cur.parentElement;
    }
    var base = { r: 255, g: 255, b: 255, a: 1 };
    for (var i = layers.length - 1; i >= 0; i--) base = blend(layers[i], base);
    return base;
  }

  /* ---- 1. Page-level checks ---- */
  var root = doc.documentElement;
  if (!(root.getAttribute('lang') || '').trim())
    add(root, 'lang', 'error', 'Page language not set',
      'Screen readers can\'t choose the right pronunciation without a lang attribute.',
      'Add lang="en" (or "hi") to the <html> tag.');
  if (!(doc.title || '').trim())
    add(root, 'title', 'error', 'Page has no title',
      'The <title> is the first thing a screen reader announces.',
      'Add a short, descriptive <title> inside <head>.');
  var vp = doc.querySelector('meta[name="viewport"]');
  if (vp && /user-scalable\s*=\s*(no|0)|maximum-scale\s*=\s*1(\.0)?(?![\d])/i.test(vp.content || ''))
    add(vp, 'zoom', 'error', 'Zooming is disabled',
      'People with low vision need to pinch-zoom the page.',
      'Remove user-scalable=no and maximum-scale=1 from the viewport meta tag.');

  /* ---- 2. Images ---- */
  doc.querySelectorAll('img').forEach(function (img) {
    if (!img.hasAttribute('alt')) {
      add(img, 'img-alt', 'error', 'Image has no description',
        'Blind users hear only "image" or the file name.',
        'Add alt="…describing the image…" (or alt="" if purely decorative).');
    } else if (/\.(png|jpe?g|gif|svg|webp)$/i.test(img.alt.trim()) || /^(image|photo|picture|img)\d*$/i.test(img.alt.trim())) {
      add(img, 'img-alt-bad', 'warning', 'Image description is not meaningful',
        'Alt text "' + img.alt + '" doesn\'t describe what the image shows.',
        'Replace it with a short sentence about what the image conveys.');
    }
  });

  /* ---- 3. Form fields ---- */
  doc.querySelectorAll('input, select, textarea').forEach(function (f) {
    var type = (f.getAttribute('type') || 'text').toLowerCase();
    if (['hidden', 'submit', 'button', 'reset', 'image'].indexOf(type) > -1 || !visible(f)) return;
    var hasLabel = (f.labels && Array.prototype.some.call(f.labels, function (l) { return l.textContent.trim(); })) ||
      f.getAttribute('aria-label') || f.getAttribute('aria-labelledby') || f.getAttribute('title');
    if (!hasLabel) {
      var ph = f.getAttribute('placeholder');
      add(f, 'form-label', 'error', 'Form field has no label',
        'Screen readers can\'t tell what to type here.' + (ph ? ' Placeholder "' + ph + '" disappears when typing and is not a label.' : ''),
        'Add <label for="' + (f.id || 'fieldId') + '">…</label> or an aria-label attribute.',
        { fixLabel: ph || f.name || type });
    }
  });

  /* ---- 4. Buttons & links ---- */
  doc.querySelectorAll('button, [role="button"], a[href], input[type="submit"], input[type="button"]').forEach(function (b) {
    if (!visible(b)) return;
    var name = accName(b), isLink = b.tagName === 'A';
    if (!name) {
      add(b, 'name', 'error', (isLink ? 'Link' : 'Button') + ' has no accessible name',
        'Screen readers announce just "' + (isLink ? 'link' : 'button') + '" – users can\'t tell what it does.',
        'Add visible text or aria-label="…what it does…".',
        { fixLabel: b.getAttribute('title') || (isLink ? 'Link' : 'Button') });
    } else if (isLink && /^(click here|here|read more|more|link)$/i.test(name)) {
      add(b, 'link-text', 'warning', 'Vague link text',
        '"' + name + '" means nothing out of context (screen reader users often list all links).',
        'Use descriptive text such as "Read the evacuation guide".');
    }
  });

  /* ---- 5. Headings ---- */
  var heads = Array.prototype.filter.call(doc.querySelectorAll('h1,h2,h3,h4,h5,h6'), visible);
  if (heads.length && !heads.some(function (h) { return h.tagName === 'H1'; }))
    add(heads[0], 'h1', 'warning', 'No main heading (h1)', 'Pages should have one h1 describing the page.', 'Make the main page title an <h1>.');
  var prev = 0;
  heads.forEach(function (h) {
    var lvl = +h.tagName[1];
    if (prev && lvl > prev + 1)
      add(h, 'heading-skip', 'warning', 'Heading level skipped',
        'Jumps from h' + prev + ' to h' + lvl + ', which confuses navigation by headings.',
        'Use h' + (prev + 1) + ' here, and style it with CSS instead.');
    prev = lvl;
  });

  /* ---- 6. Colour contrast (WCAG AA) ---- */
  var seen = {}, contrastCount = 0;
  var els = doc.body ? doc.body.querySelectorAll('*') : [];
  for (var i = 0; i < els.length && contrastCount < 40; i++) {
    var el = els[i];
    if (/^(SCRIPT|STYLE|NOSCRIPT|SVG|PATH)$/i.test(el.tagName)) continue;
    var hasText = Array.prototype.some.call(el.childNodes, function (nd) { return nd.nodeType === 3 && nd.textContent.trim().length > 1; });
    if (!hasText || !visible(el)) continue;
    var cs = win.getComputedStyle(el), fg = parseColor(cs.color), bg = bgOf(el);
    if (!fg || !bg) continue;
    if (fg.a < 1) fg = blend(fg, bg);
    var size = parseFloat(cs.fontSize), bold = parseInt(cs.fontWeight, 10) >= 700;
    var need = (size >= 24 || (size >= 18.66 && bold)) ? 3 : 4.5;
    var r = ratio(fg, bg);
    if (r < need) {
      var key = hex(fg) + '|' + hex(bg);
      if (seen[key]) { seen[key].count++; continue; }
      var best = ratio({ r: 0, g: 0, b: 0 }, bg) >= ratio({ r: 255, g: 255, b: 255 }, bg) ? '#000000' : '#ffffff';
      seen[key] = add(el, 'contrast', 'error', 'Low colour contrast',
        'Text ' + hex(fg) + ' on ' + hex(bg) + ' has contrast ' + r.toFixed(2) + ':1 (needs ' + need + ':1).',
        'Change the text colour to ' + best + ' or another colour with enough contrast.',
        { ratio: +r.toFixed(2), needed: need, fixColor: best, count: 1 });
      contrastCount++;
    }
  }
  Object.keys(seen).forEach(function (k) {
    if (seen[k].count > 1) seen[k].message += ' (+' + (seen[k].count - 1) + ' more elements with the same colours)';
  });

  /* ---- Report ---- */
  var errors = issues.filter(function (x) { return x.severity === 'error'; }).length;
  var warnings = issues.length - errors;
  return {
    tool: 'RELAY MIRROR', url: (win.location && win.location.href) || '', title: doc.title || '',
    scannedAt: new Date().toISOString(),
    score: Math.max(0, 100 - errors * 6 - warnings * 2),
    counts: { error: errors, warning: warnings, total: issues.length },
    issues: issues
  };
}
