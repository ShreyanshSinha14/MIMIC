# MIMIC Web Anime Theme Update

The web dashboard now uses the same neon anime-inspired visual direction as the Chrome extension:
- Deep navy / midnight gradient surfaces
- Cyan, violet and magenta accent lighting
- Subtle animated starfield and grid texture
- Glass-like header and navigation styling
- Neon hover and focus states
- Polished dashboard panels, hero banner, form controls and buttons
- Responsive layout styling

The existing React components and application logic were left unchanged. The high-contrast mode rules remain separate and take priority over the decorative theme. Reduced-motion preferences are respected.

Run from `MIMIC_React_App`:

```bash
npm install
npm run dev
```

The Chrome extension remains in `MIMIC_Chrome_Extension`; its anime theme and functionality are included unchanged from the previous package.
