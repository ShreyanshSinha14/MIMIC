
export default function Navbar({ mode, onChangeMode }) {
  const modeNames = {
    visual: "Visual Accessibility",
    hindi: "Hindi / Easy Language",
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 sm:py-5">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">

        {/* MIMIC Branding */}
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-700">
            MIMIC
          </h1>

          <p className="text-xs sm:text-sm text-gray-500">
            Technology that understands you.
          </p>
        </div>

        {/* Mode and Action */}
        <div className="flex items-center gap-2 sm:gap-4">

          <span className="hidden md:block text-sm text-gray-600 font-medium">
            {modeNames[mode] || "Select a Mode"}
          </span>

          <button
            type="button"
            onClick={onChangeMode}
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm sm:text-base px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            aria-label={`Change current mode: ${modeNames[mode] || mode}`}
          >
            Change Mode
          </button>

        </div>

      </div>

      {/* Mobile Mode Information */}
      <div className="md:hidden max-w-7xl mx-auto mt-3">
        <p className="text-xs text-gray-500">
          Current Mode: {modeNames[mode] || "Select a Mode"}
        </p>
      </div>

    </header>
  );
}
