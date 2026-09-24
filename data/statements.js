/*
 * Statements on AI — public letters and declarations on the risks and pace
 * of frontier AI development.
 *
 * Each statement:
 *   id       unique slug
 *   date     "YYYY-MM-DD", or "YYYY-MM" when only the month is known
 *   title    name of the statement
 *   headline short news-style line for the Latest developments ticker
 *   category main | academic | governmental | religious (the category pills;
 *            main is the core list shown by default)
 *   type     letter | declaration | joint | principles | paper | consensus |
 *            report | resolution | treaty | order | code | address | note |
 *            encyclical (labels in app.js)
 *   by       who issued or signed it
 *   summary  what it says, in one to three sentences
 *   quote    optional — a short verbatim line from the statement
 *   source   optional — { label, url }
 */
window.CC_STATEMENTS = [
  {
    id: "pacing-the-frontier",
    category: "main",
    date: "2026-07-28",
    title: "Pacing the Frontier",
    headline: "1,100 AI lab staff call to pace the frontier",
    type: "joint",
    by: "1,134 employees of frontier AI companies by 28 July (867 named, 267 anonymous): 533 from Anthropic, 330 from OpenAI, 191 from Google and 62 from Meta. They include Dario Amodei, Jared Kaplan and Jack Clark; OpenAI's chief scientist Jakub Pachocki and chief research officer Mark Chen; Meta's AI chief scientist Shengjia Zhao; Google DeepMind's chief strategy officer Jasjeet Sekhon and head of AI safety Anca Dragan; and John Schulman of Thinking Machines. Endorsed by OpenAI and Anthropic as companies.",
    summary:
      "Asks the US government to support an international effort to develop the technical and governance tools needed to deliberately pace frontier AI development, particularly AI that automates AI research. It does not call for a pause now or for restrictions on existing products.",
    quote: "Support an international effort to develop the technical and governance tools needed to deliberately pace the frontier of automated AI development.",
    source: { label: "pacingthefrontier.com", url: "https://www.pacingthefrontier.com/" },
  },
  {
    id: "pro-human-ai-declaration",
    category: "main",
    date: "2026-03-04",
    title: "Pro-Human AI Declaration",
    headline: "Coalition launches Pro-Human AI Declaration",
    type: "declaration",
    by: "A cross-partisan coalition convened by the Future of Life Institute, including Yoshua Bengio, Geoffrey Hinton, Steve Bannon, Glenn Beck, Susan Rice, Ralph Nader, Richard Branson and Daron Acemoglu, and organisations including the AFL-CIO and SAG-AFTRA",
    summary:
      "33 principles under five pillars for how advanced AI should be built, deployed and regulated, arguing for trustworthy, controllable AI that amplifies people rather than replacing them as creators, caregivers and decision-makers.",
    source: { label: "humanstatement.org", url: "https://humanstatement.org/" },
  },
  {
    id: "superintelligence-statement",
    category: "main",
    date: "2025-10-22",
    title: "Statement on Superintelligence",
    headline: "Hinton and Bengio call for superintelligence ban",
    type: "letter",
    by: "Future of Life Institute; signed by Geoffrey Hinton, Yoshua Bengio, Steve Wozniak, Steve Bannon, Glenn Beck, Prince Harry and Meghan, and five Nobel laureates",
    summary: "Calls for a prohibition on developing superintelligence until it can be done safely and controllably, with public support.",
    quote:
      "We call for a prohibition on the development of superintelligence, not lifted before there is broad scientific consensus that it will be done safely and controllably, and strong public buy-in.",
    source: { label: "superintelligence-statement.org", url: "https://superintelligence-statement.org/" },
  },
  {
    id: "red-lines",
    category: "main",
    date: "2025-09-22",
    title: "Global Call for AI Red Lines",
    headline: "200 public figures urge global AI red lines",
    type: "letter",
    by: "Over 200 prominent figures including Nobel laureates, AI researchers and former heads of state; launched at the UN General Assembly",
    summary: "Urges governments to reach an international agreement on clear, verifiable red lines for AI by the end of 2026.",
    source: { label: "red-lines.ai", url: "https://red-lines.ai/" },
  },
  {
    id: "right-to-warn",
    category: "main",
    date: "2024-06-04",
    title: "A Right to Warn about Advanced Artificial Intelligence",
    headline: "AI lab staff demand a right to warn",
    type: "letter",
    by: "Current and former employees of OpenAI and Google DeepMind; endorsed by Yoshua Bengio, Geoffrey Hinton and Stuart Russell",
    summary:
      "Asks frontier AI companies to let employees raise risk-related concerns with boards, regulators and the public without retaliation or restrictive non-disparagement agreements.",
    source: { label: "righttowarn.ai", url: "https://righttowarn.ai/" },
  },
  {
    id: "cais-statement",
    category: "main",
    date: "2023-05-30",
    title: "Statement on AI Risk",
    headline: "AI leaders warn of extinction risk",
    type: "letter",
    by: "Center for AI Safety; signed by Geoffrey Hinton, Yoshua Bengio and the CEOs of OpenAI, Google DeepMind and Anthropic",
    summary: "A one-sentence statement placing the risk of extinction from AI alongside pandemics and nuclear war.",
    quote: "Mitigating the risk of extinction from AI should be a global priority alongside other societal-scale risks such as pandemics and nuclear war.",
    source: { label: "Center for AI Safety", url: "https://www.safe.ai/work/statement-on-ai-risk" },
  },
  {
    id: "pause-letter",
    category: "main",
    date: "2023-03-22",
    title: "Pause Giant AI Experiments: An Open Letter",
    headline: "Open letter calls for six-month AI pause",
    type: "letter",
    by: "Future of Life Institute; signed by Yoshua Bengio, Stuart Russell, Elon Musk, Steve Wozniak and over 30,000 others",
    summary:
      "Calls for a six-month pause on training AI systems more powerful than GPT-4, to be used to develop shared safety protocols, and for governments to impose a moratorium if labs will not pause.",
    quote: "We call on all AI labs to immediately pause for at least 6 months the training of AI systems more powerful than GPT-4.",
    source: { label: "Future of Life Institute", url: "https://futureoflife.org/open-letter/pause-giant-ai-experiments/" },
  },

  // ── Academic
  {
    id: "singapore-consensus",
    category: "academic",
    date: "2025-05-08",
    title: "Singapore Consensus on Global AI Safety Research Priorities",
    headline: "Researchers set global AI safety priorities",
    type: "consensus",
    by: "Researchers from 11 countries, including Yoshua Bengio, Stuart Russell and Max Tegmark, with staff of OpenAI, Anthropic, Google DeepMind, xAI and Meta",
    summary:
      "Sets out shared research priorities for making general-purpose AI trustworthy, grouped into assessing risks, developing safe systems and monitoring and controlling them after deployment.",
  },
  {
    id: "international-ai-safety-report",
    category: "academic",
    date: "2025-01-29",
    title: "International AI Safety Report",
    headline: "First International AI Safety Report published",
    type: "report",
    by: "96 experts chaired by Yoshua Bengio, nominated by 30 countries, the UN, the EU and the OECD",
    summary:
      "The first comprehensive scientific review of the capabilities and risks of general-purpose AI, commissioned at the Bletchley Park summit. It finds deep uncertainty about how fast capabilities will advance and whether risks can be managed.",
    source: { label: "internationalaisafetyreport.org", url: "https://internationalaisafetyreport.org/" },
  },
  {
    id: "idais-venice",
    category: "academic",
    date: "2024-09-16",
    title: "IDAIS-Venice Consensus Statement",
    headline: "Scientists call AI safety a global public good",
    type: "consensus",
    by: "Scientists from the International Dialogues on AI Safety, including Yoshua Bengio, Andrew Yao, Geoffrey Hinton and Zhang Ya-Qin",
    summary:
      "Calls for AI safety to be treated as a global public good, with emergency preparedness agreements between countries, a safety-assurance framework for developers and independent research on verification.",
    source: { label: "idais.ai", url: "https://idais.ai/" },
  },
  {
    id: "managing-extreme-risks",
    category: "academic",
    date: "2024-05-20",
    title: "Managing Extreme AI Risks amid Rapid Progress",
    headline: "Scientists warn of extreme AI risks in Science",
    type: "paper",
    by: "Yoshua Bengio, Geoffrey Hinton, Andrew Yao, Dawn Song, Pieter Abbeel, Stuart Russell and 19 other authors, in Science",
    summary:
      "Warns that companies are racing to build autonomous generalist systems without the means to make them safe, and calls for oversight institutions with real powers and for labs to spend at least a third of their AI research budgets on safety.",
    source: { label: "Science", url: "https://www.science.org/doi/10.1126/science.adn0117" },
  },
  {
    id: "idais-beijing",
    category: "academic",
    date: "2024-03",
    title: "IDAIS-Beijing Consensus Statement",
    headline: "Western and Chinese scientists set AI red lines",
    type: "consensus",
    by: "Western and Chinese scientists at the International Dialogues on AI Safety, including Yoshua Bengio, Geoffrey Hinton, Andrew Yao and Stuart Russell",
    summary:
      "Proposes red lines no AI system should cross, including copying or improving itself autonomously, seeking power, helping to build weapons of mass destruction, carrying out cyberattacks and deceiving its developers.",
    source: { label: "idais.ai", url: "https://idais.ai/" },
  },
  {
    id: "montreal-declaration",
    category: "academic",
    date: "2018-12-04",
    title: "Montréal Declaration for a Responsible Development of AI",
    headline: "Montréal Declaration sets responsible AI principles",
    type: "declaration",
    by: "Université de Montréal, drafted with researchers and the public",
    summary: "Ten principles, including well-being, autonomy, privacy, democratic participation and prudence, to guide the development of AI.",
    source: { label: "montrealdeclaration-responsibleai.com", url: "https://montrealdeclaration-responsibleai.com/" },
  },
  {
    id: "asilomar-principles",
    category: "academic",
    date: "2017-01",
    title: "Asilomar AI Principles",
    headline: "Researchers adopt Asilomar AI Principles",
    type: "principles",
    by: "Researchers at the Future of Life Institute's Beneficial AI conference; signed by more than 1,200 AI researchers, including Demis Hassabis, Ilya Sutskever and Stuart Russell",
    summary:
      "23 principles for beneficial AI, including that systems designed to recursively self-improve must be subject to strict safety and control measures, and that superintelligence should serve widely shared ethical ideals.",
    source: { label: "Future of Life Institute", url: "https://futureoflife.org/open-letter/ai-principles/" },
  },

  // ── Governmental
  {
    id: "new-delhi-declaration",
    category: "governmental",
    date: "2026-02",
    title: "AI Impact Summit Declaration",
    headline: "92 countries back New Delhi AI declaration",
    type: "declaration",
    by: "92 countries and international organisations at the AI Impact Summit in New Delhi",
    summary:
      "The fourth summit in the series begun at Bletchley Park focused on inclusive AI and its benefits for the Global South. Alongside it, 13 developers made the New Delhi Frontier AI Commitments on studying real-world use and testing models in underrepresented languages.",
    source: { label: "Press Information Bureau, India", url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2234343" },
  },
  {
    id: "un-scientific-panel",
    category: "governmental",
    date: "2025-08-26",
    title: "UN Scientific Panel and Global Dialogue on AI",
    headline: "UN creates scientific panel on AI",
    type: "resolution",
    by: "UN General Assembly",
    summary:
      "Establishes an Independent International Scientific Panel on AI to report on its risks and impacts, and an annual Global Dialogue on AI Governance among member states.",
  },
  {
    id: "paris-statement",
    category: "governmental",
    date: "2025-02-11",
    title: "Statement on Inclusive and Sustainable AI",
    headline: "US and UK shun Paris AI summit statement",
    type: "declaration",
    by: "About 60 countries, including China, India and the EU, at the AI Action Summit in Paris; the US and UK declined to sign",
    summary:
      "Commits to open, inclusive and ethical AI and to narrowing digital divides. It was criticised for dropping the previous summits' focus on safety.",
  },
  {
    id: "coe-convention",
    category: "governmental",
    date: "2024-09-05",
    title: "Council of Europe Framework Convention on AI",
    headline: "First binding AI treaty opens for signature",
    type: "treaty",
    by: "Council of Europe; signed on opening by the US, UK, EU and others",
    summary: "The first legally binding international treaty on AI, requiring that AI systems respect human rights, democracy and the rule of law throughout their lifecycle.",
  },
  {
    id: "seoul-declaration",
    category: "governmental",
    date: "2024-05-21",
    title: "Seoul Declaration",
    headline: "Seoul summit backs AI safety institutes",
    type: "declaration",
    by: "Ten countries and the EU at the AI Seoul Summit",
    summary:
      "Backs a network of national AI safety institutes. At the same summit, 16 companies signed the Frontier AI Safety Commitments, pledging to publish safety frameworks and to set thresholds of severe risk beyond which they would not develop or deploy a model.",
  },
  {
    id: "un-resolution-2024",
    category: "governmental",
    date: "2024-03-21",
    title: "Seizing the Opportunities of Safe, Secure and Trustworthy AI",
    headline: "UN adopts first resolution on AI",
    type: "resolution",
    by: "UN General Assembly, adopted by consensus on a US proposal",
    summary: "The first General Assembly resolution on AI, calling on states to promote AI systems that are safe, secure and trustworthy and that respect human rights.",
  },
  {
    id: "bletchley-declaration",
    category: "governmental",
    date: "2023-11-01",
    title: "Bletchley Declaration",
    headline: "28 countries sign Bletchley Declaration",
    type: "declaration",
    by: "28 countries, including the US and China, and the EU at the AI Safety Summit at Bletchley Park",
    summary: "The first international agreement recognising the risks of frontier AI, committing signatories to work together on identifying and managing them.",
    quote:
      "There is potential for serious, even catastrophic, harm, either deliberate or unintentional, stemming from the most significant capabilities of these AI models.",
    source: { label: "GOV.UK", url: "https://www.gov.uk/government/publications/ai-safety-summit-2023-the-bletchley-declaration" },
  },
  {
    id: "us-executive-order-14110",
    category: "governmental",
    date: "2023-10-30",
    title: "Executive Order 14110 on Safe, Secure and Trustworthy AI",
    headline: "Biden orders AI safety test disclosures",
    type: "order",
    by: "President Joe Biden, United States",
    summary:
      "Required developers of the most powerful models to share safety test results with the government and directed agencies to set standards for AI safety. It was revoked in January 2025.",
  },
  {
    id: "hiroshima-code",
    category: "governmental",
    date: "2023-10-30",
    title: "Hiroshima Process International Code of Conduct",
    headline: "G7 agrees AI code of conduct",
    type: "code",
    by: "G7 leaders",
    summary: "Voluntary guidance for organisations developing advanced AI, asking them to identify and mitigate risks across the lifecycle, report on capabilities and limitations, and invest in security.",
  },
  {
    id: "unesco-recommendation",
    category: "governmental",
    date: "2021-11-23",
    title: "Recommendation on the Ethics of Artificial Intelligence",
    headline: "UNESCO adopts global AI ethics standard",
    type: "principles",
    by: "UNESCO, adopted by its 193 member states",
    summary: "The first global standard on AI ethics, covering human rights, transparency, accountability and environmental impact.",
    source: { label: "UNESCO", url: "https://www.unesco.org/en/artificial-intelligence/recommendation-ethics" },
  },
  {
    id: "oecd-principles",
    category: "governmental",
    date: "2019-05-22",
    title: "OECD AI Principles",
    headline: "OECD adopts first AI principles",
    type: "principles",
    by: "OECD member countries and partners",
    summary: "The first intergovernmental standard on AI, promoting AI that is innovative and trustworthy and respects human rights and democratic values. The G20 adopted them the following month.",
    source: { label: "OECD", url: "https://oecd.ai/en/ai-principles" },
  },

  // ── Religious
  {
    id: "magnifica-humanitas",
    category: "religious",
    date: "2026-05-25",
    title: "Magnifica humanitas",
    headline: "Pope Leo XIV urges world to 'disarm' AI",
    type: "encyclical",
    by: "Pope Leo XIV; presented at the Vatican with AI researchers including Anthropic co-founder Chris Olah",
    summary:
      "The pope's first encyclical, on safeguarding the human person in the age of AI. It urges governments, technology leaders and society to 'disarm' AI, and warns against autonomous weapons and the concentration of technological power in a few corporations.",
    source: { label: "Vatican", url: "https://www.vatican.va/content/leo-xiv/en/encyclicals/documents/20260515-magnifica-humanitas.html" },
  },
  {
    id: "antiqua-et-nova",
    category: "religious",
    date: "2025-01-28",
    title: "Antiqua et nova",
    headline: "Vatican: AI must not replace human intelligence",
    type: "note",
    by: "Dicastery for the Doctrine of the Faith and Dicastery for Culture and Education, Holy See",
    summary: "A note on the relationship between artificial and human intelligence, arguing that AI should complement human intelligence rather than replace it, and warning of its use in warfare.",
  },
  {
    id: "francis-g7",
    category: "religious",
    date: "2024-06-14",
    title: "Pope Francis addresses the G7 on AI",
    headline: "Pope urges G7 to ban autonomous weapons",
    type: "address",
    by: "Pope Francis, the first pope to take part in a G7 summit",
    summary: "Called AI both an exciting and a fearsome tool, and urged leaders to ban lethal autonomous weapons.",
    quote: "No machine should ever choose to take the life of a human being.",
  },
  {
    id: "ai-and-peace",
    category: "religious",
    date: "2024-01-01",
    title: "Artificial Intelligence and Peace",
    headline: "Pope calls for binding AI treaty",
    type: "address",
    by: "Pope Francis, message for the World Day of Peace",
    summary: "Urges the international community to adopt a binding international treaty to regulate the development and use of AI.",
  },
  {
    id: "rome-call",
    category: "religious",
    date: "2020-02-28",
    title: "Rome Call for AI Ethics",
    headline: "Vatican, Microsoft and IBM sign Rome Call",
    type: "principles",
    by: "Pontifical Academy for Life, Microsoft, IBM, the FAO and the Italian government; later signed by Jewish and Muslim leaders (2023) and leaders of Eastern religions in Hiroshima (2024)",
    summary: "Six principles for 'algorethics' — transparency, inclusion, responsibility, impartiality, reliability, and security and privacy.",
    source: { label: "romecall.org", url: "https://www.romecall.org/" },
  },
  {
    id: "erlc-principles",
    category: "religious",
    date: "2019-04-11",
    title: "Artificial Intelligence: An Evangelical Statement of Principles",
    headline: "Southern Baptists set AI principles",
    type: "principles",
    by: "Ethics & Religious Liberty Commission of the Southern Baptist Convention; signed by more than 60 evangelical leaders",
    summary: "Twelve articles affirming human dignity and moral responsibility, holding that AI must not be treated as a person or used to replace human moral agency.",
  },
];
