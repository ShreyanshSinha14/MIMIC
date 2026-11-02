import AppearancePicker from "./AppearancePicker";

const modes = [
  { id: "visual", icon: "◉", title: "Make it easier to see", description: "Bigger text, stronger contrast, calmer spacing and clear controls.", detail: "VISUAL COMFORT", tone: "violet" },
  { id: "hindi", icon: "अ", title: "Make it easier to understand", description: "Simple Hindi, friendly explanations and language support.", detail: "LANGUAGE COMFORT", tone: "mint" },
];

export default function ModeSelector({ onSelect, appearance, onAppearanceChange }) {
  return (
    <main className="mimic-onboarding">
      <div className="mimic-onboarding-orb orb-one" aria-hidden="true" />
      <div className="mimic-onboarding-orb orb-two" aria-hidden="true" />
      <div className="mimic-onboarding-shell">
        <header className="mimic-onboarding-top">
          <a className="mimic-brand-mark" href="#top" aria-label="MIMIC home"><span>M</span> MIMIC</a>
          <span className="mimic-step-chip"><i /> YOUR SPACE, YOUR WAY</span>
        </header>
        <section className="mimic-onboarding-hero" id="top">
          <p className="mimic-onboarding-kicker">WELCOME TO A MORE HUMAN INTERNET</p>
          <h1>Technology should<br /><em>meet you where you are.</em></h1>
          <p className="mimic-onboarding-subtitle">Let’s shape MIMIC around the way you see, read and interact. No technical knowledge needed. You can change everything later.</p>
        </section>
        <section className="mimic-choice-area" aria-labelledby="mimic-choice-title">
          <div className="mimic-choice-heading"><div><span>CHOOSE YOUR COMFORT ZONE</span><h2 id="mimic-choice-title">What would make things easier?</h2></div><span className="mimic-choice-count">01 <b>/</b> 02</span></div>
          <div className="mimic-mode-grid">
            {modes.map((mode, index) => (
              <button key={mode.id} onClick={() => onSelect(mode.id)} className={`mimic-mode-card mimic-mode-${mode.tone}`}>
                <span className="mimic-mode-card-top"><span className="mimic-mode-card-icon" aria-hidden="true">{mode.icon}</span><span className="mimic-mode-number">0{index + 1}</span></span>
                <span className="mimic-mode-detail">{mode.detail}</span>
                <strong>{mode.title}</strong>
                <span className="mimic-mode-description">{mode.description}</span>
                <span className="mimic-mode-action">Build my experience <b aria-hidden="true">↗</b></span>
              </button>
            ))}
          </div>
          <div className="mimic-onboarding-reassurance"><span aria-hidden="true">✦</span><p><strong>Nothing is permanent.</strong> These choices only personalize your starting point. You’re always in control.</p></div>
        </section>
        <div className="mimic-onboarding-appearance"><div><strong>Make it feel like yours</strong><span>Choose a look that feels comfortable.</span></div><AppearancePicker appearance={appearance} onChange={onAppearanceChange} compact /></div>
        <footer className="mimic-onboarding-footer"><span>DESIGNED FOR EVERY MIND & EVERY ABILITY</span><span>ACCESSIBILITY IS NOT AN EXTRA. IT’S THE STARTING POINT.</span></footer>
      </div>
    </main>
  );
}
