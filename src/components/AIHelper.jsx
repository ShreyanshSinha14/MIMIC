import { useEffect, useMemo, useState } from "react";
import { detectLanguage, processText, explainVocabulary } from "../services/api";

const LANGUAGES = [
  { value: "same", label: "Same language — make it clearer" },
  { value: "en", label: "English" }, { value: "hi", label: "Hindi / हिंदी" },
  { value: "bn", label: "Bengali / বাংলা" }, { value: "ta", label: "Tamil / தமிழ்" },
  { value: "te", label: "Telugu / తెలుగు" }, { value: "mr", label: "Marathi / मराठी" },
  { value: "gu", label: "Gujarati / ગુજરાતી" }, { value: "pa", label: "Punjabi / ਪੰਜਾਬੀ" },
  { value: "kn", label: "Kannada / ಕನ್ನಡ" }, { value: "ml", label: "Malayalam / മലയാളം" },
  { value: "ur", label: "Urdu / اردو" }, { value: "es", label: "Spanish" },
  { value: "fr", label: "French" }, { value: "de", label: "German" },
];

export default function AIHelper({ mode }) {
  const isHindi = mode === "hindi";
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [action, setAction] = useState("simplify");
  const [sourceLanguage, setSourceLanguage] = useState("auto");
  const [targetLanguage, setTargetLanguage] = useState(isHindi ? "hi" : "same");
  const [level, setLevel] = useState("simple");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [source, setSource] = useState("");
  const [speechRate, setSpeechRate] = useState(1);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [voices, setVoices] = useState([]);
  const [voiceName, setVoiceName] = useState("");

  const detected = useMemo(() => text.trim() ? detectLanguage(text) : null, [text]);
  const outputLanguage = targetLanguage === "same" ? (detected || (isHindi ? "hi" : "en")) : targetLanguage;

  useEffect(() => {
    if (!("speechSynthesis" in window)) return undefined;
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.addEventListener?.("voiceschanged", loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener?.("voiceschanged", loadVoices);
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (mode === "hindi" && targetLanguage === "same") setTargetLanguage("hi");
  }, [mode, targetLanguage]);

  function stopSpeaking() {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
  }

  function speak() {
    if (!result || !("speechSynthesis" in window)) {
      setError("Text-to-speech is not supported in this browser.");
      return;
    }
    stopSpeaking();
    const utterance = new SpeechSynthesisUtterance(result);
    const speechLocales = { en: "en-IN", hi: "hi-IN", bn: "bn-IN", ta: "ta-IN", te: "te-IN", mr: "mr-IN", gu: "gu-IN", pa: "pa-IN", kn: "kn-IN", ml: "ml-IN", ur: "ur-IN", es: "es-ES", fr: "fr-FR", de: "de-DE" };
    utterance.lang = speechLocales[outputLanguage] || "en-IN";
    utterance.rate = Number(speechRate);
    const selectedVoice = voices.find((voice) => voice.name === voiceName)
      || voices.find((voice) => voice.lang.toLowerCase().startsWith(outputLanguage));
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => { setSpeaking(false); setPaused(false); };
    utterance.onerror = () => { setSpeaking(false); setPaused(false); };
    window.speechSynthesis.speak(utterance);
  }

  async function handleProcess() {
    if (!text.trim()) {
      setError(isHindi ? "कृपया टेक्स्ट लिखें या पेस्ट करें।" : "Please enter or paste some text first.");
      return;
    }
    setLoading(true);
    setError("");
    setResult("");
    setSource("");
    stopSpeaking();
    try {
      const data = action === "explain"
        ? await explainVocabulary(text.trim(), sourceLanguage === "auto" ? (detected || "en") : sourceLanguage)
        : await processText({ text: text.trim(), action, sourceLanguage, targetLanguage, level });
      setResult(data.text);
      setSource(data.source);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function copyResult() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(result);
      setError("Copied to clipboard.");
    } catch {
      setError("Could not access clipboard. Please select and copy the text.");
    }
  }

  return (
    <section className="mimic-language-lab bg-white rounded-2xl shadow-md p-5 sm:p-7 space-y-5" aria-labelledby="mimic-ai-title">
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-xs font-bold tracking-wide uppercase text-blue-700 bg-blue-50 px-3 py-1 rounded-full">MIMIC AI</span>
          <span className="text-xs text-gray-500">Understand • Translate • Listen</span>
        </div>
        <h2 id="mimic-ai-title" className="text-2xl font-bold text-gray-800">{isHindi ? "MIMIC AI सहायक" : "AI Language Helper"}</h2>
        <p className="text-gray-600 mt-1">{isHindi ? "कठिन शब्दों का अर्थ जानें, उसी भाषा में आसान बनाएँ, दूसरी भाषा में बदलें और सुनें।" : "Rewrite in the same language, unpack difficult vocabulary, translate across languages, and listen. Understanding matters more than word-for-word conversion."}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="block text-sm font-semibold text-gray-700">What should AI do?
          <select value={action} onChange={(e) => setAction(e.target.value)} className="mt-1 w-full rounded-xl border border-gray-300 p-3 bg-white">
            <option value="simplify">Rewrite clearly — same language</option>
            <option value="explain">Explain difficult words — same language</option>
            <option value="translate">Translate — change language</option>
          </select>
        </label>
        <label className="block text-sm font-semibold text-gray-700">Output language
          <select value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)} className="mt-1 w-full rounded-xl border border-gray-300 p-3 bg-white">
            {LANGUAGES.map((language) => <option key={language.value} value={language.value}>{language.label}</option>)}
          </select>
        </label>
        <label className="block text-sm font-semibold text-gray-700">Input language
          <select value={sourceLanguage} onChange={(e) => setSourceLanguage(e.target.value)} className="mt-1 w-full rounded-xl border border-gray-300 p-3 bg-white">
            <option value="auto">Auto-detect</option>{LANGUAGES.filter((item) => item.value !== "same").map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
        </label>
        <label className="block text-sm font-semibold text-gray-700">Explanation level
          <select value={level} onChange={(e) => setLevel(e.target.value)} className="mt-1 w-full rounded-xl border border-gray-300 p-3 bg-white">
            <option value="simple">Simple — everyday words</option><option value="very_simple">Very simple — beginner level</option><option value="detailed">Detailed — explain with examples</option>
          </select>
        </label>
      </div>

      <label className="block text-sm font-semibold text-gray-700" htmlFor="mimic-ai-input">Paste or type complicated text
        <textarea id="mimic-ai-input" value={text} onChange={(e) => { setText(e.target.value); setError(""); }} placeholder="Paste English, हिंदी, or Hinglish text here…" className="mt-2 w-full min-h-36 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
      </label>
      {action === "translate" && !import.meta.env.VITE_API_URL && <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">Live translation uses an external community translation service when no private MIMIC AI server is configured. Avoid pasting passwords, OTPs, financial details or other sensitive information.</p>}

      <div className="flex flex-wrap justify-between items-center gap-2 text-xs text-gray-500">
        <span>{text.length.toLocaleString()} characters {detected ? `• Detected: ${LANGUAGES.find((item) => item.value === detected)?.label || detected.toUpperCase()}` : ""}</span>
        <button type="button" onClick={() => { setText(""); setResult(""); setError(""); stopSpeaking(); }} className="underline hover:text-blue-700">Clear</button>
      </div>

      <button type="button" onClick={handleProcess} disabled={loading || !text.trim()} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold px-6 py-3 rounded-xl">
        {loading ? "Working on your text…" : action === "translate" ? "Translate text" : action === "explain" ? "Explain vocabulary" : "Make text easier"}
      </button>

      {error && <p role="status" className={`text-sm ${error.startsWith("Copied") ? "text-green-700" : "text-red-600"}`}>{error}</p>}

      {result && <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <div><h3 className="font-bold text-blue-950">{action === "translate" ? "Translated text" : action === "explain" ? "Vocabulary, made understandable" : "Your easier-to-understand text"}</h3><p className="text-xs text-blue-800 mt-1">{source === "ai" ? "Processed by MIMIC AI" : source === "community-translation" ? "Translated using the community translation service" : source === "dictionary" ? "Dictionary definitions + MIMIC glossary" : source === "glossary" ? "MIMIC built-in glossary" : "Offline simplification rules"}</p></div>
          <button type="button" onClick={copyResult} className="text-sm font-semibold text-blue-800 underline">Copy text</button>
        </div>
        <p className="text-gray-900 whitespace-pre-wrap leading-relaxed" aria-live="polite">{result}</p>
        {source === "offline" && <p className="text-xs text-gray-600">Offline mode uses basic word and sentence rules. It cannot translate between languages or fully understand context. Check important details against the original.</p>}
        <div className="border-t border-blue-200 pt-4 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={speaking ? stopSpeaking : speak} className="bg-blue-700 hover:bg-blue-800 text-white rounded-lg px-4 py-2 font-semibold">{speaking ? "Stop" : "🔊 Listen"}</button>
            {speaking && <button type="button" onClick={() => { if (paused) { window.speechSynthesis.resume(); setPaused(false); } else { window.speechSynthesis.pause(); setPaused(true); } }} className="border border-blue-300 text-blue-900 rounded-lg px-4 py-2 font-semibold">{paused ? "Resume" : "Pause"}</button>}
            <label className="text-sm text-gray-700">Speed
              <select value={speechRate} onChange={(e) => setSpeechRate(e.target.value)} className="ml-2 border border-gray-300 rounded-lg p-2 bg-white"><option value="0.75">Slow</option><option value="1">Normal</option><option value="1.25">Fast</option><option value="1.5">Very fast</option></select>
            </label>
          </div>
          {voices.filter((voice) => voice.lang.toLowerCase().startsWith(outputLanguage)).length > 0 && <label className="block text-sm text-gray-700">Voice
            <select value={voiceName} onChange={(e) => setVoiceName(e.target.value)} className="ml-2 max-w-full border border-gray-300 rounded-lg p-2 bg-white"><option value="">Best available {outputLanguage === "hi" ? "Hindi" : "English"} voice</option>{voices.filter((voice) => voice.lang.toLowerCase().startsWith(outputLanguage)).map((voice) => <option key={`${voice.name}-${voice.lang}`} value={voice.name}>{voice.name} ({voice.lang})</option>)}</select>
          </label>}
          <p className="text-xs text-gray-600">Speech uses voices installed in the user's browser or device. Hindi voice availability depends on the device.</p>
        </div>
      </div>}
    </section>
  );
}
