import { useState } from "react";
import { startSpeechRecognition } from "../engines/speech.js";
import { parseAnnouncement } from "../engines/parser.js";

export default function AnnouncementAssistant({ mode }) {
  const [listening, setListening] = useState(false);
  const [status, setStatus] = useState("");
  const [transcript, setTranscript] = useState("");
  const [card, setCard] = useState(null);
  const [typedText, setTypedText] = useState("");
  const isHindi = mode === "hindi";

  function processTyped() {
    const value = typedText.trim();
    if (!value) {
      setStatus(isHindi ? "कृपया घोषणा लिखें।" : "Please type an announcement first.");
      return;
    }
    setTranscript(value);
    setCard(parseAnnouncement(value));
    setStatus(isHindi ? "घोषणा तैयार है।" : "Announcement processed.");
  }

  function listen() {
    setStatus("");
    setCard(null);
    const language = mode === "hindi" ? "hi-IN" : "en-IN";
    try {
      startSpeechRecognition(language, (text) => {
        setListening(false);
        setTranscript(text);
        setCard(parseAnnouncement(text));
        setStatus("Announcement processed.");
      }, (message) => {
        setStatus(message);
        setListening(message === "Listening... Speak now!");
      });
      setListening(true);
    } catch (error) {
      setListening(false);
      setStatus(error?.message || "Could not start speech recognition.");
    }
  }

  return (
    <section className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-3">
      <div>
        <h2 className="text-xl font-bold">Announcement Assistant</h2>
        <p className="text-sm text-gray-600 mt-1">
          Speak or type an announcement in English or Hindi to create a quick action summary.
        </p>
      </div>
      <button type="button" onClick={listen} disabled={listening}
        className="bg-indigo-600 text-white px-5 py-3 rounded-xl disabled:opacity-50">
        {listening ? "Listening…" : "🎙 Capture announcement"}
      </button>
      <div className="space-y-2">
        <label htmlFor="announcement-typed" className="block text-sm font-semibold">
          {isHindi ? "या घोषणा यहाँ लिखें" : "Or type the announcement"}
        </label>
        <textarea
          id="announcement-typed"
          value={typedText}
          onChange={(e) => setTypedText(e.target.value)}
          placeholder={isHindi
            ? "जैसे: कल सुबह 10 बजे कमरा 204 में बैठक है।"
            : "e.g. Meeting tomorrow at 10 AM in Room 204. Attendance is mandatory."}
          className="w-full min-h-24 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
        />
        <button type="button" onClick={processTyped}
          className="bg-indigo-100 text-indigo-800 font-semibold px-5 py-2 rounded-xl">
          {isHindi ? "घोषणा समझें" : "Summarise typed announcement"}
        </button>
      </div>
      {status && <p role="status" aria-live="polite" className="text-sm text-gray-700">{status}</p>}
      {transcript && <p className="text-sm"><strong>{isHindi ? "घोषणा:" : "Announcement:"}</strong> {transcript}</p>}
      {card && (
        <article className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 space-y-2" aria-live="polite">
          <h3 className="font-bold text-lg">{card.title}</h3>
          <p><strong>Action:</strong> {card.action}</p>
          <p><strong>Date:</strong> {card.date}</p>
          <p><strong>Time:</strong> {card.time}</p>
          <p><strong>Location:</strong> {card.location}</p>
          <p><strong>Urgency:</strong> {card.urgency}</p>
        </article>
      )}
      <p className="text-xs text-gray-500">
        Speech recognition requires microphone permission and a supported browser (Chrome recommended).
        The parser is rule-based; verify important details against the original announcement.
      </p>
    </section>
  );
}
