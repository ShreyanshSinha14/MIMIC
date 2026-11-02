
import { useEffect, useState } from "react";

const profiles = [
  {
    id: "visual",
    icon: "👁️",
    title: "Visual Clarity",
    description: "For users who need clearer and more visible content.",
    settings: {
      fontSize: 22,
      highContrast: true,
      increasedSpacing: true,
      readingMode: true,
    },
  },
  {
    id: "reading",
    icon: "📖",
    title: "Easy Reading",
    description: "For users who prefer simple, spacious layouts.",
    settings: {
      fontSize: 20,
      highContrast: false,
      increasedSpacing: true,
      readingMode: true,
    },
  },
  {
    id: "standard",
    icon: "💻",
    title: "Standard Experience",
    description: "A balanced and familiar website experience.",
    settings: {
      fontSize: 18,
      highContrast: false,
      increasedSpacing: false,
      readingMode: false,
    },
  },
];

export default function AdaptationEngine({
  mode,
  onApply,
  appliedSettings,
}) {
  const isHindi = mode === "hindi";

  const [settings, setSettings] = useState(
    appliedSettings || profiles[2].settings
  );

  const [selectedProfile, setSelectedProfile] = useState("standard");

  // Keep the engine synchronized with dashboard settings.
  useEffect(() => {
    if (!appliedSettings) return;

    setSettings(appliedSettings);

    const matchingProfile = profiles.find((profile) =>
      Object.keys(profile.settings).every(
        (key) => profile.settings[key] === appliedSettings[key]
      )
    );

    setSelectedProfile(matchingProfile?.id || "custom");
  }, [
    appliedSettings?.fontSize,
    appliedSettings?.highContrast,
    appliedSettings?.increasedSpacing,
    appliedSettings?.readingMode,
  ]);

  function chooseProfile(profile) {
    setSelectedProfile(profile.id);
    setSettings({ ...profile.settings });
  }

  function updateSetting(key, value) {
    setSelectedProfile("custom");

    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  function applySettings() {
    onApply(settings);
  }

  return (
    <section className="bg-white rounded-2xl shadow-md p-6 space-y-6">
      <div>
        <p className="text-blue-600 font-semibold text-sm">
          MIMIC ADAPTATION ENGINE
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-2">
          {isHindi ? "अपना अनुभव चुनें" : "Customize Your Experience"}
        </h2>

        <p className="text-gray-600 mt-2">
          {isHindi
            ? "वेबसाइट को अपनी जरूरत के अनुसार ढालें।"
            : "Choose how you want websites to look and feel."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {profiles.map((profile) => (
          <button
            key={profile.id}
            type="button"
            onClick={() => chooseProfile(profile)}
            aria-pressed={selectedProfile === profile.id}
            className={`text-left p-5 rounded-xl border-2 transition ${
              selectedProfile === profile.id
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 hover:border-blue-300"
            }`}
          >
            <span className="text-3xl">{profile.icon}</span>

            <h3 className="font-bold text-gray-900 mt-3">
              {isHindi
                ? profile.id === "visual"
                  ? "दृश्य स्पष्टता"
                  : profile.id === "reading"
                  ? "आसान पढ़ाई"
                  : "सामान्य अनुभव"
                : profile.title}
            </h3>

            <p className="text-sm text-gray-600 mt-2">
              {profile.description}
            </p>

            {selectedProfile === profile.id && (
              <p className="text-blue-700 text-sm font-semibold mt-3">
                ✓ Selected
              </p>
            )}
          </button>
        ))}
      </div>

      <div className="border-t pt-5 space-y-4">
        <h3 className="text-lg font-bold text-gray-900">
          {isHindi ? "अपनी सेटिंग बदलें" : "Fine-tune Your Settings"}
        </h3>

        <label className="flex items-center justify-between gap-3">
          <span className="text-gray-800 font-medium">
            {isHindi ? "बड़ा टेक्स्ट" : "Larger text"}
          </span>

          <input
            type="range"
            min="16"
            max="26"
            step="2"
            value={settings.fontSize}
            onChange={(e) =>
              updateSetting("fontSize", Number(e.target.value))
            }
            className="w-32 accent-blue-600"
          />

          <span className="text-sm text-gray-600 w-8">
            {settings.fontSize}
          </span>
        </label>

        {[
          {
            key: "highContrast",
            label: "High contrast",
            hindi: "हाई कंट्रास्ट",
          },
          {
            key: "increasedSpacing",
            label: "Increased spacing",
            hindi: "अधिक स्पेसिंग",
          },
          {
            key: "readingMode",
            label: "Simplified reading layout",
            hindi: "सरल रीडिंग लेआउट",
          },
        ].map((item) => (
          <label
            key={item.key}
            className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg"
          >
            <span className="text-gray-800">
              {isHindi ? item.hindi : item.label}
            </span>

            <input
              type="checkbox"
              checked={settings[item.key]}
              onChange={(e) =>
                updateSetting(item.key, e.target.checked)
              }
              className="w-5 h-5 accent-blue-600"
            />
          </label>
        ))}
      </div>

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
        <h3 className="font-bold text-blue-900 mb-3">
          {isHindi ? "लाइव प्रीव्यू" : "Live Preview"}
        </h3>

        <div
          className={`rounded-lg p-4 transition ${
            settings.highContrast
              ? "bg-black text-white"
              : "bg-white text-gray-900"
          } ${settings.increasedSpacing ? "space-y-5" : "space-y-2"}`}
          style={{ fontSize: `${settings.fontSize}px` }}
        >
          <h4 className="font-bold">
            {isHindi ? "पीएम विद्यालक्ष्मी आवेदन" : "PM Vidya Lakshmi Application"}
          </h4>

          <p>
            {isHindi
              ? "आवेदन करने के लिए अपनी जानकारी भरें।"
              : "Enter your details to complete your application."}
          </p>

          <button
            type="button"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            {isHindi ? "शुरू करें" : "Get Started"}
          </button>
        </div>

        <p className="text-xs text-gray-600 mt-3">
          Preview your settings before applying them to the dashboard.
        </p>
      </div>

      <button
        type="button"
        onClick={applySettings}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition"
      >
        {isHindi ? "सेटिंग लागू करें" : "Apply My Experience"}
      </button>
    </section>
  );
}
