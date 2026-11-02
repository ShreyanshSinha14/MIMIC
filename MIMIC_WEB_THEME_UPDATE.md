# MIMIC Web Dashboard – Readability & Theme Update

This update changes the React web dashboard only. The separate Chrome extension has not been modified or included in this web-only package.

## Display modes
- Clear blue light theme is the default.
- Dark mode uses deep navy surfaces, readable near-white text, and blue accents.
- High contrast overrides either theme with a black background, white text, yellow links and controls, and cyan keyboard focus outlines.
- Dark mode and high contrast are independent settings. High contrast takes visual priority while enabled; turning it off restores the selected light/dark theme.
- Both settings are saved with the existing MIMIC accessibility preferences.

## Controls
Two fixed controls are available at the lower-right of the dashboard: Dark/Light mode and High Contrast. The existing Accessibility Settings high-contrast control remains available. Reset All restores the light theme and standard contrast.

## Run
```bash
npm install
npm run dev
```

## Validation
Dashboard JSX syntax and CSS brace structure were checked. A production Vite build could not be run in this environment because dependency installation did not complete; run the commands above locally before deployment.
