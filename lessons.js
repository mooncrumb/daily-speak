/*
  LESSONS LIBRARY — Daily Speak
  ==============================
  Each transcript line has a `t` (time in seconds).
  Highlighted phrases get pink glow.
*/

const DAILY_SLANG = [
  "no cap fr fr",
  "it's giving main character",
  "lowkey obsessed",
  "bet, let's do it",
  "that's so slay",
  "iykyk",
  "i'm dead 💀",
  "she ate that",
  "vibing hard",
  "period.",
  "not me learning english",
  "fr this is fire"
];

const LESSONS = [
  {
    youtubeId: "Pz68t3RGeqI",
    channel: "Sydney Serena",
    videoTitle: "Fall vlog — Starbucks, getting ready, doing my nails",
    scene: "A young American vlogger's chill Saturday — getting ready, Starbucks run, painting nails.",
    transcript: [
      { t: 0,   text: "hey guys it's Sid and welcome back" },
      { t: 12,  text: "today I just know it's going to be a really good day because I am going to start out by going to Starbucks" },
      { t: 19,  text: "they came out with their new fall drinks yesterday I just have to go" },
      { t: 23,  text: "and then I have a few things I need to get down on my to-do list that I'm going to take you guys along with me" },
      { t: 27,  text: "it's a sunny day and sunny day just honestly make my mood 10 times better" },
      { t: 32,  text: "I'm one of those people that the weather really affects my mood" },
      { t: 36,  text: "look how nice it looks out today so sunny" },
      { t: 43,  text: "this is one of my first times using the glow drops by drunk elephant and I actually love them" },
      { t: 47,  text: "I don't really know exactly what the day holds but it's more fun that way" },
      { t: 58,  text: "okay my makeup is done it's definitely very glowy today" },
      { t: 64,  text: "but now I'm going to pick out my fit for today" },
      { t: 67,  text: "I don't know what to wear I think some color could be fun" },
      { t: 71,  text: "otherwise I could wear the skims bodysuit but I kind of want to wear a little bit more color today" },
      { t: 75,  text: "I tend to gravitate toward more neutral colors when I dress" },
      { t: 79,  text: "I've been trying to like be more fun" },
      { t: 81,  text: "okay I've been trying to have more color in my wardrobe" },
      { t: 84,  text: "so yeah I'm going to wear this for today" },
      { t: 86,  text: "and then I'm wearing these pants these I got from aritzia when I was in New York" },
      { t: 90,  text: "for jewelry I'm going to throw on a few rings today" },
      { t: 95,  text: "okay guys should I wear these heart earrings or my gold hoops" },
      { t: 100, text: "I just feel like I always wear hoops and I want to switch it up" },
      { t: 104, text: "but I honestly can't they are a staple for a reason" },
      { t: 108, text: "getting ready just makes me feel better" },
      { t: 111, text: "I honestly don't even really need to get ready I just enjoy getting ready for my day" },
      { t: 115, text: "it really kind of like gives me a bit of a routine and just keeps me motivated" },
      { t: 120, text: "oh before I go you guys I just got these new shoes I love them" },
      { t: 124, text: "I was on the wait list for so long so these are the SAS by Adidas" },
      { t: 132, text: "I'm at Starbucks you guys know I usually get the same thing the strawberry refresher" },
      { t: 137, text: "but yesterday I came here because the fall drinks came out and I had the pumpkin chai and it was so so good" },
      { t: 144, text: "I feel like I'm just going to be drinking that on rotation now" },
      { t: 147, text: "I just get obsessed with the drink for a while I let it run its course" },
      { t: 152, text: "then once I'm sick of it I replace it with something else" },
      { t: 156, text: "I also have been trying to see this one girl here I think her name is Drew she watches my videos" },
      { t: 163, text: "so hi if you're watching this and she's so sweet she's always working at the drive-thru" },
      { t: 168, text: "I just like her so much and I get so much PR" },
      { t: 175, text: "there's some foundations some skin care and this super super cute Sally Hansen nail polish kit" },
      { t: 185, text: "you're literally so nice this is too much no no I get so much stuff" },
      { t: 190, text: "yes yes of course I'm going to cry do you want to be in my Vlog" },
      { t: 205, text: "she like makes my day so much better every time I'm there she's so positive so sweet" },
      { t: 213, text: "okay I decided to stop at Target really quick since I got my nails taken off I want to at least paint them" },
      { t: 220, text: "I haven't painted my nails in so long like I can't remember the last time" },
      { t: 234, text: "I think I'm going to get this one I've been seeing this like on my social media" },
      { t: 238, text: "it's by OPI it's in the shade mod about you and I feel like it's just like the perfect ballet pink color" },
      { t: 245, text: "there was only one left so that means it was a sign" },
      { t: 249, text: "the best thing Target's ever done was get an Ulta put in I feel like I spend so much money here" },
      { t: 285, text: "this is a Sally Hansen nail fortifier this is life-changing if you have brittle nails" },
      { t: 293, text: "especially like whenever I get my acrylics taken off my nails are really weak" },
      { t: 296, text: "I just put a couple coats of this on and my nails are just less likely to break" },
      { t: 306, text: "so oh God I'm actually like I'm probably going to be really bad" },
      { t: 353, text: "I did have to have my mom help me I was just struggling severely" },
      { t: 380, text: "I'm the worst with gifts you know I'm going to rephrase that I'm actually pretty good" },
      { t: 385, text: "I get them in advance I try to be pretty thoughtful but this time I messed up" }
    ],
    highlights: [
      {
        phrase: "switch it up",
        note: "Casual way to say 'try something different'. Use for outfits, food, routines — anything you always do the same way.",
        sound: "'switch it' blends together — sounds like 'switchit up'."
      },
      {
        phrase: "a staple for a reason",
        note: "Something's a classic because it works. Say this when you try to change and end up back with the original.",
        sound: "'staple' = STAY-pul. Say the whole phrase like one thought, no pause."
      },
      {
        phrase: "I've been trying to",
        note: "Everyday way to talk about a habit you're working on. Way more natural than 'I want to' or 'I try to'.",
        sound: "'I've been' often sounds like 'I've bin', very fast."
      },
      {
        phrase: "on rotation",
        note: "Something you use / listen to / drink again and again for a while. Not just once — it's your current obsession.",
        sound: "Say 'on-ro-TAY-shun', stress on TAY."
      },
      {
        phrase: "let it run its course",
        note: "Let something finish naturally — don't force it to stop. Used for feelings, obsessions, phases.",
        sound: "'run its' sounds like 'runits' — no gap."
      },
      {
        phrase: "life-changing",
        note: "American exaggeration for 'really good'. Doesn't literally mean it changed your life — just means you love it.",
        sound: "Stress on LIFE. Say it dramatic — that's the whole vibe."
      }
    ]
  }
];
