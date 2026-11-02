export function startSpeechRecognition(language, onSuccess, onStatus) {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    onStatus("Speech recognition is not supported.");
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = language;
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => {
    onStatus("Listening... Speak now!");
  };

  recognition.onresult = (event) => {
    const result = event.results[0][0].transcript;
    onSuccess(result);
  };

  recognition.onerror = (event) => {
    onStatus("Error: " + event.error);
  };

  recognition.start();
}