
import { useState } from "react";

const menuItems = [
  { icon: "🏠", title: "Overview", link: "#overview" },
  { icon: "✨", title: "AI Language Helper", link: "#ai-helper" },
  { icon: "🧩", title: "Personalise my experience", link: "#user-needs" },
  { icon: "♿", title: "Accessibility controls", link: "#accessibility" },
  { icon: "🧭", title: "Mission Rehearsal", link: "#mission-rehearsal" },
  { icon: "🎮", title: "Decision Lab", link: "#decision-lab" },
  { icon: "🔗", title: "Connect a website", link: "#website-connector" },
];

export default function Sidebar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <aside className="w-full md:w-64 md:min-h-screen bg-slate-950 text-white md:p-6">

      {/* Mobile Menu Header */}
      <div className="flex items-center justify-between p-4 md:hidden">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-300">
          Main Menu
        </h2>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="sidebar-navigation"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          className="px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-blue-400"
        >
          {menuOpen ? "✕ Close" : "☰ Menu"}
        </button>
      </div>

      {/* Desktop Menu Heading */}
      <h2 className="hidden md:block text-sm uppercase tracking-widest text-slate-400 mb-6">
        Main Menu
      </h2>

      {/* Navigation */}
      <nav
        id="sidebar-navigation"
        className={`${
          menuOpen ? "block" : "hidden"
        } md:block px-4 pb-4 md:p-0`}
      >
        <div className="space-y-2">
          {menuItems.map((item) => (
            <a
              key={item.title}
              href={item.link}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-4 p-4 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition focus-visible:outline-2 focus-visible:outline-blue-400"
            >
              <span className="text-xl" aria-hidden="true">
                {item.icon}
              </span>

              <span className="font-medium">
                {item.title}
              </span>
            </a>
          ))}
        </div>

        {/* MIMIC Support */}
        <div className="mt-6 md:mt-12 p-4 bg-slate-900 rounded-xl">
          <p className="font-semibold text-blue-400">
            MIMIC Support
          </p>

          <p className="text-sm text-slate-400 mt-2">
            Making technology accessible for everyone.
          </p>
        </div>
      </nav>

    </aside>
  );
}
