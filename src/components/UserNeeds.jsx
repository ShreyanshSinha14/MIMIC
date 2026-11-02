
import { useState, useEffect } from "react";

const DEFAULT_NEEDS = {
  largerText: false,
  highContrast: false,
  simpleLanguage: false,
  moreSpacing: false,
  simpleNavigation: false,
};

export default function UserNeeds({ mode, onApply }) {
  const isHindi = mode === "hindi";

  const [needs, setNeeds] = useState(() => {
    try {
      const saved = localStorage.getItem("mimic-user-needs");
      return saved
        ? { ...DEFAULT_NEEDS, ...JSON.parse(saved) }
        : DEFAULT_NEEDS;
    } catch {
      return DEFAULT_NEEDS;
    }
  });

  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("mimic-user-needs", JSON.stringify(needs));
    } catch (error) {
      console.error("Could not save preferences:", error);
    }
  }, [needs]);

  function toggleNeed(key) {
    setNeeds((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));

    setSavedMessage(false);
  }

  function applyNeeds() {
    const settings = {
      fontSize: needs.largerText ? 22 : 18,
      highContrast: needs.highContrast,
      increasedSpacing: needs.moreSpacing,
      readingMode: needs.simpleLanguage || needs.simpleNavigation,
    };

    onApply(settings);
    setSavedMessage(true);
  }

  const options = [
    {
      key: "largerText",
      icon: "🔎",
      title: "I need larger text",
      hindi: "मुझे बड़ा टेक्स्ट चाहिए",
      description: "Make text easier to see.",
      descriptionHindi: "टेक्स्ट को पढ़ना आसान बनाएं।",
    },
    {
      key: "highContrast",
      icon: "🎨",
      title: "I prefer high contrast",
      hindi: "मुझे हाई कंट्रास्ट पसंद है",
      description: "Make important content stand out.",
      descriptionHindi: "महत्वपूर्ण सामग्री को स्पष्ट बनाएं।",
    },
    {
      key: "simpleLanguage",
      icon: "📖",
      title: "I prefer simple language",
      hindi: "मुझे आसान भाषा चाहिए",
      description: "Help me understand complicated instructions.",
      descriptionHindi: "मुश्किल निर्देशों को समझना आसान बनाएं।",
    },
    {
      key: "moreSpacing",
      icon: "↔️",
      title: "I need more spacing",
      hindi: "मुझे अधिक स्पेसिंग चाहिए",
      description: "Give text and buttons more breathing room.",
      descriptionHindi: "टेक्स्ट और बटन के बीच अधिक जगह रखें।",
    },
    {
      key: "simpleNavigation",
      icon: "🧭",
      title: "I prefer simple navigation",
      hindi: "मुझे आसान नेविगेशन चाहिए",
      description: "Make pages easier to navigate.",
      descriptionHindi: "वेबसाइट पर रास्ता ढूंढना आसान बनाएं।",
    },
  ];

  return (
    <section className="bg-white rounded-2xl shadow-md p-6 space-y-6">
      <div>
        <p className="text-blue-600 text-sm font-bold">
          MIMIC PERSONALIZATION
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-2">
          {isHindi
            ? "आपको किस तरह का अनुभव चाहिए?"
            : "How Can MIMIC Help You?"}
        </h2>

        <p className="text-gray-600 mt-2">
          {isHindi
            ? "अपनी जरूरतों के अनुसार विकल्प चुनें।"
            : "Select the features that would make websites easier for you."}
        </p>
      </div>

      <div className="space-y-3">
        {options.map((option) => (
          <label
            key={option.key}
            className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${
              needs[option.key]
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 hover:border-blue-300"
            }`}
          >
            <span className="text-2xl">{option.icon}</span>

            <span className="flex-1">
              <span className="block font-bold text-gray-900">
                {isHindi ? option.hindi : option.title}
              </span>

              <span className="block text-sm text-gray-600 mt-1">
                {isHindi
                  ? option.descriptionHindi
                  : option.description}
              </span>
            </span>

            <input
              type="checkbox"
              checked={needs[option.key]}
              onChange={() => toggleNeed(option.key)}
              className="w-5 h-5 accent-blue-600"
            />
          </label>
        ))}
      </div>

      <div className="bg-blue-50 rounded-xl p-4">
        <p className="font-semibold text-blue-900">
          {isHindi ? "आपके चुने गए विकल्प" : "Your selected preferences"}
        </p>

        <p className="text-sm text-blue-800 mt-1">
          {Object.values(needs).filter(Boolean).length} of 5 selected
        </p>
      </div>

      <button
        onClick={applyNeeds}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl"
      >
        {isHindi ? "मेरा अनुभव लागू करें" : "Apply My Preferences"}
      </button>

      {savedMessage && (
        <p role="status" className="text-green-700 font-semibold text-sm">
          {isHindi
            ? "✓ आपकी प्राथमिकताएं लागू हो गई हैं!"
            : "✓ Your preferences have been applied and saved!"}
        </p>
      )}
    </section>
  );
}
