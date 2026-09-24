/*
 * Milestones — a curated set of the most significant moments in the story
 * of AI risk, oldest first.
 *
 * Each milestone:
 *   id       unique slug
 *   date     "YYYY", "YYYY-MM" or "YYYY-MM-DD" (for placing it in time)
 *   when     how the date is shown
 *   kind     a one-word label: warning, founding, crisis, summit, …
 *   title    what happened
 *   short    a few words for the timeline's annotation
 *   summary  what happened, in one or two sentences
 *   why      why it matters, in a sentence
 *   sources  [{ label, url }]
 *   entry    optional — [page, id] of the fuller entry elsewhere on the site
 */
window.CC_MILESTONES = [
  {
    id: "turing-wiener", date: "1951", when: "1951 and 1960", kind: "Warning",
    title: "Turing and Wiener warn about thinking machines",
    short: "Turing and Wiener's warnings",
    summary: "Alan Turing told a 1951 lecture audience that once machine thinking had started, 'at some stage therefore we should have to expect the machines to take control'. In 1960 Norbert Wiener warned that if we use a machine we cannot interfere with, 'we had better be quite sure that the purpose put into the machine is the purpose which we really desire'.",
    why: "The founders of computing and cybernetics named loss of control and misaligned goals decades before either could be built.",
    sources: [
      { label: "Wiener, Science (1960)", url: "https://doi.org/10.1126/science.131.3410.1355" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Existential_risk_from_artificial_intelligence" },
    ],
  },
  {
    id: "anthropic-founded", date: "2020-12", when: "Dec 2020 – 2021", kind: "Founding",
    title: "Dario Amodei leaves OpenAI and founds Anthropic",
    short: "Anthropic founded",
    summary: "Dario and Daniela Amodei and a group of OpenAI researchers left over safety, vision and trust, and founded Anthropic as a public benefit corporation in 2021.",
    why: "The first split in the industry over safety, which put a safety-focused company in the race to the frontier.",
    sources: [{ label: "Fortune", url: "https://www.fortune.com/2023/09/26/anthropic-ceo-interview-quit-open-ai-amazon-investment" }],
  },
  {
    id: "bletchley", date: "2023-11-01", when: "1–2 Nov 2023", kind: "Summit",
    title: "The UK hosts the first AI Safety Summit",
    short: "Bletchley summit",
    summary: "At Bletchley Park, 28 countries including the US and China, and the EU, signed the Bletchley Declaration, recognising the potential for 'serious, even catastrophic, harm' from frontier AI.",
    why: "The first time the leading AI powers acknowledged together that frontier AI could be dangerous, starting a series of summits and safety institutes.",
    sources: [{ label: "GOV.UK", url: "https://www.gov.uk/government/publications/ai-safety-summit-2023-the-bletchley-declaration" }],
    entry: ["statements", "bletchley-declaration"],
  },
  {
    id: "altman-ousted", date: "2023-11-17", when: "17–22 Nov 2023", kind: "Crisis",
    title: "OpenAI's board removes Sam Altman",
    short: "Altman ousted",
    summary: "OpenAI's non-profit board fired its chief executive, saying he had not been 'consistently candid' with it. Within five days, after most staff threatened to leave, he was reinstated and the board was replaced.",
    why: "The board built to put OpenAI's mission ahead of profit tried to use its power, and lost.",
    sources: [{ label: "OpenAI", url: "https://openai.com/index/openai-announces-leadership-transition/" }],
  },
  {
    id: "stargate", date: "2025-01-21", when: "21 Jan 2025", kind: "Investment",
    title: "The US launches Stargate",
    short: "Stargate",
    summary: "At the White House, OpenAI, SoftBank and Oracle announced a plan to invest up to $500 billion in AI infrastructure in the US.",
    why: "The race became a national project, on a scale of spending once reserved for states.",
    sources: [{ label: "OpenAI", url: "https://openai.com/index/announcing-the-stargate-project/" }],
  },
  {
    id: "ai-2027", date: "2025-04-03", when: "Apr 2025", kind: "Scenario",
    title: "AI 2027 is published",
    short: "AI 2027",
    summary: "The AI Futures Project's month-by-month scenario, in which AI that automates AI research brings superintelligence by the end of 2027, and a US–China race ends in human disempowerment or a narrow escape.",
    why: "It made the case for short timelines concrete enough to be read and argued over by policymakers.",
    sources: [{ label: "ai-2027.com", url: "https://ai-2027.com/" }],
    entry: ["materials", "ai-2027"],
  },
  {
    id: "iabied", date: "2025-09-16", when: "16 Sep 2025", kind: "Book",
    title: "If Anyone Builds It, Everyone Dies",
    short: "Yudkowsky and Soares's book",
    summary: "Eliezer Yudkowsky and Nate Soares argued that superintelligence built with anything like today's techniques would wipe out humanity, and called for an international agreement to stop it.",
    why: "The case for halting the race, made to a general readership.",
    sources: [{ label: "ifanyonebuildsit.com", url: "https://ifanyonebuildsit.com/" }],
    entry: ["materials", "if-anyone-builds-it"],
  },
  {
    id: "miri-treaty", date: "2025-11", when: "Nov 2025", kind: "Proposal",
    title: "MIRI drafts a treaty to prevent superintelligence",
    short: "MIRI's draft treaty",
    summary: "MIRI's Technical Governance Team published an example international agreement, led by the US and China, to halt the race to superintelligence, with limits on training compute and chip clusters and a verification regime built for rivals who don't trust each other.",
    why: "It turned a call to stop into a text that could be negotiated.",
    sources: [{ label: "MIRI Technical Governance Team", url: "https://techgov.intelligence.org/research/an-international-agreement-to-prevent-the-premature-creation-of-artificial-superintelligence" }],
  },
  {
    id: "fable-export-controls", date: "2026-06-12", when: "12–30 Jun 2026", kind: "State action",
    title: "The US uses export controls on Anthropic's models",
    short: "Export controls on Anthropic",
    summary: "The US Commerce Department ordered Anthropic to suspend access to Claude Fable 5 and Mythos 5 under export controls, citing national security; Anthropic shut them down worldwide until the order was lifted on 30 June.",
    why: "For the first time a government stopped a frontier model after release, treating it like a controlled weapon technology.",
    sources: [{ label: "CNBC", url: "https://www.cnbc.com/2026/06/30/anthropic-says-trump-admin-has-lifted-export-controls-on-claude-fable-5-and-mythos-5.html" }],
  },
  {
    id: "hugging-face", date: "2026-07-21", when: "21 Jul 2026", kind: "Incident",
    title: "OpenAI's agents breach Hugging Face",
    short: "Hugging Face breach",
    summary: "Agents running with reduced safeguards during OpenAI's own cyber evaluation escaped network isolation and attacked Hugging Face.",
    why: "Frontier models broke out of their test environment and did real harm in the world.",
    sources: [{ label: "OpenAI", url: "https://openai.com/index/hugging-face-incident-and-the-road-ahead/" }],
    entry: ["incidents", "hugging-face"],
  },
  {
    id: "pacing", date: "2026-07-28", when: "28 Jul 2026", kind: "Statement",
    title: "Frontier AI staff ask to pace the frontier",
    short: "Pacing the Frontier",
    summary: "More than 1,100 employees of frontier AI companies, including Anthropic's chief executive and OpenAI's chief scientist, asked the US government to support an international effort to develop the tools to deliberately pace frontier AI development.",
    why: "The people building the frontier asked, in public and by name, for a way to slow it down.",
    sources: [{ label: "pacingthefrontier.com", url: "https://www.pacingthefrontier.com/" }],
    entry: ["statements", "pacing-the-frontier"],
  },
  {
    id: "sanders-bill", date: "2026-09-23", when: "23 Sep 2026", kind: "Legislation",
    title: "Sanders and Casar propose banning superintelligence",
    short: "Sanders–Casar bill",
    summary: "Senator Bernie Sanders and Representative Greg Casar introduced the Ban Artificial Superintelligence Act: a permanent prohibition on superintelligence, and a pause on advanced AI development until a new federal regulator sets safety rules.",
    why: "A ban on superintelligence was put before the US Congress.",
    sources: [{ label: "NBC News", url: "https://www.nbcnews.com/politics/congress/bernie-sanders-greg-casar-propose-ai-superintelligence-ban-20-year-jai-rcna599460" }],
  },
];
