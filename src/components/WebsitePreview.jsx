
import { useState } from "react";
import { scanDocument } from "../mirror/mirror-scanner.js";

export default function WebsitePreview({ mode }) {
  const [view, setView] = useState("adapted");

  const isHindi = mode === "hindi";

  return (
    <section className="bg-white rounded-2xl shadow-md p-6 space-y-5">
      <div>
        <p className="text-blue-600 font-semibold text-sm">
          MIMIC UNIVERSAL ADAPTATION
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-2">
          {isHindi
            ? "वेबसाइट को बदलते हुए देखें"
            : "See How MIMIC Transforms Websites"}
        </h2>

        <p className="text-gray-600 mt-2">
          {isHindi
            ? "एक ही वेबसाइट के मूल और आसान अनुभव की तुलना करें।"
            : "Compare a complicated website with an accessible experience."}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setView("original")}
          className={`px-5 py-3 rounded-xl font-semibold ${
            view === "original"
              ? "bg-gray-800 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {isHindi ? "मूल वेबसाइट" : "Original Website"}
        </button>

        <button
          onClick={() => setView("adapted")}
          className={`px-5 py-3 rounded-xl font-semibold ${
            view === "adapted"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {isHindi ? "MIMIC अनुभव" : "MIMIC Experience"}
        </button>
      </div>

      <div className="border rounded-xl overflow-hidden">
        <div className="bg-gray-100 border-b px-4 py-3 flex justify-between items-center">
          <span className="font-semibold text-gray-700">
            {isHindi ? "पीएम विद्यालक्ष्मी पोर्टल" : "PM Vidya Lakshmi Portal"}
          </span>

          <span className="text-xs text-gray-500">
            {view === "original" ? "Original" : "Adapted by MIMIC"}
          </span>
        </div>

        {view === "original" ? (
          <div className="p-5 bg-gray-50 text-gray-700 space-y-3">
            <h3 className="text-lg font-bold">
              {isHindi
                ? "पीएम विद्यालक्ष्मी शिक्षा ऋण पोर्टल"
                : "PM Vidya Lakshmi Portal – Education Loan Application"}
            </h3>

            <p className="text-xs">
              APPLICATION GUIDELINES | ELIGIBILITY | DOCUMENTATION |
              INSTRUCTIONS | TERMS AND CONDITIONS
            </p>

            <p className="text-sm leading-5">
              Applicants are required to submit all relevant
              documentation and supporting certificates prior to
              the prescribed deadline. Incomplete applications
              may be subject to rejection.
            </p>

            <p className="text-sm">
              Registration ID: __________
            </p>

            <p className="text-sm">
              Applicant category: __________
            </p>

            <p className="text-sm">
              Upload supporting documentation.
            </p>

            <button className="bg-gray-700 text-white px-4 py-2 text-sm">
              Submit Application
            </button>
          </div>
        ) : (
          <div className="p-6 bg-blue-50 text-gray-900 space-y-5">
            <div>
              <span className="text-sm text-blue-700 font-semibold">
                {isHindi ? "आसान अनुभव" : "EASY EXPERIENCE"}
              </span>

              <h3 className="text-2xl font-bold mt-2">
                {isHindi
                  ? "पीएम विद्यालक्ष्मी के लिए आवेदन करें"
                  : "Apply on PM Vidya Lakshmi"}
              </h3>

              <p className="mt-2 text-gray-700">
                {isHindi
                  ? "अपना आवेदन पूरा करने के लिए ये आसान चरण अपनाएं।"
                  : "Follow these simple steps to complete your application."}
              </p>
            </div>

            <div className="space-y-3">
              {[
                isHindi
                  ? "अपना नाम और व्यक्तिगत जानकारी भरें।"
                  : "Enter your name and personal details.",
                isHindi
                  ? "अपने आवश्यक दस्तावेज़ अपलोड करें।"
                  : "Upload your required documents.",
                isHindi
                  ? "अपना आवेदन जांचें और जमा करें।"
                  : "Review and submit your application.",
              ].map((step, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 bg-white p-4 rounded-xl"
                >
                  <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">
                    {index + 1}
                  </span>

                  <p className="font-medium pt-1">{step}</p>
                </div>
              ))}
            </div>

            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl">
              {isHindi ? "आवेदन शुरू करें" : "Start Application"}
            </button>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500">
        Demonstration using sample content. Real website adaptation
        will be connected through the MIMIC browser extension.
      </p>
    </section>
  );
}
