# MIMIC update – Decision Lab

## Changes
- Removed the PM Vidya Lakshmi personal-information form from the dashboard and removed its component.
- Removed Beginner Mode from the experience selector, dashboard progress panel, beginner guide navigation, and navbar label. The accessibility tools remain available to everyone.
- Added Decision Lab: three interactive, consequence-based simulations covering urgent scam messages, confusing form fields, and OTP requests. Users can explore choices and receive immediate safety coaching. It does not connect to real accounts or websites.
- Fixed the AI Language Helper's missing-backend translation path: it now tries a no-key community translation service (MyMemory) if the configured MIMIC backend is unavailable. Offline simplification remains local. The UI warns users that text may be sent to an external service, so sensitive information should not be pasted.
- Kept the browser extension directory untouched.

## Translation notes
For production or sensitive use, configure a private MIMIC translation backend using `VITE_API_URL` with `/process` or `/translate`. The public fallback depends on internet access, provider availability, language-pair coverage, and request limits; it is not a guaranteed or confidential translation channel.

## Run
From the folder containing `package.json`:

```powershell
npm.cmd install
npm.cmd run dev
```

Open the local URL printed by Vite.

A production build was not verified in this environment because dependencies are not installed here.
