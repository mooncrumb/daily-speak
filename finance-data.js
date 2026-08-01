/*
  FINANCE / MARKETING / DATA library
  One concept a day. Life-relevant, not textbook.
*/

const CONCEPTS = [
  {
    category: "finance",
    title: "compound interest",
    hook: "your money makes money, then that money makes money.",
    explain: "if you put $100 in an account earning 10% a year, next year you have $110. year after? $121. year after that? $133. the growth speeds up because you're earning on your earnings, not just the original. this is why starting to save at 22 crushes starting at 32.",
    tag: "the money multiplier"
  },
  {
    category: "marketing",
    title: "the halo effect",
    hook: "if one thing is good, we assume everything is good.",
    explain: "attractive people are rated as smarter. brands with a pretty logo are trusted more. a well-designed website makes people think the product is better. this is why apple spends so much on packaging — the box shapes what you think of the phone inside.",
    tag: "why aesthetics matter"
  },
  {
    category: "data",
    title: "correlation ≠ causation",
    hook: "two things moving together doesn't mean one causes the other.",
    explain: "ice cream sales go up when shark attacks go up. does ice cream cause sharks? no — both happen more in summer. always ask: what else could explain this? headlines constantly get this wrong on purpose because 'x is linked to y' is more clickable than 'we don't actually know'.",
    tag: "the classic trap"
  },
  {
    category: "finance",
    title: "opportunity cost",
    hook: "every yes to something is a no to everything else.",
    explain: "spending $50 on a dinner isn't just $50. it's $50 not going into savings, not into a class, not into a plane ticket. this isn't about being cheap — it's about knowing what you're actually trading. the real cost of anything is what you gave up to get it.",
    tag: "the hidden cost"
  },
  {
    category: "marketing",
    title: "anchoring",
    hook: "the first number you see rewires what feels normal.",
    explain: "a $2000 handbag next to a $200 one makes the $200 feel reasonable. restaurants put a very expensive wine on the menu to make the mid-priced one look like a steal. the first price you see becomes the anchor. this works for salary negotiations too — whoever says a number first sets the frame.",
    tag: "the number game"
  },
  {
    category: "finance",
    title: "the 50/30/20 rule",
    hook: "a lazy but effective way to split your income.",
    explain: "50% on needs (rent, food, bills), 30% on wants (fun, clothes, coffee), 20% on savings and debt. it's not perfect for everyone but it's a starting point. most people way overshoot the wants category without realizing. tracking one month of spending against this is eye-opening.",
    tag: "money math"
  },
  {
    category: "marketing",
    title: "loss aversion",
    hook: "losing $100 hurts more than winning $100 feels good.",
    explain: "roughly twice as much. that's why 'don't miss out!' works better than 'come get this!'. it's why free trials that require your credit card upfront convert insanely well — once you've 'got' the thing, giving it up feels like a loss. every subscription trap is built on this.",
    tag: "why we can't cancel"
  },
  {
    category: "data",
    title: "survivorship bias",
    hook: "you only see the winners. the losers disappeared quietly.",
    explain: "'college dropouts who became billionaires' is a real list. what you don't see: millions of dropouts who did not become billionaires. same with 'i quit my job to follow my passion and it worked!' stories. we hear from the survivors, never the failures. this is why 'successful people say' advice is often useless.",
    tag: "the missing data"
  },
  {
    category: "finance",
    title: "lifestyle inflation",
    hook: "the more you make, the more you spend — usually.",
    explain: "get a raise, upgrade the apartment. get another raise, upgrade the car. before you know it, making $150k feels as tight as making $60k did. the trick: when your income jumps, keep your lifestyle the same for 6 months. bank the difference. this is how people actually get rich — not by making more, but by not spending more.",
    tag: "the sneaky trap"
  },
  {
    category: "marketing",
    title: "social proof",
    hook: "we do what other people do, even when it's dumb.",
    explain: "empty restaurants feel wrong. amazon products with 3 reviews feel risky. a tiktok with 3M likes feels worth watching. this is why 'as seen on tv', '#1 bestseller', and follower counts matter — proof that someone else already vouched. we outsource our judgment to the crowd. mostly useful, occasionally disastrous.",
    tag: "the herd instinct"
  },
  {
    category: "data",
    title: "sample size matters",
    hook: "asking 5 friends is not research.",
    explain: "if you flip a coin 4 times and get 3 heads, does that mean it's a 75% heads coin? no, it means you didn't flip enough times. same with any 'trend' based on small numbers. '3 of my friends bought this and love it' is not evidence. neither is 'i tried it once and it worked'. the more data, the more reliable the pattern.",
    tag: "small numbers lie"
  },
  {
    category: "finance",
    title: "the emergency fund",
    hook: "3 months of expenses in cash. non-negotiable.",
    explain: "before investing, before splurging, before anything — have enough saved to cover 3 months if your income vanishes tomorrow. this is not exciting money. it's not making you rich. its whole job is to keep you from having to sell your investments, take on credit card debt, or panic-take a bad job when life happens. and life happens.",
    tag: "the safety net"
  },
  {
    category: "marketing",
    title: "scarcity",
    hook: "if it's rare, we want it more.",
    explain: "'only 3 left!' 'sale ends tonight!' 'exclusive drop!' — scarcity messaging works because our brains treat 'rare' as 'valuable'. often it's fake (that timer resets tomorrow). sometimes it's real (limited edition drops). either way, notice when it's being used on you. real question: would i want this if there were 10,000 of them?",
    tag: "the fomo lever"
  },
  {
    category: "data",
    title: "the base rate",
    hook: "context turns scary numbers into normal ones.",
    explain: "'shark attacks up 300% this year!' scary — until you learn that means 4 attacks instead of 1. always ask: what's the base rate? '10 people got sick from this product' matters totally differently if 100 people used it vs 10 million. big scary percentages hide small absolute numbers all the time.",
    tag: "the missing denominator"
  },
  {
    category: "finance",
    title: "the credit score",
    hook: "your reliability, scored 300-850.",
    explain: "it decides if you can rent, get a car, get a mortgage, and at what interest rate. built from: paying bills on time (huge), not maxing out credit cards, having older accounts, mix of credit types. one late payment can drop you 100 points. checking your own score doesn't hurt it. best move: automate every bill you can, so you literally can't forget.",
    tag: "the invisible resume"
  }
];
