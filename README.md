# MIMIC — Making the Digital World Accessible to Everyone

<p align="center">
  <strong>A human-first accessibility companion that helps people understand, navigate, and use the digital world with greater confidence.</strong>
</p>

<p align="center">
  <a href="https://mimic-accessibility.vercel.app/">Live Demo</a> ·
  <a href="https://github.com/ShreyanshSinha14/MIMIC">Source Code</a>
</p>

---

## The problem we're solving

Digital services are increasingly essential, but they are not equally easy for everyone to use. Complicated language, unfamiliar forms, small controls, inaccessible colour choices, and fear of making a costly mistake can prevent people from completing everyday online tasks.

MIMIC is built around a simple belief:

> **Technology should adapt to people — people should not have to struggle to adapt to technology.**

MIMIC brings accessibility controls, plain-language support, voice assistance, and safe interactive learning into one welcoming experience. It is designed with people with disabilities, first-time internet users, and anyone who finds digital services difficult to navigate in mind.

## What MIMIC offers

### 1. A welcoming, accessible starting experience
- Clear starting choices and plain-language guidance.
- Large, readable interface elements and spacious layouts.
- Visual accessibility preferences, including high contrast and dark/light appearance options.
- Keyboard-visible focus styles and reduced-motion support where implemented by the interface.

### 2. AI Language Helper — understand, don't just translate
The Language Helper is designed to make information easier to understand, including when the user wants to stay in the same language.

- **Simplify:** rewrite difficult English or Hindi in clearer language.
- **Translate:** translate between supported languages.
- **Explain vocabulary:** surface difficult words and provide simpler meanings.
- **Voice support:** use browser speech capabilities where available.

The project includes local simplification support, a built-in glossary, dictionary lookups, and a community translation fallback. A separately configured MIMIC backend can be used for server-side language processing.

### 3. Decision Lab
Practice recognising risky digital situations in an interactive, low-stakes environment. The simulations are intended to help users think through choices involving suspicious messages, confusing forms, and requests for sensitive information such as OTPs.

The goal is to build confidence before users encounter similar situations in real life.

### 4. Mission Rehearsal
Break an unfamiliar digital task into understandable preparation steps. Mission Rehearsal helps users think through what they need, what to check, and when to pause or seek trusted help.

### 5. Voice and accessibility assistance
MIMIC includes voice-oriented assistance and interface controls intended to make common interactions easier. Available speech features depend on the browser, device, language, and installed voices.

### 6. RELAY — MIRROR browser extension
The repository also contains a separate browser extension and page-scanning prototype. It can be loaded unpacked in a Chromium-based browser to test the sample page and inspect supported accessibility issues.

The extension is a separate component from the hosted React website; deploying the website does not install or publish the extension.

---

## Try MIMIC

**Live website:** https://mimic-accessibility.vercel.app/

**GitHub repository:** https://github.com/ShreyanshSinha14/MIMIC

The live website is a demonstration build. Some language and browser capabilities depend on internet connectivity and browser support.

## Run the web app locally

### Requirements
- Node.js (a current LTS release is recommended)
- npm

### Setup

```bash
git clone https://github.com/ShreyanshSinha14/MIMIC.git
cd MIMIC
npm install
npm run dev
```

Open the local URL printed by Vite in your terminal (usually `http://localhost:5173`).

### Production build

```bash
npm run build
npm run preview
```

The production files are generated in `dist/`.

## Optional language-service backend

The web app can use a MIMIC API backend when one is available.

Create a local `.env` file in the project root:

```env
VITE_API_URL=https://your-api.example.com
```

The service is expected to provide compatible `POST /process`, `POST /translate`, or `POST /simplify` endpoints, depending on the operation.

**Security:** Vite exposes variables prefixed with `VITE_` in the browser bundle. Never put private API keys, passwords, or server secrets in `VITE_` variables. Keep credentials on the server and have the backend make authenticated requests.

If no private backend is configured, the current implementation uses local simplification and may use community translation/dictionary services for supported operations. Those services require internet access and may have usage limits or interruptions.

## Load the RELAY — MIRROR browser extension

1. Open `chrome://extensions` in Chrome or the equivalent extensions page in a compatible Chromium browser.
2. Turn on **Developer mode**.
3. Select **Load unpacked**.
4. Choose the `mimic-relay-extension/` folder from this repository.
5. Open `mimic-relay-extension/sample-bad-page.html` in the browser.
6. Open the extension and run its page scan.

The extension is provided as a development prototype. Review its permissions and source before using it on sensitive pages. The website and extension are developed and deployed separately.

## Technology

- **React** — user interface
- **Vite** — development server and production bundling
- **Tailwind CSS** — styling integration
- **JavaScript** — application logic and language utilities
- **Browser Web APIs** — speech and other browser-native capabilities
- **Vercel** — live web-app deployment

## Accessibility and responsible use

MIMIC is an accessibility-focused prototype, not a certification that a website or workflow conforms to WCAG or any other accessibility standard. Assistive-technology support can vary across browsers and devices. We welcome testing and feedback from people with disabilities and accessibility specialists.

Please do not enter passwords, OTPs, bank details, government ID numbers, or other sensitive personal information into a demo or third-party translation service. Do not rely on a simulation as financial, legal, medical, or official government advice. Always verify important information with the relevant official service.

## Project structure

```text
MIMIC/
├── mimic-relay-extension/   # Separate browser extension prototype
├── public/                  # Static public assets
├── src/
│   ├── components/          # UI, language, voice, and learning features
│   ├── engines/             # Local language and speech utilities
│   ├── pages/               # Main application pages
│   └── services/            # Language-service integration
├── index.html
├── package.json
└── vite.config.js
```

## Roadmap

Areas for continued development include:

- More language pairs and stronger regional-language support.
- More robust plain-language explanations for complex documents.
- Expanded keyboard and screen-reader testing with disabled users.
- More realistic, user-tested Decision Lab scenarios.
- A secure, privacy-conscious backend for advanced language processing.
- Usability testing with first-time internet users and assistive-technology users.

## Contributing and feedback

MIMIC is a work in progress. Bug reports, accessibility feedback, usability observations, and thoughtful feature suggestions are welcome through GitHub Issues.

When reporting an accessibility issue, please include (if possible):
- The page or feature where it occurred.
- Browser and device details.
- The assistive technology used (if applicable).
- Steps to reproduce the issue.
- What you expected to happen and what happened instead.

## Team and acknowledgements

Built as a project focused on inclusive technology and digital confidence. Thanks to everyone who tests, shares feedback, and helps make digital experiences more accessible.

---

## License

No open-source license has currently been added to this repository. Unless and until a license is added, the source code remains protected by its default copyright; public visibility does not automatically grant permission to reuse, modify, or redistribute it.
