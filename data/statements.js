/*
 * Statements on AI — public letters and declarations on the risks and pace
 * of frontier AI development.
 *
 * Each statement:
 *   id       unique slug
 *   date     "YYYY-MM-DD", or "YYYY-MM" when only the month is known
 *   title    name of the statement
 *   type     letter | declaration | joint
 *   by       who issued or signed it
 *   summary  what it says, in one to three sentences
 *   quote    optional — a short verbatim line from the statement
 *   source   optional — { label, url }
 */
window.CC_STATEMENTS = [
  {
    id: "pacing-the-frontier",
    date: "2026-07-28",
    title: "Pacing the Frontier",
    type: "joint",
    by: "More than 1,100 employees of frontier AI companies — most from Anthropic, OpenAI, Google and Meta — including Dario Amodei, Jared Kaplan, Jack Clark and OpenAI chief scientist Jakub Pachocki. Endorsed by OpenAI and Anthropic as companies.",
    summary:
      "Asks the US government to support an international effort to develop the technical and governance tools needed to deliberately pace frontier AI development, particularly AI that automates AI research. It does not call for a pause now or for restrictions on existing products.",
    quote: "Support an international effort to develop the technical and governance tools needed to deliberately pace the frontier of automated AI development.",
    source: { label: "pacingthefrontier.com", url: "https://www.pacingthefrontier.com/" },
  },
  {
    id: "pro-human-ai-declaration",
    date: "2026-03-04",
    title: "Pro-Human AI Declaration",
    type: "declaration",
    by: "A cross-partisan coalition convened by the Future of Life Institute, including Yoshua Bengio, Geoffrey Hinton, Steve Bannon, Glenn Beck, Susan Rice, Ralph Nader, Richard Branson and Daron Acemoglu, and organisations including the AFL-CIO and SAG-AFTRA",
    summary:
      "33 principles under five pillars for how advanced AI should be built, deployed and regulated, arguing for trustworthy, controllable AI that amplifies people rather than replacing them as creators, caregivers and decision-makers.",
    source: { label: "humanstatement.org", url: "https://humanstatement.org/" },
  },
  {
    id: "superintelligence-statement",
    date: "2025-10-22",
    title: "Statement on Superintelligence",
    type: "letter",
    by: "Future of Life Institute; signed by Geoffrey Hinton, Yoshua Bengio, Steve Wozniak, Steve Bannon, Glenn Beck, Prince Harry and Meghan, and five Nobel laureates",
    summary: "Calls for a prohibition on developing superintelligence until it can be done safely and controllably, with public support.",
    quote:
      "We call for a prohibition on the development of superintelligence, not lifted before there is broad scientific consensus that it will be done safely and controllably, and strong public buy-in.",
    source: { label: "superintelligence-statement.org", url: "https://superintelligence-statement.org/" },
  },
  {
    id: "red-lines",
    date: "2025-09-22",
    title: "Global Call for AI Red Lines",
    type: "letter",
    by: "Over 200 prominent figures including Nobel laureates, AI researchers and former heads of state; launched at the UN General Assembly",
    summary: "Urges governments to reach an international agreement on clear, verifiable red lines for AI by the end of 2026.",
    source: { label: "red-lines.ai", url: "https://red-lines.ai/" },
  },
  {
    id: "right-to-warn",
    date: "2024-06-04",
    title: "A Right to Warn about Advanced Artificial Intelligence",
    type: "letter",
    by: "Current and former employees of OpenAI and Google DeepMind; endorsed by Yoshua Bengio, Geoffrey Hinton and Stuart Russell",
    summary:
      "Asks frontier AI companies to let employees raise risk-related concerns with boards, regulators and the public without retaliation or restrictive non-disparagement agreements.",
    source: { label: "righttowarn.ai", url: "https://righttowarn.ai/" },
  },
  {
    id: "cais-statement",
    date: "2023-05-30",
    title: "Statement on AI Risk",
    type: "letter",
    by: "Center for AI Safety; signed by Geoffrey Hinton, Yoshua Bengio and the CEOs of OpenAI, Google DeepMind and Anthropic",
    summary: "A one-sentence statement placing the risk of extinction from AI alongside pandemics and nuclear war.",
    quote: "Mitigating the risk of extinction from AI should be a global priority alongside other societal-scale risks such as pandemics and nuclear war.",
    source: { label: "Center for AI Safety", url: "https://www.safe.ai/work/statement-on-ai-risk" },
  },
  {
    id: "pause-letter",
    date: "2023-03-22",
    title: "Pause Giant AI Experiments: An Open Letter",
    type: "letter",
    by: "Future of Life Institute; signed by Yoshua Bengio, Stuart Russell, Elon Musk, Steve Wozniak and over 30,000 others",
    summary:
      "Calls for a six-month pause on training AI systems more powerful than GPT-4, to be used to develop shared safety protocols, and for governments to impose a moratorium if labs will not pause.",
    quote: "We call on all AI labs to immediately pause for at least 6 months the training of AI systems more powerful than GPT-4.",
    source: { label: "Future of Life Institute", url: "https://futureoflife.org/open-letter/pause-giant-ai-experiments/" },
  },
];
