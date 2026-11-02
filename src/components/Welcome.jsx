import AppearancePicker from "./AppearancePicker";

export default function Welcome({ onStart, appearance, onAppearanceChange }) {
  return (
    <div className="mimic-start-screen min-h-screen flex items-center justify-center p-4 sm:p-6">
      <div className="mimic-start-shell w-full max-w-5xl">
        <div className="mimic-start-copy">
          <div className="mimic-start-brand"><span className="mimic-brand-mark">M</span><span>MIMIC<span className="mimic-brand-period">.</span></span><span className="mimic-start-badge">ACCESSIBILITY FOR EVERYONE</span></div>
          <p className="mimic-start-kicker">A MORE COMFORTABLE WAY TO USE THE WEB</p>
          <h1>Technology that <span>understands you.</span></h1>
          <p className="mimic-start-lead">An adaptive digital experience designed for everyone, regardless of language, ability or technical knowledge.</p>
          <button onClick={onStart} className="mimic-start-button">Get started <span aria-hidden="true">→</span></button>
          <p className="mimic-start-footnote">Accessibility is not an option. It is a foundation.</p>
        </div>
        <AppearancePicker appearance={appearance} onChange={onAppearanceChange} />
      </div>
    </div>
  );
}
