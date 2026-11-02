import { useState } from "react";
import { startSpeechRecognition } from "../engines/speech.js";

export default function VoiceInput({ onTranscript, mode }) {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");

  function startListening() {
    setError("");
    const language = mode === "hindi" ? "hi-IN" : "en-IN";
    try {
      startSpeechRecognition(
        language,
        (transcript) => {
          setListening(false);
          onTranscript?.(transcript);
        },
        (message) => {
          setError(message);
          if (message !== "Listening... Speak now!") setListening(false);
        }
      );
      setListening(true);
    } catch (err) {
      setListening(false);
      setError(err?.message || "Could not start speech recognition.");
    }
  }

  return (
    <div className="mt-2">
      <button type="button" onClick={startListening} disabled={listening}
        className="bg-indigo-100 text-indigo-700 px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-50">
        {listening ? "🎙 Listening..." : "🎤 Speak"}
      </button>
      {error && <p role="status" className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  );
}
