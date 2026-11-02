import { simplifyLocally } from "../engines/simplifier.js";

const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const REQUEST_TIMEOUT = 20000;

function extractText(data) {
  if (typeof data === "string") return data.trim();
  const value = data?.simplified_text ?? data?.translated_text ?? data?.result ?? data?.text ?? data?.output;
  return typeof value === "string" ? value.trim() : "";
}

async function post(path, payload) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  try {
    const response = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data?.message || `Request failed (${response.status})`);
    return data;
  } finally {
    clearTimeout(timer);
  }
}

export function detectLanguage(text) {
  if (/\p{Script=Devanagari}/u.test(text)) return "hi";
  if (/\p{Script=Bengali}/u.test(text)) return "bn";
  if (/\p{Script=Tamil}/u.test(text)) return "ta";
  if (/\p{Script=Telugu}/u.test(text)) return "te";
  if (/\p{Script=Gujarati}/u.test(text)) return "gu";
  if (/\p{Script=Gurmukhi}/u.test(text)) return "pa";
  if (/\p{Script=Kannada}/u.test(text)) return "kn";
  if (/\p{Script=Malayalam}/u.test(text)) return "ml";
  if (/\p{Script=Arabic}/u.test(text)) return "ur";
  if (/\p{Script=Latin}/u.test(text)) return "en";
  return "en";
}


async function translateWithPublicFallback(text, sourceLanguage, targetLanguage) {
  // MyMemory provides a no-key demo translation path so a fresh install works
  // without requiring users to configure a private MIMIC server.
  const pieces = text.match(/[\s\S]{1,430}(?:\s|$)/g) || [text];
  const translated = [];
  for (const piece of pieces) {
    const query = new URLSearchParams({ q: piece, langpair: `${sourceLanguage}|${targetLanguage}` });
    const response = await fetch(`https://api.mymemory.translated.net/get?${query.toString()}`, {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error(`Translation service returned ${response.status}.`);
    const data = await response.json();
    const output = data?.responseData?.translatedText;
    if (!output || data?.responseStatus >= 400) throw new Error("The translation service could not translate this text.");
    translated.push(output);
  }
  return translated.join(" ").trim();
}

const QUICK_GLOSSARY = {
  eligibility: "The rules you must meet to qualify.", documentation: "The papers or files you need to provide.", mandatory: "Something you must do; it is not optional.", provisional: "Temporary; it may change after checking.", discrepancy: "A difference between two pieces of information.", authenticate: "To prove that you are really you.", beneficiary: "The person who receives help or money.", subsidised: "Made cheaper with support from the government or another organisation.", jurisdiction: "The area or authority that has the power to make a decision.", indemnity: "A promise to cover certain losses or costs.", affidavit: "A written statement that you formally declare is true.", undertaking: "A formal promise to do something.", applicant: "The person who is asking for something.", assessment: "A check used to understand or judge something.", verification: "A check to confirm that information is correct.", deadline: "The last date or time to finish something.", credentials: "Private details used to sign in, such as a password.", consent: "Your clear permission to do something.", शुल्क: "किसी सेवा या काम के लिए दिया जाने वाला पैसा।", पात्रता: "किसी योजना या सुविधा को पाने की योग्यता।", अनिवार्य: "जो काम करना ज़रूरी हो।", सत्यापन: "यह जाँचना कि जानकारी सही है या नहीं।", आवेदन: "किसी चीज़ के लिए किया गया अनुरोध।"
};

export async function explainVocabulary(text, language = "en") {
  const clean = text.trim();
  const words = [...new Set((clean.match(/[\p{L}\p{M}]{4,}/gu) || []).map((word) => word.toLowerCase()))].slice(0, 12);
  const items = [];
  for (const word of words) {
    if (QUICK_GLOSSARY[word]) { items.push({ word, meaning: QUICK_GLOSSARY[word] }); continue; }
    if (language === "en") {
      try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
        if (!response.ok) continue;
        const data = await response.json();
        const meaning = data?.[0]?.meanings?.[0]?.definitions?.[0]?.definition;
        if (meaning) items.push({ word, meaning });
      } catch { /* Continue with other words; this feature degrades gracefully. */ }
    }
  }
  if (!items.length) return { text: language === "hi" ? "इस पाठ में समझाने योग्य शब्दों की स्थानीय सूची नहीं मिली। कोई खास शब्द चुनकर छोटा इनपुट दें।" : "I couldn't find definitions for these words in the built-in glossary. Try selecting a shorter passage or use Simplify for a plain-language rewrite.", source: "glossary" };
  const heading = language === "hi" ? "आसान शब्दों में अर्थ:" : "Words explained simply:";
  return { text: `${heading}\n\n${items.map(({ word, meaning }) => `• ${word}: ${meaning}`).join("\n")}`, source: "dictionary" };
}

/** Process text through the configured MIMIC service. Translation is never faked offline. */
export async function processText({ text, action = "simplify", sourceLanguage = "auto", targetLanguage = "same", level = "simple" }) {
  const detectedLanguage = sourceLanguage === "auto" ? detectLanguage(text) : sourceLanguage;
  const target = targetLanguage === "same" ? detectedLanguage : targetLanguage;
  const effectiveAction = target !== detectedLanguage ? "translate" : action;

  if (API_URL) {
    const payload = {
      text,
      action: effectiveAction,
      source_language: detectedLanguage,
      target_language: target,
      language: target,
      level,
    };

    // Preferred unified API. Separate endpoints keep compatibility with existing deployments.
    try {
      const data = await post("/process", payload);
      const output = extractText(data);
      if (output) return { text: output, source: "ai", detectedLanguage, targetLanguage: target };
    } catch (error) {
      if (error?.name === "AbortError") throw new Error("The AI request took too long. Please try again.");
    }

    try {
      const endpoint = effectiveAction === "translate" ? "/translate" : "/simplify";
      const data = await post(endpoint, payload);
      const output = extractText(data);
      if (output) return { text: output, source: "ai", detectedLanguage, targetLanguage: target };
    } catch (error) {
      // If the private backend is unavailable, translation falls through to
      // the clearly disclosed community-service fallback below.
      if (error?.name === "AbortError") console.warn("MIMIC translation endpoint timed out; trying community fallback.");
    }
  }

  if (effectiveAction === "translate" && target !== detectedLanguage) {
    try {
      const translated = await translateWithPublicFallback(text, detectedLanguage, target);
      if (translated) return { text: translated, source: "community-translation", detectedLanguage, targetLanguage: target };
    } catch (error) {
      throw new Error(`Live translation is temporarily unavailable. Check your internet connection and try again. (${error.message})`);
    }
  }

  const simplified = simplifyLocally(text, target);
  if (!simplified) throw new Error("Could not simplify this text.");
  return { text: simplified, source: "offline", detectedLanguage, targetLanguage: target };
}

// Backwards-compatible API for other website components.
export async function simplifyText(text, language = "en") {
  const result = await processText({ text, action: "simplify", sourceLanguage: language, targetLanguage: language });
  return { simplified_text: result.text, source: result.source };
}
