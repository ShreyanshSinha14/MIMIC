import { useEffect, useMemo, useRef, useState } from "react";

const LANGUAGES = [
  ["auto", "Original page language"], ["en", "English"], ["hi", "Hindi"], ["bho", "Bhojpuri (भोजपुरी)"],
  ["bn", "Bengali"], ["ur", "Urdu"], ["ta", "Tamil"], ["te", "Telugu"], ["mr", "Marathi"],
  ["gu", "Gujarati"], ["pa", "Punjabi"], ["kn", "Kannada"], ["ml", "Malayalam"], ["or", "Odia"],
  ["as", "Assamese"], ["ne", "Nepali"], ["es", "Spanish"], ["fr", "French"], ["de", "German"],
  ["it", "Italian"], ["pt", "Portuguese"], ["ar", "Arabic"], ["zh-CN", "Chinese (Simplified)"],
  ["ja", "Japanese"], ["ko", "Korean"], ["ru", "Russian"], ["id", "Indonesian"], ["tr", "Turkish"],
  ["vi", "Vietnamese"], ["nl", "Dutch"], ["th", "Thai"], ["sw", "Swahili"]
];

const STYLE_PRESETS = {
  clear: { label: "Clear & natural", rate: 0.94, pitch: 1 },
  calm: { label: "Calm", rate: 0.88, pitch: 0.96 },
  slow: { label: "Slow & extra clear", rate: 0.8, pitch: 1 },
  bright: { label: "Bright", rate: 0.98, pitch: 1.05 }
};

const SAMPLE_TEXT = {
  en: "Hello. This is the MIMIC reading assistant. I will read this page clearly and at a comfortable pace.",
  hi: "नमस्ते। मैं मिमिक रीडिंग असिस्टेंट हूँ। मैं आपके लिए इस पेज को साफ़ और आराम से पढ़ूँगा।",
  bho: "प्रणाम! हम मिमिक रीडिंग असिस्टेंट बानी। हम रउआ खातिर ई पन्ना पढ़ के सुनाइब।",
  bn: "নমস্কার। আমি মিমিক রিডিং অ্যাসিস্ট্যান্ট। আমি পরিষ্কারভাবে এই পৃষ্ঠাটি পড়ে শোনাব।",
  ta: "வணக்கம். நான் மிமிக் வாசிப்பு உதவியாளர். இந்தப் பக்கத்தை தெளிவாக வாசித்துக் காட்டுவேன்.",
  te: "నమస్కారం. నేను మిమిక్ రీడింగ్ అసిస్టెంట్‌ను. ఈ పేజీని స్పష్టంగా చదివి వినిపిస్తాను.",
  mr: "नमस्कार. मी मिमिक रीडिंग असिस्टंट आहे. मी हे पान स्पष्टपणे वाचून दाखवेन.",
  gu: "નમસ્તે. હું મિમિક રીડિંગ આસિસ્ટન્ટ છું. હું આ પાનું સ્પષ્ટ રીતે વાંચી સંભળાવીશ."
};

function splitIntoChunks(text, maxLength = 1200) {
  const sentences = text.match(/[^.!?।॥。！？]+[.!?।॥。！？]*/g) || [text];
  const chunks = [];
  let current = "";
  for (const sentence of sentences) {
    const part = sentence.trim();
    if (!part) continue;
    if (current && (current + " " + part).length > maxLength) {
      chunks.push(current);
      current = "";
    }
    if (part.length > maxLength) {
      for (let i = 0; i < part.length; i += maxLength) chunks.push(part.slice(i, i + maxLength));
    } else current = current ? `${current} ${part}` : part;
  }
  if (current) chunks.push(current);
  return chunks;
}

async function translateText(text, targetLanguage) {
  const chunks = splitIntoChunks(text, 1400);
  const translated = [];
  for (const chunk of chunks) {
    const url = new URL("https://translate.googleapis.com/translate_a/single");
    url.searchParams.set("client", "gtx");
    url.searchParams.set("sl", "auto");
    url.searchParams.set("tl", targetLanguage);
    url.searchParams.set("dt", "t");
    url.searchParams.set("q", chunk);
    const response = await fetch(url.toString(), { credentials: "omit" });
    if (!response.ok) throw new Error("Translation service is unavailable. Try the original page language or try again later.");
    const payload = await response.json();
    const output = (payload?.[0] || []).map((part) => part?.[0] || "").join("").trim();
    if (!output) throw new Error("The selected language could not be translated.");
    translated.push(output);
  }
  return translated.join(" ");
}

