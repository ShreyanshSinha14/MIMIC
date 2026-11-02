# MIMIC interface refresh

## What changed
- Reordered the dashboard so the overview and AI Language Helper are prominent, followed by beginner progress, accessibility controls, personalisation, application support, and website tools.
- Rebuilt the sidebar navigation to match the new page order and added direct links to the AI Helper and website tools.
- Fixed the high-contrast stylesheet. It previously forced every element's background to transparent, which could leave white text on a light/inherited surface. High contrast now uses opaque black surfaces, white text, yellow links/buttons, visible borders, and visible focus indicators.
- Added a clearer visual introduction to the AI Helper and reduced-motion support.

## Extensions
No files inside `mimic-relay-extension/` were edited. No extension manifest, popup, scanner, or content script was changed.

## Run locally
From the folder containing `package.json`:

```bash
npm install
npm run dev
```

## Validation
A production build could not be completed in this environment because Vite dependencies were not available after the dependency-install attempt timed out. Run `npm install` locally, then `npm run build` to validate in your environment.
