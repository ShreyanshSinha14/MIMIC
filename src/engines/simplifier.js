// Offline, rule-based text simplifier.
// Used automatically when the MIMIC backend (/simplify) is not reachable,
// so the "Simplify Text" button always works.

const EN_REPLACEMENTS = [
  [/\bprior to\b/gi, "before"],
  [/\bsubsequent to\b/gi, "after"],
  [/\bin order to\b/gi, "to"],
  [/\bin the event that\b/gi, "if"],
  [/\bwith regard to\b|\bwith respect to\b|\bpertaining to\b/gi, "about"],
  [/\bdue to the fact that\b|\bowing to the fact that\b/gi, "because"],
  [/\bat this point in time\b|\bat the present time\b/gi, "now"],
  [/\bin the absence of\b/gi, "without"],
  [/\bis required to\b|\bare required to\b/gi, "must"],
  [/\bis obligated to\b|\bare obligated to\b/gi, "must"],
  [/\bit is mandatory\b/gi, "you must"],
  [/\bshall\b/gi, "must"],
  [/\bprescribed deadline\b/gi, "deadline"],
  [/\bapproximately\b/gi, "about"],
  [/\bcommence\b|\binitiate\b/gi, "start"],
  [/\bterminate\b/gi, "end"],
  [/\bpurchase\b/gi, "buy"],
  [/\bassistance\b/gi, "help"],
  [/\bobtain\b|\bacquire\b/gi, "get"],
  [/\brequire\b/gi, "need"],
  [/\brequirements?\b/gi, "needs"],
  [/\bsubmit\b/gi, "send"],
  [/\bsubmission\b/gi, "sending"],
  [/\butili[sz]e\b/gi, "use"],
  [/\bendeavou?r\b/gi, "try"],
  [/\bdemonstrate\b/gi, "show"],
  [/\bindicate\b/gi, "show"],
  [/\bsufficient\b/gi, "enough"],
  [/\badditional\b/gi, "more"],
  [/\bnumerous\b/gi, "many"],
  [/\bsubstantial\b/gi, "large"],
  [/\bfacilitate\b/gi, "help"],
  [/\bfurthermore\b|\bmoreover\b|\badditionally\b/gi, "Also,"],
  [/\bhowever\b/gi, "but"],
  [/\btherefore\b|\bconsequently\b|\bhence\b/gi, "so"],
  [/\bnotwithstanding\b/gi, "despite"],
  [/\bhereby\b|\bherein\b|\bthereof\b|\bwherein\b/gi, ""],
  [/\bapplicants?\b/gi, "you"],
  [/\bdocumentation\b/gi, "documents"],
  [/\bsupporting certificates\b/gi, "certificates"],
  [/\bincomplete\b/gi, "unfinished"],
  [/\bmay be subject to rejection\b/gi, "can be rejected"],
  [/\bsubject to\b/gi, "depending on"],
  [/\bremuneration\b/gi, "pay"],
  [/\bcommunicate\b/gi, "tell"],
  [/\bascertain\b/gi, "find out"],
  [/\bapprove\b/gi, "accept"],
  [/\bendorse\b/gi, "support"],
  [/\bsupplementary\b/gi, "extra"],
];

const HI_REPLACEMENTS = [
  [/पूर्वोक्त/g, "ऊपर बताया गया"],
  [/तदनुसार/g, "इसलिए"],
  [/अनिवार्य रूप से/g, "ज़रूर"],
  [/अनिवार्य/g, "ज़रूरी"],
  [/प्रस्तुत करना/g, "जमा करना"],
  [/प्रस्तुत करें/g, "जमा करें"],
  [/संलग्न करें/g, "साथ लगाएँ"],
  [/आवश्यकता/g, "ज़रूरत"],
  [/आवश्यक/g, "ज़रूरी"],
  [/उपर्युक्त/g, "ऊपर लिखा"],
  [/निर्धारित/g, "तय"],
  [/समयसीमा/g, "आख़िरी तारीख़"],
  [/अंतिम तिथि/g, "आख़िरी तारीख़"],
  [/पात्रता/g, "योग्यता"],
  [/अपूर्ण/g, "अधूरा"],
  [/निरस्त/g, "रद्द"],
  [/प्रदान करें/g, "दें"],
  [/प्राप्त करना/g, "पाना"],
  [/प्राप्त करें/g, "पाएँ"],
  [/सम्बंधित|संबंधित/g, "जुड़ा"],
  [/प्रक्रिया/g, "तरीका"],
  [/सत्यापित/g, "जाँचा हुआ"],
  [/दस्तावेज़ों/g, "काग़ज़ों"],
  [/दस्तावेज़|दस्तावेज/g, "काग़ज़"],
];

function cleanup(s) {
  return s
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .replace(/,\s*,/g, ",")
    .replace(/\b(\w+)\s+\1\b/gi, "$1")
    .replace(/^\s*[,;]\s*/, "")
    .trim();
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function splitLongSentence(sentence, isHindi) {
  const words = sentence.split(/\s+/);
  if (words.length <= 18) return [sentence];

  const parts = isHindi
    ? sentence.split(/\s*(?:,|;|—|और फिर|लेकिन|परंतु|किंतु)\s+/)
    : sentence.split(/\s*(?:;|—|,\s+(?:and|but|which|while|whereas|so|or)\b|\s+(?:and|but|which|while|whereas)\s+)\s*/i);

  return parts
    .map((p) => cleanup(p))
    .filter((p) => p.split(/\s+/).length >= 3);
}

export function simplifyLocally(text, language = "en") {
  const isHindi = language === "hi" || /[\u0900-\u097F]/.test(text);
  const isEnglish = language === "en" || !language;
  // Never run English replacement rules over an unsupported language: preserving
  // the user's original words is safer than producing a misleading rewrite.
  if (!isHindi && !isEnglish) return text.trim();
  const rules = isHindi ? HI_REPLACEMENTS : EN_REPLACEMENTS;

  let t = text.replace(/\r/g, "").replace(/\(([^)]{0,120})\)/g, ", $1,");
  for (const [pattern, replacement] of rules) {
    t = t.replace(pattern, replacement);
  }

  const sentences = t
    .split(/(?<=[.!?।])\s+|\n+/)
    .map(cleanup)
    .filter(Boolean);

  const lines = [];
  for (const sentence of sentences) {
    const pieces = splitLongSentence(sentence.replace(/[.!?।]+$/, ""), isHindi);
    for (const piece of pieces) {
      const p = isHindi ? piece : capitalize(piece);
      lines.push(p + (isHindi ? "।" : "."));
    }
  }

  if (!lines.length) return "";
  const heading = isHindi ? "मुख्य बातें:" : "Key points:";
  return heading + "\n" + lines.map((l) => "• " + l).join("\n");
}
