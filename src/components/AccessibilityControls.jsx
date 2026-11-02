
export default function AccessibilityControls({
  mode,
  fontSize,
  onIncrease,
  onDecrease,
  highContrast,
  onToggleContrast,
  increasedSpacing,
  onToggleSpacing,
  readingMode,
  onToggleReading,
  onReset
}) {
  const isHindi = mode === "hindi";

  const buttonStyle =
    "px-4 py-3 rounded-xl font-semibold transition hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-300";

  const translations = {
    title: isHindi ? "सुगम्यता सेटिंग्स" : "Accessibility Settings",
    description: isHindi
      ? "अपने डिजिटल अनुभव को अपनी जरूरत के अनुसार बदलें।"
      : "Customize your digital experience.",

    decrease: isHindi ? "टेक्स्ट छोटा करें" : "Decrease font size",
    increase: isHindi ? "टेक्स्ट बड़ा करें" : "Increase font size",

    contrastOn: isHindi ? "✓ हाई कंट्रास्ट चालू" : "✓ High Contrast ON",
    contrastOff: isHindi ? "हाई कंट्रास्ट बंद" : "High Contrast OFF",

    spacingOn: isHindi ? "✓ टेक्स्ट स्पेसिंग चालू" : "✓ Spacing ON",
    spacingOff: isHindi ? "टेक्स्ट स्पेसिंग" : "Text Spacing",

    readingOn: isHindi ? "✓ रीडिंग मोड चालू" : "✓ Reading Mode ON",
    readingOff: isHindi ? "रीडिंग मोड" : "Reading Mode",

    reset: isHindi ? "सभी रीसेट करें" : "Reset All",
    textSize: isHindi ? "वर्तमान टेक्स्ट आकार" : "Current text size",

    controls: isHindi ? "सुगम्यता नियंत्रण" : "Accessibility controls",
    resetLabel: isHindi ? "सभी सेटिंग्स रीसेट करें" : "Reset all accessibility settings"
  };

  return (
    <section
      className="bg-slate-900 text-white p-6 rounded-2xl mb-8 shadow-lg"
      aria-labelledby="accessibility-title"
    >
      <h2
        id="accessibility-title"
        className="text-xl font-bold mb-2"
      >
        {translations.title}
      </h2>

      <p className="text-slate-300 text-sm mb-5">
        {translations.description}
      </p>

      <div
        role="group"
        aria-label={translations.controls}
        className="flex flex-wrap gap-3"
      >
        <button
          type="button"
          onClick={onDecrease}
          className={`${buttonStyle} bg-slate-700`}
          aria-label={translations.decrease}
        >
          A-
        </button>

        <button
          type="button"
          onClick={onIncrease}
          className={`${buttonStyle} bg-slate-700`}
          aria-label={translations.increase}
        >
          A+
        </button>

        <button
          type="button"
          onClick={onToggleContrast}
          aria-pressed={highContrast}
          aria-label={translations.contrastOn.replace("✓ ", "")}
          className={`${buttonStyle} ${
            highContrast ? "bg-green-600" : "bg-blue-600"
          }`}
        >
          {highContrast
            ? translations.contrastOn
            : translations.contrastOff}
        </button>

        <button
          type="button"
          onClick={onToggleSpacing}
          aria-pressed={increasedSpacing}
          aria-label={translations.spacingOff}
          className={`${buttonStyle} ${
            increasedSpacing ? "bg-green-600" : "bg-slate-700"
          }`}
        >
          {increasedSpacing
            ? translations.spacingOn
            : translations.spacingOff}
        </button>

        <button
          type="button"
          onClick={onToggleReading}
          aria-pressed={readingMode}
          aria-label={translations.readingOff}
          className={`${buttonStyle} ${
            readingMode ? "bg-green-600" : "bg-slate-700"
          }`}
        >
          {readingMode
            ? translations.readingOn
            : translations.readingOff}
        </button>

        <button
          type="button"
          onClick={onReset}
          className={`${buttonStyle} bg-red-600`}
          aria-label={translations.resetLabel}
        >
          {translations.reset}
        </button>
      </div>

      <p
        className="mt-5 text-slate-300"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {translations.textSize}: {fontSize}px
      </p>
    </section>
  );
}
