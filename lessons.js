/*
  LESSONS LIBRARY
  ================
  This is the only file you need to touch to add new content.
  Each lesson is one object in the list below. Copy an existing
  one, change the values, and add it to the array.

  HOW TO GET A YOUTUBE ID:
  Open any YouTube video. The URL looks like:
    https://www.youtube.com/watch?v=dQw4w9WgXcQ
  The part after "v=" is the youtubeId. In this example: dQw4w9WgXcQ

  The page automatically shows one lesson per day, cycling through
  this list in order. Once you reach the end, it loops back to the
  start. So you can always have content "ahead" of today just by
  adding more entries — no need to match dates exactly.
*/

const LESSONS = [
  {
    tag: "Slang of the day",
    phrase: "I'm down for that.",
    meaning: "Means \"I'm in / I agree / let's do it.\" Super common casual way to accept an invite or idea.",
    example: "\u201cWanna grab tacos later?\u201d \u2014 \u201cYeah, I'm down for that.\u201d",
    youtubeId: "1EPQm2fBGkI",
    channel: "Rachel's English"
  },
  {
    tag: "Slang of the day",
    phrase: "That's a lot to unpack.",
    meaning: "Used when something someone said is complicated, surprising, or has a lot going on emotionally.",
    example: "\u201cShe said WHAT to him? Okay, that's a lot to unpack.\u201d",
    youtubeId: "1EPQm2fBGkI",
    channel: "RealLife English"
  },
  {
    tag: "Slang of the day",
    phrase: "No cap.",
    meaning: "Means \"no lie / I'm serious.\" Used to emphasize that you're telling the truth, especially by younger speakers.",
    example: "\u201cThis is the best burger in the city, no cap.\u201d",
    youtubeId: "1EPQm2fBGkI",
    channel: "Go Natural English"
  },
  {
    tag: "Slang of the day",
    phrase: "It is what it is.",
    meaning: "A resigned way of accepting a situation you can't change. Very common, very American, very chill.",
    example: "\u201cWe missed the flight. Oh well, it is what it is.\u201d",
    youtubeId: "1EPQm2fBGkI",
    channel: "Rachel's English"
  },
  {
    tag: "Slang of the day",
    phrase: "I could go for some coffee.",
    meaning: "A soft, casual way to say you want something \u2014 more natural than \"I want.\"",
    example: "\u201cLong day, huh?\u201d \u2014 \u201cYeah, I could go for some coffee.\u201d",
    youtubeId: "1EPQm2fBGkI",
    channel: "RealLife English"
  },
  {
    tag: "Slang of the day",
    phrase: "Let's play it by ear.",
    meaning: "Means you'll decide what to do as things happen, instead of planning now.",
    example: "\u201cWhat time should we meet?\u201d \u2014 \u201cLet's just play it by ear.\u201d",
    youtubeId: "1EPQm2fBGkI",
    channel: "Go Natural English"
  },
  {
    tag: "Slang of the day",
    phrase: "That hit different.",
    meaning: "Used when something felt unusually good, powerful, or emotional \u2014 more than expected.",
    example: "\u201cThat sunset hit different tonight.\u201d",
    youtubeId: "1EPQm2fBGkI",
    channel: "Rachel's English"
  }
];
