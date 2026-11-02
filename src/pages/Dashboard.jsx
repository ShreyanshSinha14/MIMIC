
import { useState, useEffect } from "react";
import WebsitePreview from "../components/WebsitePreview";
import UserNeeds from "../components/UserNeeds";
import WebsiteConnector from "../components/WebsiteConnector";
import AdaptationEngine from "../components/AdaptationEngine";
import AIHelper from "../components/AIHelper";
import VoiceAssistant from "../components/VoiceAssistant";
import AnnouncementAssistant from "../components/AnnouncementAssistant";
import MissionRehearsal from "../components/MissionRehearsal";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import AccessibilityControls from "../components/AccessibilityControls";
import DecisionLab from "../components/DecisionLab";

export default function Dashboard({ mode, onChangeMode, appearance, onAppearanceChange }) {
  const [savedSettings] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("mimic-settings")) || {};
    } catch {
      return {};
    }
  });

  const [fontSize, setFontSize] = useState(savedSettings.fontSize ?? 18);
  const highContrast = !!appearance.highContrast;
  const darkMode = !!appearance.darkMode;
  const setHighContrast = (value) => onAppearanceChange({
    ...appearance,
    highContrast: typeof value === "function" ? value(highContrast) : value,
  });
  const setDarkMode = (value) => onAppearanceChange({
    ...appearance,
    darkMode: typeof value === "function" ? value(darkMode) : value,
  });
  const [increasedSpacing, setIncreasedSpacing] = useState(
    savedSettings.increasedSpacing ?? false
  );
  const [readingMode, setReadingMode] = useState(
    savedSettings.readingMode ?? false
  );

  useEffect(() => {
    try {
      localStorage.setItem(
        "mimic-settings",
        JSON.stringify({
          fontSize,
          highContrast,
          darkMode,
          increasedSpacing,
          readingMode,
        })
      );
    } catch (error) {
      console.error("Could not save MIMIC settings:", error);
    }
  }, [fontSize, highContrast, darkMode, increasedSpacing, readingMode]);

  const isHindi = mode === "hindi";
  function increaseFont() {
    setFontSize((size) => Math.min(size + 2, 28));
  }

  function decreaseFont() {
    setFontSize((size) => Math.max(size - 2, 14));
  }

  function applyAdaptation(settings = {}) {
    if (settings.fontSize !== undefined) {
      setFontSize(settings.fontSize);
    }
    if (settings.highContrast !== undefined) {
      setHighContrast(settings.highContrast);
    }
    if (settings.increasedSpacing !== undefined) {
      setIncreasedSpacing(settings.increasedSpacing);
    }
    if (settings.readingMode !== undefined) {
      setReadingMode(settings.readingMode);
    }
  }

  function resetAccessibility() {
    setFontSize(18);
    onAppearanceChange({ ...appearance, highContrast: false, darkMode: false, accentTheme: "blue" });
    setIncreasedSpacing(false);
    setReadingMode(false);
  }

  const cardStyle = highContrast
    ? "bg-gray-900 border border-gray-600 text-white"
    : "bg-white border border-gray-200 text-gray-900";

  return (
    <div className="min-h-screen w-full bg-gray-100 overflow-x-hidden">

      {/* Keyboard Accessibility: Skip Link */}
      <a
        href="#page-content"
        className="skip-link"
      >
        Skip to main content
      </a>

      <Navbar mode={mode} onChangeMode={onChangeMode} />

      <div className="flex flex-col md:flex-row min-h-screen">
        <Sidebar />

        <main
          id="page-content"
          tabIndex={-1}
          className={`flex-1 min-w-0 w-full p-4 sm:p-6 md:p-10 ${
            highContrast
              ? "bg-black text-white"
              : isHindi
              ? "bg-orange-50 text-gray-900"
              : "bg-gray-100 text-gray-900"
          } ${increasedSpacing ? "leading-loose tracking-wide" : ""}`}
          style={{ fontSize: `${fontSize}px` }}
        >
          <div
            className={`mx-auto w-full space-y-8 ${
              readingMode ? "max-w-3xl" : "max-w-6xl"
            }`}
          >
            {/* Keep high-value actions at the top so first-time users know where to begin. */}
            <VoiceAssistant mode={mode} />
            <AnnouncementAssistant mode={mode} />

            <AdaptationEngine
              mode={mode}
              onApply={applyAdaptation}
              appliedSettings={{ fontSize, highContrast, increasedSpacing, readingMode }}
            />

            {/* Welcome Banner */}
            <section
              id="overview"
              className="scroll-mt-6 bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg"
            >
              <p className="text-blue-100 font-medium mb-2">
                MIMIC • Accessible Digital Experience
              </p>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
                {isHindi ? "आपका स्वागत है!" : "Welcome to MIMIC!"}
              </h2>

              <p className="text-blue-100">
                {isHindi
                  ? "आइए आपका आवेदन आसान तरीके से पूरा करते हैं।"
                  : "A simpler, smarter and more accessible way to complete your application."}
              </p>
            </section>

            {/* Dashboard Overview */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className={`rounded-xl p-5 sm:p-6 shadow-sm ${cardStyle}`}>
                <p className="text-sm opacity-70 mb-2">
                  Current Experience
                </p>
                <h3 className="text-xl font-bold capitalize">
                  {mode} Mode
                </h3>
                <p className="text-sm opacity-70 mt-2">
                  Your selected interface experience.
                </p>
              </div>

              <div className={`rounded-xl p-5 sm:p-6 shadow-sm ${cardStyle}`}>
                <p className="text-sm opacity-70 mb-2">
                  Accessibility Settings
                </p>
                <h3 className="text-xl font-bold">
                  {highContrast ? "High Contrast ON" : "Standard Contrast"}
                </h3>
                <p className="text-sm opacity-70 mt-2">
                  Font size: {fontSize}px
                </p>
              </div>
            </section>

            {/* Featured tool: understand, simplify, translate and listen. */}
            <section id="ai-helper" className="scroll-mt-6 mimic-featured-tool">
              <div className="mimic-section-intro">
                <span className="mimic-eyebrow">YOUR EVERYDAY AI COMPANION</span>
                <h2>Understand anything. In your language.</h2>
                <p>Paste difficult text, choose how simple you want it, translate it, and listen.</p>
              </div>
              <AIHelper mode={mode} />
            </section>

            {/* Accessibility Controls */}
            <section id="accessibility" className="scroll-mt-6">
              <AccessibilityControls
                mode={mode}
                fontSize={fontSize}
                onIncrease={increaseFont}
                onDecrease={decreaseFont}
                highContrast={highContrast}
                onToggleContrast={() => setHighContrast((v) => !v)}
                increasedSpacing={increasedSpacing}
                onToggleSpacing={() => setIncreasedSpacing((v) => !v)}
                readingMode={readingMode}
                onToggleReading={() => setReadingMode((v) => !v)}
                onReset={resetAccessibility}
              />
            </section>

            {/* User Needs */}
            <section id="user-needs" className="scroll-mt-6">
              <UserNeeds mode={mode} onApply={applyAdaptation} />
            </section>

            <DecisionLab />

            {/* Rehearse real-world digital tasks before taking action. */}
            <MissionRehearsal mode={mode} />

            {/* Website Preview */}
            <section id="website-preview" className="scroll-mt-6">
              <WebsitePreview mode={mode} />
            </section>

            {/* Website Connector */}
            <section id="website-connector" className="scroll-mt-6">
              <WebsiteConnector mode={mode} fontSize={fontSize} highContrast={highContrast} increasedSpacing={increasedSpacing} />
            </section>
          </div>
        </main>
      </div>

      {/* Always-available appearance controls for the web dashboard */}
      <div className="mimic-quick-theme-controls" aria-label="Display appearance controls">
        <button
          type="button"
          onClick={() => setDarkMode((enabled) => !enabled)}
          aria-pressed={darkMode}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          className="mimic-theme-toggle"
        >
          {darkMode ? "☀ Light mode" : "☾ Dark mode"}
        </button>
        <button
          type="button"
          onClick={() => setHighContrast((enabled) => !enabled)}
          aria-pressed={highContrast}
          aria-label={highContrast ? "Disable high contrast" : "Enable high contrast"}
          title={highContrast ? "Disable high contrast" : "Enable high contrast"}
          className="mimic-contrast-toggle"
        >
          {highContrast ? "✓ High contrast ON" : "◐ High contrast"}
        </button>
      </div>
    </div>
  );
}
