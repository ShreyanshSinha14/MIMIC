const themes = [
  { id: "blue", name: "Ocean blue", swatch: "#155eef", ring: "#b8d0ff" },
  { id: "violet", name: "Violet", swatch: "#6941c6", ring: "#d8c8ff" },
  { id: "teal", name: "Teal", swatch: "#087f8c", ring: "#a8e6e8" },
  { id: "rose", name: "Rose", swatch: "#c0265a", ring: "#ffc2d5" },
  { id: "amber", name: "Amber", swatch: "#925900", ring: "#f7d99b" },
];

export default function AppearancePicker({ appearance, onChange, compact = false }) {
  const update = (patch) => onChange({ ...appearance, ...patch });
  return (
    <section className={`mimic-appearance-picker ${compact ? "is-compact" : ""}`} aria-label="Choose display appearance">
      <div className="mimic-appearance-heading">
        <div>
          <p className="mimic-appearance-eyebrow">MAKE MIMIC YOURS</p>
          <h2>Display preferences</h2>
          <p className="mimic-appearance-description">Choose a comfortable look before you begin. You can change it anytime.</p>
        </div>
        <span className="mimic-appearance-preview" aria-hidden="true">Aa</span>
      </div>

      <div className="mimic-appearance-modes">
        <button type="button" className={`mimic-mode-choice ${!appearance.darkMode && !appearance.highContrast ? "selected" : ""}`} onClick={() => update({ darkMode: false, highContrast: false })} aria-pressed={!appearance.darkMode && !appearance.highContrast}>
          <span className="mode-glyph light-glyph">☼</span><span><strong>Light</strong><small>Bright and clean</small></span>
        </button>
        <button type="button" className={`mimic-mode-choice ${appearance.darkMode && !appearance.highContrast ? "selected" : ""}`} onClick={() => update({ darkMode: true, highContrast: false })} aria-pressed={appearance.darkMode && !appearance.highContrast}>
          <span className="mode-glyph dark-glyph">☾</span><span><strong>Dark</strong><small>Low-light comfort</small></span>
        </button>
        <button type="button" className={`mimic-mode-choice ${appearance.highContrast ? "selected" : ""}`} onClick={() => update({ highContrast: true })} aria-pressed={appearance.highContrast}>
          <span className="mode-glyph contrast-glyph">◐</span><span><strong>High contrast</strong><small>Maximum clarity</small></span>
        </button>
      </div>

      <div className="mimic-palette-block">
        <div className="mimic-palette-label"><strong>Colour theme</strong><span>Pick an accent</span></div>
        <div className="mimic-palette-options" role="group" aria-label="Colour theme">
          {themes.map((theme) => (
            <button key={theme.id} type="button" className={`mimic-palette-option ${appearance.accentTheme === theme.id ? "selected" : ""}`} style={{ "--swatch": theme.swatch, "--swatch-ring": theme.ring }} onClick={() => update({ accentTheme: theme.id })} aria-pressed={appearance.accentTheme === theme.id} aria-label={`${theme.name} theme`} title={theme.name}>
              <span />
            </button>
          ))}
        </div>
        <p className="mimic-palette-current">{themes.find((theme) => theme.id === appearance.accentTheme)?.name || "Ocean blue"} theme selected</p>
      </div>
    </section>
  );
}
