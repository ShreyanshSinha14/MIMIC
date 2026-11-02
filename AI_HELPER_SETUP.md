# MIMIC AI Helper upgrade

The website AI Helper now supports:

- Automatic English/Hindi input detection (Devanagari vs Latin script).
- Simplification and translation actions, with same-language / simple English / simple Hindi output choices.
- Simple, very simple, and detailed explanation levels.
- Browser/device text-to-speech with available Hindi or English voices, speed selection, pause, resume, and stop.
- Clipboard copy and an offline simplification fallback.

## Backend configuration

Set `VITE_API_URL` in the website app's environment to the base URL of your MIMIC backend, for example:

```env
VITE_API_URL=https://your-api.example.com
```

The upgraded client first calls `POST /process` with this JSON body:

```json
{
  "text": "Text supplied by the user",
  "action": "simplify",
  "source_language": "en",
  "target_language": "hi",
  "language": "hi",
  "level": "simple"
}
```

`action` is `simplify` or `translate`; languages are `en` or `hi`; `level` is `simple`, `very_simple`, or `detailed`. The endpoint should return one of `simplified_text`, `translated_text`, `result`, `text`, or `output` as a string. For compatibility, if `/process` is unavailable the client tries `POST /simplify` or `POST /translate` with the same payload.

**Important:** The offline fallback only performs basic rule-based simplification. It does not pretend to translate between languages. Real translation and context-aware explanations require the backend endpoint above. Keep API keys on the server; do not put secrets in `VITE_*` variables or browser code.

## Scope

Only the `MIMIC_React_App` website project was edited. Browser extension directories/files were not changed.
