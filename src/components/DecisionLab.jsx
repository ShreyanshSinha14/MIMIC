import { useState } from "react";

const scenarios = [
  {
    id: "urgent", tag: "SCAM RADAR", icon: "🛡️", title: "The 10-minute warning",
    setup: "A message says: ‘Your bank account will be blocked in 10 minutes. Verify now using this link.’ What do you do?",
    choices: [
      { label: "Open the link quickly", risk: "high", title: "Pressure is the warning sign", detail: "Scammers create urgency so you act before thinking. A link in an unexpected threat is not a safe way to verify an account.", next: "Close the message. Open your bank's official app yourself or call the number printed on your card." },
      { label: "Ignore the link and verify independently", risk: "safe", title: "You broke the pressure loop", detail: "Excellent. You did not let a countdown choose for you. Independent verification is safer than trusting a message link.", next: "Open the official app or type the known website address yourself. Never share an OTP, PIN or password." },
      { label: "Reply and ask if it is real", risk: "medium", title: "A reply can confirm your number is active", detail: "The sender may simply pressure you more or collect information. A reply does not prove who sent the message.", next: "Do not engage. Verify through an official channel you find independently." },
    ],
  },
  {
    id: "form", tag: "FORM NAVIGATOR", icon: "🧭", title: "The confusing form field",
    setup: "An online form asks for ‘Correspondence address’. You are not sure what it means. What is your next move?",
    choices: [
      { label: "Enter a random address to continue", risk: "high", title: "A guess can become an official mistake", detail: "Forms may use this address for letters or important notices. Incorrect information can cause missed communication.", next: "Look for a help icon or instructions. If still unclear, contact the organisation before submitting." },
      { label: "Pause, inspect the help text, then ask if needed", risk: "safe", title: "You chose clarity over speed", detail: "A correspondence address is generally where an organisation can send letters to you. It may differ from a permanent address.", next: "Check the form's own definition and use the address where you can reliably receive communication." },
      { label: "Use my permanent address automatically", risk: "medium", title: "It might be right, but check first", detail: "Some forms distinguish permanent and correspondence addresses. They are not always the same.", next: "Read the field hint and check whether the form asks where you currently receive mail." },
    ],
  },
  {
    id: "otp", tag: "PRIVACY SHIELD", icon: "🔐", title: "The helpful caller",
    setup: "Someone claiming to be support says they need the OTP sent to your phone to ‘finish your application’. What do you do?",
    choices: [
      { label: "Share it because they sound official", risk: "high", title: "An OTP can unlock an account or approve an action", detail: "A caller's confidence, logo or knowledge of your details does not prove their identity.", next: "Never tell anyone your OTP. End the call and contact the organisation using its official website or app." },
      { label: "Refuse and contact support independently", risk: "safe", title: "Your secret stays yours", detail: "Correct. OTPs are for you to enter into a trusted service flow, not to disclose to another person.", next: "End the call. Check your account through the official app and report suspicious contact." },
      { label: "Ask them to send an identity card first", risk: "medium", title: "A picture is not proof", detail: "Identity cards and caller IDs can be copied or faked. This still leaves you in the same risky conversation.", next: "Do not share the OTP. Verify independently through an official channel." },
    ],
  },
];

export default function DecisionLab() {
  const [scenarioId, setScenarioId] = useState("urgent");
  const [choice, setChoice] = useState(null);
  const [completed, setCompleted] = useState([]);
  const scenario = scenarios.find((item) => item.id === scenarioId);
  const selected = scenario.choices[choice];
  const safeCount = completed.length;
  function choose(index) {
    setChoice(index);
    if (scenario.choices[index].risk === "safe") setCompleted((old) => old.includes(scenario.id) ? old : [...old, scenario.id]);
  }
  return <section id="decision-lab" className="mimic-decision-card scroll-mt-6">
    <header className="mimic-decision-hero">
      <div><span className="mimic-decision-kicker">MIMIC • HUMAN-CENTRED SIMULATION LAB</span><h2>Try the decision. Not the consequences.</h2><p>Step inside realistic digital moments, choose what you would do, and see the hidden consequence before it happens in real life.</p></div>
      <div className="mimic-decision-score"><strong>{safeCount}/3</strong><span>safe instincts<br/>unlocked</span></div>
    </header>
    <div className="mimic-decision-tabs" role="group" aria-label="Choose a simulation">
      {scenarios.map((item, index) => <button key={item.id} type="button" aria-pressed={scenarioId === item.id} className={scenarioId === item.id ? "active" : ""} onClick={() => { setScenarioId(item.id); setChoice(null); }}><span>{item.icon}</span><small>SIMULATION 0{index + 1}</small><b>{item.title}</b></button>)}
    </div>
    <div className="mimic-decision-stage">
      <div className="mimic-decision-prompt"><span className="mimic-decision-tag">{scenario.tag}</span><h3>{scenario.title}</h3><p>{scenario.setup}</p><span className="mimic-decision-question">WHAT WOULD YOU DO?</span>
        <div className="mimic-decision-choices">{scenario.choices.map((item, index) => <button key={item.label} type="button" className={choice === index ? "chosen" : ""} onClick={() => choose(index)}><span>{String.fromCharCode(65 + index)}</span>{item.label}<b>→</b></button>)}</div>
      </div>
      <aside className={`mimic-decision-feedback ${selected ? selected.risk : "waiting"}`} aria-live="polite">
        {!selected ? <><div className="mimic-decision-orb">◉</div><span className="mimic-decision-tag">CONSEQUENCE PREVIEW</span><h3>Your choice changes the story.</h3><p>Choose an action to reveal what could happen next, why it matters, and a safer move.</p></> : <><span className="mimic-decision-tag">{selected.risk === "safe" ? "✓ SAFE INSTINCT" : selected.risk === "high" ? "⚠ HIGH RISK" : "! THINK AGAIN"}</span><h3>{selected.title}</h3><p>{selected.detail}</p><div className="mimic-decision-next"><b>YOUR NEXT MOVE</b><p>{selected.next}</p></div><button type="button" onClick={() => setChoice(null)}>Try another choice ↗</button></>}
      </aside>
    </div>
    <footer className="mimic-decision-footer"><span>✦ A SAFE PLACE TO MAKE A MISTAKE</span><span>Practice is private. No real accounts, payments or websites are touched.</span></footer>
  </section>;
}
