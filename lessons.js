/*
  LESSONS LIBRARY — Daily Speak
  ==============================
  Each lesson = 1 video + full transcript excerpt + highlighted phrases.

  Structure:
  {
    youtubeId: "...",              // YouTube video ID (from URL after v=)
    channel: "creator name",       // who made the video
    videoTitle: "...",             // for reference
    scene: "one line about what's happening in this clip",
    transcript: [                  // full transcript excerpt as an array of lines
      "line 1",
      "line 2",
      ...
    ],
    highlights: [                  // phrases to focus on
      {
        phrase: "the exact phrase",
        note: "short English note on when/how to say it",
        sound: "pronunciation tip"
      }
    ]
  }

  To add a new lesson, copy an existing one and change the values.
  The page auto-picks one lesson per day.
*/

const LESSONS = [
  {
    youtubeId: "Pz68t3RGeqI",
    channel: "Sydney Serena",
    videoTitle: "Fall vlog — Starbucks, getting ready, doing my nails",
    scene: "A young American vlogger picking her outfit for the day.",
    transcript: [
      "I don't know what to wear. I think some color could be fun.",
      "I've been trying to like be more fun.",
      "I've been trying to have more color in my wardrobe.",
      "Should I wear these heart earrings or my gold hoops?",
      "I just feel like I always wear hoops and I want to switch it up.",
      "I honestly can't. They are a staple for a reason."
    ],
    highlights: [
      {
        phrase: "switch it up",
        note: "Casual way to say 'try something different' or 'change my usual thing'. Use it for outfits, food, routines, anything you always do the same way.",
        sound: "'switch it' blends together — sounds like 'switchit up'."
      },
      {
        phrase: "a staple for a reason",
        note: "Something's a classic because it works. You say this when you try to change and end up back with the original.",
        sound: "'staple' = STAY-pul. Say the phrase like one thought, no pause."
      },
      {
        phrase: "I've been trying to...",
        note: "Everyday way to talk about a habit you're working on. Way more natural than 'I want to' or 'I try to'.",
        sound: "'I've been' often sounds like 'I've bin', very fast."
      }
    ]
  }
];
