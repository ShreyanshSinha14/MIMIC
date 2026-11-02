import { useMemo, useState } from "react";

const missions = [
  { label: "Fill an online form", icon: "📝", goal: "I need to fill out an online form", detail: "A website is asking me for personal or application details." },
  { label: "Understand a confusing message", icon: "💬", goal: "I need to understand a confusing message", detail: "I received a message, notice or instruction and I am not sure what it means." },
  { label: "Make an online payment", icon: "💳", goal: "I need to make an online payment", detail: "I want to pay a fee safely without making a mistake." },
  { label: "Apply for something", icon: "🎓", goal: "I need to submit an online application", detail: "I want to apply for a scheme, scholarship, job or service." },
];

function buildPlan(goal, details) {
  const text = `${goal} ${details}`.toLowerCase();
  const payment = /pay|payment|fee|bank|upi|card|money|transaction/.test(text);
  const form = /form|application|apply|register|registration|submit|scholarship|job/.test(text);
  const message = /message|notice|email|letter|confus|understand|instruction/.test(text);
  const steps = [
    { title: "Pause and identify the destination", body: "Check the website or app name. Make sure you reached it from a source you trust.", check: "I recognise this website or app." },
    ...(message ? [{ title: "Decode what it is asking", body: "Find the main request, the deadline (if any), and what action is expected. Do not act on threats or urgent demands without checking them.", check: "I know what the message is asking me to do." }] : []),
    ...(form ? [{ title: "Gather details before typing", body: "Keep the required documents and information nearby. Look for fields marked required and check spellings before moving on.", check: "I have the information and documents I need." }] : []),
    ...(payment ? [{ title: "Verify every payment detail", body: "Check the recipient, amount and purpose. Never share an OTP, PIN or password with another person. Stop if anything looks unexpected.", check: "The recipient and amount are correct." }] : []),
    { title: "Do one small step at a time", body: "Complete one section, review it, then continue. If a page changes unexpectedly, stop instead of guessing.", check: "I have reviewed the information on this page." },
    { title: "Review before the final action", body: "Look for errors, hidden fees, permissions or terms. Only press Submit, Confirm or Pay when you understand the result.", check: "I understand what will happen when I continue." },
    { title: "Keep proof and know how to recover", body: "Save the confirmation number or receipt. If something fails, take a screenshot of the error and use the official help channel.", check: "I know where my confirmation or receipt will be saved." },
  ];
  return steps;
}

export default function MissionRehearsal({ mode }) {
  const [goal, setGoal] = useState("");
  const [details, setDetails] = useState("");
  const [plan, setPlan] = useState(null);
  const [done, setDone] = useState([]);
  const [showSafety, setShowSafety] = useState(false);
  const isHindi = mode === "hindi";
  const progress = plan?.length ? Math.round((done.length / plan.length) * 100) : 0;
  const ready = useMemo(() => !!plan && done.length === plan.length, [plan, done]);

  function start() {
    if (!goal.trim()) return;
    setPlan(buildPlan(goal, details));
    setDone([]);
    setShowSafety(false);
  }

  return (
    <section id="mission-rehearsal" className="mimic-mission-card scroll-mt-6">
      <div className="mimic-mission-hero">
        <div className="mimic-mission-orbit" aria-hidden="true">✦</div>
        <span className="mimic-mission-kicker">MIMIC • REAL-LIFE SIMULATOR</span>
        <h2>{isHindi ? "करने से पहले अभ्यास करें।" : "Rehearse the real world. Before you click."}</h2>
        <p>{isHindi ? "किसी कठिन डिजिटल काम को छोटे, सुरक्षित और समझने योग्य कदमों में बदलें।" : "Turn an intimidating digital task into a calm, step-by-step mission. Think it through here before you do it for real."}</p>
      </div>

      <div className="mimic-mission-body">
        <div className="mimic-mission-prompt">
          <div>
            <span className="mimic-mission-label">01 / CHOOSE YOUR MISSION</span>
            <h3>What are you trying to do?</h3>
            <p>Pick a starting point or describe your own situation.</p>
          </div>
          <div className="mimic-mission-presets">
            {missions.map((item) => (
              <button key={item.label} type="button" onClick={() => { setGoal(item.goal); setDetails(item.detail); setPlan(null); }} className={`mimic-mission-preset ${goal === item.goal ? "selected" : ""}`}>
                <span aria-hidden="true">{item.icon}</span>{item.label}
              </button>
            ))}
          </div>
          <label className="mimic-mission-field">My goal
            <input value={goal} onChange={(e) => { setGoal(e.target.value); setPlan(null); }} placeholder="e.g. I want to apply for a government scholarship" />
          </label>
          <label className="mimic-mission-field">What feels confusing? <span>(optional)</span>
            <textarea value={details} onChange={(e) => setDetails(e.target.value)} rows={3} placeholder="Tell MIMIC what you are worried about, what the page says, or where you feel stuck…" />
          </label>
          <button type="button" onClick={start} disabled={!goal.trim()} className="mimic-mission-start">Build my rehearsal <span aria-hidden="true">→</span></button>
          <p className="mimic-mission-privacy">🔒 Your description stays in this browser. This demo creates a guided checklist locally; it does not access or control another website.</p>
        </div>

        <div className="mimic-mission-output" aria-live="polite">
          {!plan ? (
            <div className="mimic-mission-empty"><div aria-hidden="true">🧭</div><h3>Your next move, made clearer.</h3><p>Your personalised rehearsal will appear here. No pressure, no real-world changes — just a safe place to prepare.</p><span>READY WHEN YOU ARE</span></div>
          ) : (
            <>
              <div className="mimic-mission-progress"><div><span className="mimic-mission-label">02 / YOUR REHEARSAL</span><strong>{done.length} of {plan.length} steps ready</strong></div><b>{progress}%</b><div className="mimic-mission-track"><i style={{ width: `${progress}%` }} /></div></div>
              <div className="mimic-mission-steps">
                {plan.map((step, index) => {
                  const checked = done.includes(index);
                  return <label key={step.title} className={`mimic-mission-step ${checked ? "complete" : ""}`}>
                    <input type="checkbox" checked={checked} onChange={() => setDone((old) => checked ? old.filter((n) => n !== index) : [...old, index])} />
                    <span className="mimic-mission-step-number">{checked ? "✓" : String(index + 1).padStart(2, "0")}</span>
                    <span><strong>{step.title}</strong><small>{step.body}</small><em>{step.check}</em></span>
                  </label>;
                })}
              </div>
              {ready && <div className="mimic-mission-ready" role="status"><strong>✨ You have rehearsed every step.</strong><p>Take your time when you do it for real. You can come back to this plan whenever you need.</p></div>}
              <button type="button" className="mimic-mission-safety-toggle" onClick={() => setShowSafety((v) => !v)} aria-expanded={showSafety}>⚠️ {showSafety ? "Hide" : "Show"} the pause-and-check rules</button>
              {showSafety && <div className="mimic-mission-safety">Never share passwords, PINs or OTPs. Do not pay through links in unexpected messages. If you feel pressured, confused or unsafe, stop and verify through the organisation's official website or support number.</div>}
              <button type="button" className="mimic-mission-reset" onClick={() => { setPlan(null); setDone([]); }}>Start a different mission ↗</button>
            </>
          )}
        </div>
      </div>
      <div className="mimic-mission-foot"><span>✦ BUILT FOR CONFIDENCE, NOT SPEED</span><span>One step at a time is still progress.</span></div>
    </section>
  );
}
