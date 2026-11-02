export function parseAnnouncement(text) {
  const lower = text.toLowerCase();
  const isHindi = /[\u0900-\u097F]/.test(text);

  // HINDI ANNOUNCEMENT PARSER
  if (isHindi) {
    let location = "उल्लेख नहीं किया गया";
    let time = "उल्लेख नहीं किया गया";
    let date = "उल्लेख नहीं किया गया";
    let urgency = "सामान्य";

    if (text.includes("कल")) {
      date = "कल";
    } else if (text.includes("आज")) {
      date = "आज";
    }

    const roomMatch = text.match(
      /(?:कमरा|कक्ष)(?:\s*संख्या)?\s*(\d+)/
    );

    if (roomMatch) {
      location = "कमरा " + roomMatch[1];
    }

    const timeMatch = text.match(
      /(\d{1,2})(?::(\d{2}))?\s*बजे/
    );

    if (timeMatch) {
      time = timeMatch[0];
    }

    if (
      ["आपातकाल", "आग", "तुरंत", "खतरा", "निकासी"].some(
        (word) => text.includes(word)
      )
    ) {
      urgency = "उच्च";
    } else if (
      ["महत्वपूर्ण", "अनिवार्य"].some(
        (word) => text.includes(word)
      )
    ) {
      urgency = "महत्वपूर्ण";
    }

    return {
      title: "घोषणा",
      action:
        location !== "उल्लेख नहीं किया गया"
          ? location + " में जाएँ"
          : "घोषणा की जानकारी देखें",
      date,
      location,
      time,
      urgency
    };
  }

  // ENGLISH ANNOUNCEMENT PARSER
  let location = "Not specified";
  let time = "Not specified";
  let urgency = "Normal";
  let date = "Not specified";

  if (lower.includes("tomorrow")) {
    date = "Tomorrow";
  } else if (lower.includes("today")) {
    date = "Today";
  } else {
    const days = [
      "monday", "tuesday", "wednesday",
      "thursday", "friday", "saturday", "sunday"
    ];

    const foundDay = days.find((day) => lower.includes(day));

    if (foundDay) {
      date = foundDay.charAt(0).toUpperCase() + foundDay.slice(1);
    }
  }

  const roomMatch = text.match(
    /\broom\s*(?:number\s*)?(\d+)\b/i
  );

  if (roomMatch) {
    location = "Room " + roomMatch[1];
  }

  const timeMatch = text.match(
    /\b\d{1,2}(?::\d{2})?\s*(?:a\.?m\.?|p\.?m\.?)\b/i
  );

  if (timeMatch) {
    time = timeMatch[0].toUpperCase().replace(/\./g, "");
  }

  if (
    [
      "emergency", "immediately", "urgent",
      "evacuate", "fire", "danger"
    ].some((word) => lower.includes(word))
  ) {
    urgency = "High";
  } else if (
    ["important", "attention", "mandatory", "compulsory"].some(
      (word) => lower.includes(word)
    )
  ) {
    urgency = "Important";
  }

  return {
    title: lower.includes("exam")
      ? "Examination Announcement"
      : lower.includes("meeting")
      ? "Meeting Announcement"
      : lower.includes("class")
      ? "Class Announcement"
      : lower.includes("holiday")
      ? "Holiday Announcement"
      : lower.includes("emergency") || lower.includes("fire")
      ? "Emergency Announcement"
      : "General Announcement",

    action:
      location !== "Not specified"
        ? "Go to " + location
        : "Check the announcement details",

    date,
    location,
    time,
    urgency
  };
}