export default function VoiceAssistant({ mode }) {
  const [targetLanguage, setTargetLanguage] = useState(mode === "hindi" ? "hi" : "auto");
  const [voices, setVoices] = useState([]);
  const [voiceURI, setVoiceURI] = useState("");
  const [style, setStyle] = useState("clear");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [status, setStatus] = useState("Loading available voices…");
  const sessionRef = useRef(0);

  useEffect(() => {
    if (!("speechSynthesis" in window)) {
      setStatus("Speech playback is not supported in this browser.");
      return undefined;
    }
    const update = () => {
      const available = window.speechSynthesis.getVoices() || [];
      setVoices(available);
      setStatus(available.length ? `${available.length} browser voice(s) available. Preview before reading.` : "No browser voices have loaded yet. The browser default voice may still be available.");
    };
    update();
    window.speechSynthesis.addEventListener?.("voiceschanged", update);
    window.speechSynthesis.onvoiceschanged = update;
    return () => {
      window.speechSynthesis.removeEventListener?.("voiceschanged", update);
      window.speechSynthesis.cancel();
    };
  }, []);

  const pageLanguage = document.documentElement.lang || navigator.language || "en-US";
  const ttsLanguage = targetLanguage === "auto" ? pageLanguage : targetLanguage;
  const matchingVoices = useMemo(() => {
    const prefix = ttsLanguage.toLowerCase().split("-")[0];
    let matches = voices.filter((voice) => (voice.lang || "").toLowerCase().startsWith(prefix));
    if (!matches.length && prefix === "bho") matches = voices.filter((voice) => (voice.lang || "").toLowerCase().startsWith("hi"));
    return matches;
  }, [voices, ttsLanguage]);

  const selectedVoice = matchingVoices.find((voice) => voice.voiceURI === voiceURI) || matchingVoices[0] || null;
  const hasNativeLanguageVoice = voices.some((voice) => (voice.lang || "").toLowerCase().startsWith(ttsLanguage.toLowerCase().split("-")[0]));
  const bhojpuriFallback = ttsLanguage === "bho" && !hasNativeLanguageVoice && !!selectedVoice;

  useEffect(() => {
    if (selectedVoice && !matchingVoices.some((voice) => voice.voiceURI === voiceURI)) setVoiceURI(selectedVoice.voiceURI);
    if (!selectedVoice) setVoiceURI("");
  }, [selectedVoice, matchingVoices, voiceURI]);

  function stopReading() {
    sessionRef.current += 1;
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setStatus("Reading stopped.");
  }

  async function speakChunks(text, token, preview = false) {
    const chunks = splitIntoChunks(text);
    const preset = STYLE_PRESETS[style] || STYLE_PRESETS.clear;
    for (const chunk of chunks) {
      if (token !== sessionRef.current) return;
      await new Promise((resolve, reject) => {
        const utterance = new SpeechSynthesisUtterance(chunk);
        utterance.lang = selectedVoice?.lang || (ttsLanguage === "bho" ? "hi-IN" : ttsLanguage);
        utterance.rate = preset.rate;
        utterance.pitch = preset.pitch;
        utterance.volume = 1;
        if (selectedVoice) utterance.voice = selectedVoice;
        utterance.onend = resolve;
        utterance.onerror = (event) => {
          if (event.error === "canceled" || event.error === "interrupted") resolve();
          else reject(new Error(`Speech playback failed: ${event.error || "unknown voice error"}. Try another installed voice.`));
        };
        window.speechSynthesis.speak(utterance);
      });
    }
    if (token === sessionRef.current) {
      setIsSpeaking(false);
      setStatus(preview ? "Voice preview finished." : "Finished reading the page.");
    }
  }

  async function readPage() {
    if (!("speechSynthesis" in window)) {
      setStatus("Read aloud is not supported in this browser.");
      return;
    }
    const page = document.getElementById("page-content") || document.querySelector("main") || document.body;
    const pageText = (page?.innerText || "").trim();
    if (!pageText) {
      setStatus("No readable text was found on this page.");
      return;
    }
    stopReading();
    const token = sessionRef.current;
    setIsSpeaking(true);
    setStatus(targetLanguage === "auto" ? "Preparing page text…" : "Translating page text…");
    try {
      const declaredPageLanguage = document.documentElement.lang || "";
      const sameDeclaredLanguage = declaredPageLanguage && declaredPageLanguage.toLowerCase().split("-")[0] === targetLanguage.toLowerCase().split("-")[0];
      const speechText = targetLanguage === "auto" || sameDeclaredLanguage ? pageText : await translateText(pageText, targetLanguage);
      if (token !== sessionRef.current) return;
      setStatus(`Reading in ${LANGUAGES.find(([code]) => code === targetLanguage)?.[1] || targetLanguage}…`);
      await speakChunks(speechText, token);
    } catch (error) {
      if (token === sessionRef.current) {
        setIsSpeaking(false);
        setStatus(error.message || "Could not read this page.");
      }
    }
  }

  async function previewVoice() {
    stopReading();
    const token = sessionRef.current;
    setIsSpeaking(true);
    setStatus("Playing voice preview…");
    const languageCode = targetLanguage === "auto" ? pageLanguage.split("-")[0] : targetLanguage;
    let sample = SAMPLE_TEXT[languageCode];
    try {
      if (!sample) sample = languageCode === "en" ? SAMPLE_TEXT.en : await translateText(SAMPLE_TEXT.en, languageCode);
      if (token !== sessionRef.current) return;
      await speakChunks(sample, token, true);
    } catch (error) {
      if (token === sessionRef.current) {
        setIsSpeaking(false);
        setStatus(error.message);
      }
    }
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="mb-2 text-xl font-bold">MIMIC Voice Assistant</h2>
      <p className="mb-4 text-sm text-gray-600">Choose the language and an installed voice. Preview it before reading.</p>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-semibold text-gray-700">
          Listen in
          <select className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2 text-sm" value={targetLanguage} onChange={(event) => setTargetLanguage(event.target.value)} disabled={isSpeaking}>
            {LANGUAGES.map(([code, label]) => <option key={code} value={code}>{label}</option>)}
          </select>
        </label>
        <label className="text-sm font-semibold text-gray-700">
          Voice / speaker
          <select className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2 text-sm" value={voiceURI} onChange={(event) => setVoiceURI(event.target.value)} disabled={isSpeaking}>
            {matchingVoices.length ? matchingVoices.map((voice) => <option key={voice.voiceURI} value={voice.voiceURI}>{voice.name} — {voice.lang}</option>) : <option value="">Browser default voice</option>}
          </select>
        </label>
        <label className="text-sm font-semibold text-gray-700 sm:col-span-2">
          Speaking style
          <select className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2 text-sm" value={style} onChange={(event) => setStyle(event.target.value)} disabled={isSpeaking}>
            {Object.entries(STYLE_PRESETS).map(([key, preset]) => <option key={key} value={key}>{preset.label}</option>)}
          </select>
        </label>
      </div>

      {ttsLanguage === "bho" && !hasNativeLanguageVoice && (
        <p className="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-900">Bhojpuri page translation is available, but this browser has no native Bhojpuri speech voice. MIMIC will use a Hindi voice if one is installed; pronunciation may not sound authentically Bhojpuri.</p>
      )}
      {!matchingVoices.length && (
        <p className="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-900">No matching installed voice was found. Your browser's default voice may be used. Install a voice for this language in your device settings for better results.</p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={previewVoice} disabled={isSpeaking} className="rounded-xl bg-slate-100 px-4 py-3 font-semibold text-slate-800 disabled:opacity-50">▶ Preview voice</button>
        <button type="button" onClick={readPage} disabled={isSpeaking} className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-50">🔊 Read page aloud</button>
        <button type="button" onClick={stopReading} disabled={!isSpeaking} className="rounded-xl bg-gray-200 px-4 py-3 font-semibold text-gray-800 disabled:opacity-50">⏹ Stop</button>
      </div>
      <p className="mt-3 text-xs text-gray-600" role="status" aria-live="polite">{status}</p>
      <p className="mt-2 text-xs text-gray-500">Voice quality depends on the voices installed in the browser or operating system. Selecting another language sends page text to Google Translate. Some languages, including Bhojpuri, may not have a native speech voice on your device.</p>
    </section>
  );
}
