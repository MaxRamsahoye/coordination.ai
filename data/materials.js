/*
 * Materials — scenarios (detailed stories, forecasts and plans for how the
 * arrival of advanced AI could unfold), essays, research papers and books.
 *
 * Each item:
 *   id       unique slug
 *   category scenario | essay | paper | book (the category pills)
 *   date     when it was published: "YYYY-MM-DD", or "YYYY-MM" when only the
 *            month is known
 *   title    name of the piece
 *   headline short news-style line for the Latest developments ticker
 *   type     forecast | plan | essay | paper | book (labels in app.js)
 *              forecast — what the authors think is likely to happen
 *              plan     — what the authors think should happen
 *              essay    — an argued account of a possible future
 *              paper    — a research paper
 *              book     — a book-length argument
 *   by       authors and publisher
 *   summary  what it says or what happens, in one to three sentences
 *   quote    optional — a short verbatim line
 *   source   optional — { label, url }
 */
window.CC_MATERIALS = [
  // ── Research papers on the race
  {
    id: "are-we-doomed-to-an-ai-race",
    category: "paper",
    date: "2026-05-02",
    title: "Are We Doomed to an AI Race? Why Self-Interest Could Drive Countries Towards a Moratorium on Superintelligence",
    headline: "Game theory: a superintelligence moratorium can be in states' interest",
    type: "paper",
    by: "Edward Roussel, Lode Lauwaert, Torben Swoboda, Grant Ramsey, Risto Uuk, Leonard Dung and Anthony Aguirre",
    summary:
      "Models the race between superpowers as a game weighing the benefits of technological supremacy against the risk of losing control of superintelligence. Once the perceived cost of losing control is high enough, a moratorium becomes in each state's own interest.",
    source: { label: "arXiv", url: "https://arxiv.org/abs/2605.01297" },
  },
  {
    id: "the-most-dangerous-fiction",
    category: "paper",
    date: "2026",
    title: "The Most Dangerous Fiction: The Rhetoric and Reality of the AI Race",
    headline: "Ó hÉigeartaigh: the 'AI race' is a dangerous fiction",
    type: "paper",
    by: "Seán Ó hÉigeartaigh",
    summary:
      "Traces the 'AI race' narrative from 2017 to 2025 and finds little evidence of a concentrated Chinese state effort to build AGI. Shows how the narrative has been used in the US to justify faster development and less oversight, despite Chinese officials' calls for cooperation and safety.",
    source: { label: "SSRN", url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5278644" },
  },
  {
    id: "imagining-security",
    category: "paper",
    date: "2025",
    title: "Imagining Security: The Promises and Perils of an AI Manhattan Project",
    headline: "Peppiatt weighs the case for an AI Manhattan Project",
    type: "paper",
    by: "Caleb Peppiatt",
    summary:
      "Examines the case, made most prominently in Situational Awareness, for the US government to accelerate AI to win an arms race with China: who argues for more government control, who would benefit, and who would lose.",
    source: { label: "Google Docs", url: "https://docs.google.com/document/d/1RqzpHVkXlL-jQzZcLH38omtXvCWzfdXdn5GmSqUno60/edit?usp=sharing" },
  },
  {
    id: "seeking-stability",
    category: "paper",
    date: "2025-03",
    title: "Seeking Stability in the Competition for AI Advantage",
    headline: "RAND questions whether MAIM would stabilise the AI race",
    type: "paper",
    by: "Iskander Rehman, Karl P. Mueller and Michael J. Mazarr, RAND",
    summary:
      "A commentary on Superintelligence Strategy. Asks whether deterrence built on preventive sabotage would reduce instability or heighten it, whether it's feasible, and how far Cold War analogies hold, while urging the US and China to keep exploring bold ideas for managing the transition.",
    source: { label: "RAND", url: "https://www.rand.org/pubs/commentary/2025/03/seeking-stability-in-the-competition-for-ai-advantage.html" },
  },
  {
    id: "superintelligence-strategy-maim",
    category: "paper",
    date: "2025-03",
    title: "Superintelligence Strategy: Deterrence with Mutual Assured AI Malfunction (MAIM)",
    headline: "Hendrycks, Schmidt and Wang propose AI deterrence: MAIM",
    type: "paper",
    by: "Dan Hendrycks, Eric Schmidt and Alexandr Wang",
    summary:
      "Proposes Mutual Assured AI Malfunction, a deterrence regime like nuclear mutual assured destruction: any state's aggressive bid for unilateral AI dominance would be met with sabotage by its rivals, from cyberattacks to strikes on data centres. It is one part of a strategy of deterrence, non-proliferation and competitiveness.",
    source: { label: "nationalsecurity.ai", url: "https://www.nationalsecurity.ai/chapter/deterrence-with-mutual-assured-ai-malfunction-maim" },
  },
  {
    id: "the-manhattan-trap",
    category: "paper",
    date: "2025-01",
    title: "The Manhattan Trap: Why a Race to Artificial Superintelligence is Self-Defeating",
    headline: "Convergence Analysis: a race to superintelligence is self-defeating",
    type: "paper",
    by: "Corin Katzke and Gideon Futerman, Convergence Analysis",
    summary:
      "Argues that the assumptions that would motivate the US to race for superintelligence also make the race extremely dangerous, heightening the risks of great-power conflict, loss of control and damage to liberal democracy. Superintelligence poses a trust dilemma rather than a prisoner's dilemma, so international cooperation is both preferable and strategically sound.",
    source: { label: "Convergence Analysis", url: "https://www.convergenceanalysis.org/research/the-manhattan-trap-why-a-race-to-artificial-superintelligence-is-self-defeating" },
  },
  {
    id: "we-must-pace-the-frontier",
    category: "essay",
    date: "2026-09-12",
    title: "We Must Pace the Frontier",
    headline: "Amodei: 'We must pace the frontier'",
    type: "essay",
    by: "Dario Amodei, Anthropic",
    summary:
      "Argues the industry should slow the rate at which AI capabilities increase — pacing, not pausing — to leave time for alignment and safety work. Proposes three steps: third-party evaluators embedded in labs, which Anthropic committed to unilaterally; common safety standards and limits among companies in democracies; and coordination with authoritarian governments where it can be verified.",
    source: { label: "darioamodei.com", url: "https://darioamodei.com/post/we-must-pace-the-frontier" },
  },
  {
    id: "ai-2040-plan-a",
    category: "scenario",
    date: "2026-07-09",
    title: "AI 2040: Plan A",
    headline: "AI 2040 plan: delay superintelligence to 2040",
    type: "plan",
    by: "AI Futures Project — Daniel Kokotajlo, Ryan Greenblatt, Thomas Larsen, Eli Lifland, Romeo Dean and Brendan Halstead",
    summary:
      "Without intervention superintelligence would arrive around 2030; in this scenario the US and China instead strike a deal to delay it until 2040. Built on chip tracking, the deal makes all AI research public, lets dozens of companies worldwide catch up to the frontier and enters a regime of mutually assured compute destruction. It is set against Plans B, C, D and S: containing China, a limited slowdown, racing as now and a complete shutdown.",
    source: { label: "ai-2040.com", url: "https://ai-2040.com/" },
  },
  {
    id: "europe-2031",
    category: "scenario",
    date: "2026-06",
    title: "Europe 2031",
    headline: "Europe 2031 warns of AI irrelevance",
    type: "forecast",
    by: "Michiel Bakker, Judith Dada, Daan Juijn, Stan van Baarsen, Philip Fox, Alex Petropoulos and Lily Stelling; written up by Tom Chivers",
    summary:
      "A five-year story of Europe sliding into irrelevance after underestimating how fast AI would advance. It features a ransomware wave from a freely available frontier model, US rationing of compute by country, American takeovers of European carmakers and rising debt that strains the Union, and ends with an epilogue on what could have been.",
    source: { label: "europe2031.ai", url: "https://europe2031.ai/" },
  },
  {
    id: "ai-2027",
    category: "scenario",
    date: "2025-04-03",
    title: "AI 2027",
    headline: "AI 2027 forecasts automated AI research",
    type: "forecast",
    by: "AI Futures Project — Daniel Kokotajlo, Scott Alexander, Thomas Larsen, Eli Lifland and Romeo Dean",
    summary:
      "A month-by-month forecast in which AI agents automate AI research by 2027, setting off an intelligence explosion and a US–China race. Readers choose between two endings: a race in which misaligned AI takes over, and a slowdown in which humanity keeps control.",
    source: { label: "ai-2027.com", url: "https://ai-2027.com/" },
  },
  {
    id: "gradual-disempowerment",
    category: "essay",
    date: "2025-01",
    title: "Gradual Disempowerment",
    headline: "Researchers warn of gradual disempowerment",
    type: "essay",
    by: "Jan Kulveit, Raymond Douglas, Nora Ammann, Deger Turan, David Krueger and David Duvenaud",
    summary:
      "Argues that even without a sudden takeover, humans could lose control as AI steadily replaces human labour and judgement in the economy, culture and the state, removing the incentives that keep those systems serving people.",
    source: { label: "gradual-disempowerment.ai", url: "https://gradual-disempowerment.ai/" },
  },
  {
    id: "machines-of-loving-grace",
    category: "essay",
    date: "2024-10-11",
    title: "Machines of Loving Grace",
    headline: "Amodei sets out an optimistic AI vision",
    type: "essay",
    by: "Dario Amodei, Anthropic",
    summary:
      "An optimistic account of what powerful AI could achieve within a decade of its arrival, compressing a century of progress in biology, neuroscience, economic development and governance into five to ten years.",
    quote: "A country of geniuses in a datacenter.",
    source: { label: "darioamodei.com", url: "https://darioamodei.com/machines-of-loving-grace" },
  },
  {
    id: "a-narrow-path",
    category: "scenario",
    date: "2024-10",
    title: "A Narrow Path",
    headline: "ControlAI proposes 20-year superintelligence halt",
    type: "plan",
    by: "ControlAI — Andrea Miotti and others",
    summary:
      "A three-phase plan: prevent the development of superintelligence for 20 years through national and international measures, build stable international institutions, then develop transformative AI under human control.",
    source: { label: "narrowpath.co", url: "https://www.narrowpath.co/" },
  },
  {
    id: "situational-awareness",
    category: "scenario",
    date: "2024-06-04",
    title: "Situational Awareness: The Decade Ahead",
    headline: "Aschenbrenner forecasts AGI by 2027",
    type: "forecast",
    by: "Leopold Aschenbrenner",
    summary:
      "Forecasts AGI by around 2027 from extrapolated trends in compute and algorithms, followed quickly by superintelligence, trillion-dollar compute clusters and a national-security race with China that ends in a government-run AGI project.",
    source: { label: "situational-awareness.ai", url: "https://situational-awareness.ai/" },
  },

  // ── Books
  {
    id: "if-anyone-builds-it",
    category: "book",
    date: "2025-09-16",
    title: "If Anyone Builds It, Everyone Dies",
    headline: "Yudkowsky and Soares: 'If anyone builds it, everyone dies'",
    type: "book",
    by: "Eliezer Yudkowsky and Nate Soares",
    summary:
      "Argues that if anyone builds superintelligence with anything like today's techniques, humanity will lose control of it and be wiped out, and calls for an international agreement to halt its development.",
    source: { label: "ifanyonebuildsit.com", url: "https://ifanyonebuildsit.com/" },
  },
  {
    id: "the-coming-wave",
    category: "book",
    date: "2023-09-05",
    title: "The Coming Wave",
    headline: "Suleyman's The Coming Wave on containing AI",
    type: "book",
    by: "Mustafa Suleyman with Michael Bhaskar",
    summary:
      "The Google DeepMind co-founder, now at Microsoft, argues that containing AI and other fast-moving technologies, keeping control over them, is the central challenge of the century, and sets out steps towards it.",
    source: { label: "the-coming-wave.com", url: "https://the-coming-wave.com/" },
  },
  {
    id: "the-alignment-problem",
    category: "book",
    date: "2020-10-06",
    title: "The Alignment Problem",
    headline: "Christian's The Alignment Problem",
    type: "book",
    by: "Brian Christian",
    summary:
      "An account of the effort to make machine-learning systems do what we actually intend, told through the researchers working on it, from biased algorithms to the risks of more capable systems.",
    source: { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/The_Alignment_Problem" },
  },
  {
    id: "the-precipice",
    category: "book",
    date: "2020-03-05",
    title: "The Precipice",
    headline: "Ord's The Precipice on existential risk",
    type: "book",
    by: "Toby Ord",
    summary:
      "A survey of the risks that could end humanity's future. Ord estimates the chance of existential catastrophe this century at one in six, with unaligned AI the largest single risk, at one in ten.",
    source: { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/The_Precipice:_Existential_Risk_and_the_Future_of_Humanity" },
  },
  {
    id: "human-compatible",
    category: "book",
    date: "2019-10-08",
    title: "Human Compatible",
    headline: "Russell's Human Compatible on controlling AI",
    type: "book",
    by: "Stuart Russell",
    summary:
      "The co-author of the standard AI textbook argues that building machines to pursue fixed objectives is a mistake that becomes dangerous as they grow more capable, and proposes machines that remain uncertain about what people want.",
    source: { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Human_Compatible" },
  },
  {
    id: "life-3-0",
    category: "book",
    date: "2017-08-29",
    title: "Life 3.0",
    headline: "Tegmark's Life 3.0",
    type: "book",
    by: "Max Tegmark",
    summary:
      "The Future of Life Institute's co-founder sets out the futures superintelligent AI could bring, good and bad, and argues the conversation about which one we want has to start before it arrives.",
    source: { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Life_3.0" },
  },
  {
    id: "superintelligence",
    category: "book",
    date: "2014-07",
    title: "Superintelligence: Paths, Dangers, Strategies",
    headline: "Bostrom's Superintelligence",
    type: "book",
    by: "Nick Bostrom",
    summary:
      "The book that brought the risks of superintelligence to wide attention. Bostrom argues that a machine that surpassed human intelligence could be very hard to control, and that its goals would decide humanity's fate.",
    source: { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Superintelligence:_Paths,_Dangers,_Strategies" },
  },
];
