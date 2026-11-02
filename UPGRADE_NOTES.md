# MIMIC Human-First Experience Upgrade

- Reimagined the mode-selection screen with larger typography, clear choices, calmer spacing, responsive cards, decorative background layers, reassurance copy, and visible focus states.
- Increased AI Language Lab typography and input sizes.
- Added same-language vocabulary explanation using a built-in practical glossary plus Dictionary API lookups for English terms.
- Expanded translation language choices to English, Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Punjabi, Kannada, Malayalam, Urdu, Spanish, French, and German. Live translation uses the existing MyMemory community endpoint when no private MIMIC backend is configured; network/service availability and quality vary.
- Added script-based language detection for several Indian scripts.
- Avoids applying English simplification substitutions to unsupported languages, preserving original text rather than corrupting it.
- No files in `mimic-relay-extension/` were intentionally edited.

## Run
From the inner `MIMIC_React_App` directory (the one containing `package.json`):

```powershell
npm.cmd install
npm.cmd run dev
```

## Validation
JavaScript service/engine files passed `node --check`. A Vite production build could not be run because Vite is not installed in the current environment. Translation and dictionary lookups require internet access; this is not an offline all-language AI model.
