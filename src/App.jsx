import { useEffect, useState } from "react";
import Welcome from "./components/Welcome";
import ModeSelector from "./components/ModeSelector";
import Dashboard from "./pages/Dashboard";

const DEFAULT_APPEARANCE = { darkMode: false, highContrast: false, accentTheme: "blue" };

function readAppearance() {
  try {
    const saved = JSON.parse(localStorage.getItem("mimic-appearance") || "null");
    if (saved) return { ...DEFAULT_APPEARANCE, ...saved };
    const legacy = JSON.parse(localStorage.getItem("mimic-settings") || "{}");
    return {
      darkMode: !!legacy.darkMode,
      highContrast: !!legacy.highContrast,
      accentTheme: "blue",
    };
  } catch {
    return DEFAULT_APPEARANCE;
  }
}

function App() {
  const [screen, setScreen] = useState("welcome");
  const [mode, setMode] = useState("visual");
  const [appearance, setAppearance] = useState(readAppearance);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("mimic-high-contrast", !!appearance.highContrast);
    root.classList.toggle("mimic-dark-mode", !!appearance.darkMode && !appearance.highContrast);
    root.classList.toggle("mimic-light-mode", !appearance.darkMode && !appearance.highContrast);
    root.dataset.mimicTheme = appearance.accentTheme || "blue";
    try { localStorage.setItem("mimic-appearance", JSON.stringify(appearance)); } catch { /* Private browsing may block storage. */ }
  }, [appearance]);

  function selectMode(selectedMode) {
    setMode(selectedMode);
    setScreen("dashboard");
  }

  if (screen === "welcome") {
    return <Welcome onStart={() => setScreen("select")} appearance={appearance} onAppearanceChange={setAppearance} />;
  }
  if (screen === "select") {
    return <ModeSelector onSelect={selectMode} appearance={appearance} onAppearanceChange={setAppearance} />;
  }
  return <Dashboard mode={mode} appearance={appearance} onAppearanceChange={setAppearance} onChangeMode={() => setScreen("select")} />;
}

export default App;
