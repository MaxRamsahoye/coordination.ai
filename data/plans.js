/*
 * Plans — proposals for how the arrival of advanced AI should be handled,
 * from researchers and campaigns, the labs and governments.
 *
 * Each plan:
 *   id       unique slug
 *   name     name
 *   type     proposals | labs | governments (the category pills)
 *   date     YYYY, YYYY-MM or YYYY-MM-DD
 *   by       who wrote it
 *   stance   halt | pace | accelerate — what it asks of the race (optional)
 *   summary  what it proposes, in a sentence or two
 *   url      address
 *   entry    optional — "page:id" of the same item elsewhere on the site
 */
window.CC_PLANS = [
  // ── Proposals from researchers and campaigns
  { id: "ai-2040-plan-a", name: "AI 2040: Plan A", type: "proposals", date: "2026-07-09", stance: "halt",
    by: "AI Futures Project",
    summary: "The US and China agree to delay superintelligence until 2040, enforced by chip tracking, with all AI research made public. It's weighed against Plans B, C, D and S: containing China, a limited slowdown, racing as now and a complete shutdown.",
    url: "https://ai-2040.com/", entry: "materials:ai-2040-plan-a" },
  { id: "miri-treaty", name: "An international agreement to prevent premature superintelligence", type: "proposals", date: "2025-11", stance: "halt",
    by: "MIRI Technical Governance Team",
    summary: "A draft treaty, led by the US and China, that caps training compute and the size of chip clusters, with a verification regime built for rivals who don't trust each other.",
    url: "https://techgov.intelligence.org/research/an-international-agreement-to-prevent-the-premature-creation-of-artificial-superintelligence" },
  { id: "keep-the-future-human", name: "Keep the Future Human", type: "proposals", date: "2025-03", stance: "halt",
    by: "Anthony Aguirre",
    summary: "Close the 'gates' to AGI and superintelligence with hard limits on compute and strict liability for developers, and build powerful but controllable AI tools instead.",
    url: "https://keepthefuturehuman.ai/" },
  { id: "superintelligence-strategy", name: "Superintelligence Strategy", type: "proposals", date: "2025-03",
    by: "Dan Hendrycks, Eric Schmidt and Alexandr Wang",
    summary: "A national-security strategy built on deterrence: any state's bid for AI dominance would be sabotaged by its rivals (Mutual Assured AI Malfunction), alongside non-proliferation to rogue actors and competition in the economy.",
    url: "https://www.nationalsecurity.ai/" },
  { id: "a-narrow-path", name: "A Narrow Path", type: "proposals", date: "2024-10", stance: "halt",
    by: "ControlAI",
    summary: "Prevent the development of superintelligence for 20 years through national and international measures, build stable international institutions, then develop transformative AI under human control.",
    url: "https://www.narrowpath.co/", entry: "materials:a-narrow-path" },
  { id: "situational-awareness", name: "Situational Awareness", type: "proposals", date: "2024-06-04", stance: "accelerate",
    by: "Leopold Aschenbrenner",
    summary: "Treat AGI as a national-security race with China that the US must win, ending in a government-run AGI project: 'The Project'.",
    url: "https://situational-awareness.ai/", entry: "materials:situational-awareness" },
  { id: "pauseai-proposal", name: "The PauseAI proposal", type: "proposals", stance: "halt", date: "2023",
    by: "PauseAI",
    summary: "An international pause on training AI systems more powerful than the current frontier until they can be built safely and under democratic control, overseen by an international body.",
    url: "https://pauseai.info/proposal" },

  // ── From the labs
  { id: "we-must-pace-the-frontier", name: "We Must Pace the Frontier", type: "labs", date: "2026-09-12", stance: "pace",
    by: "Dario Amodei, Anthropic",
    summary: "Slow the rate at which capabilities increase — pacing, not pausing: third-party evaluators inside labs, common safety standards and limits among companies in democracies, and verifiable coordination with authoritarian governments.",
    url: "https://darioamodei.com/post/we-must-pace-the-frontier", entry: "materials:we-must-pace-the-frontier" },
  { id: "deepmind-agi-safety", name: "An Approach to Technical AGI Safety and Security", type: "labs", date: "2025-04",
    by: "Google DeepMind",
    summary: "Google DeepMind's technical plan against misuse and misalignment as AGI nears: restricting access to dangerous capabilities, and oversight, monitoring and security in case a model is misaligned.",
    url: "https://deepmind.google/discover/blog/taking-a-responsible-path-to-agi/" },
  { id: "anthropic-rsp", name: "Responsible Scaling Policy", type: "labs", date: "2023-09", stance: "pace",
    by: "Anthropic",
    summary: "Safeguards that must grow with each level of capability, with a commitment to pause training or deployment if they can't keep up. Other labs have since adopted similar frameworks.",
    url: "https://www.anthropic.com/news/anthropics-responsible-scaling-policy" },
  { id: "superalignment", name: "Superalignment", type: "labs", date: "2023-07",
    by: "OpenAI",
    summary: "A plan to solve the alignment of superintelligence within four years, with a fifth of OpenAI's compute. The team was dissolved in 2024 after its leaders left.",
    url: "https://openai.com/index/introducing-superalignment/" },
  { id: "planning-for-agi", name: "Planning for AGI and Beyond", type: "labs", date: "2023-02",
    by: "Sam Altman, OpenAI",
    summary: "A gradual transition to AGI through deploying ever more capable systems, adding that it may become important to agree to limit the growth of compute used for the most advanced efforts.",
    url: "https://openai.com/index/planning-for-agi-and-beyond/" },

  // ── From governments
  { id: "china-action-plan", name: "Global AI Governance Action Plan", type: "governments", date: "2025-07",
    by: "Government of China",
    summary: "Proposes international cooperation on AI through the UN and a new World AI Cooperation Organization, alongside open-source sharing and building AI capacity in developing countries.",
    url: "https://www.fmprc.gov.cn/eng/" },
  { id: "us-action-plan", name: "America's AI Action Plan", type: "governments", date: "2025-07-23", stance: "accelerate",
    by: "The White House",
    summary: "'Winning the race': remove regulatory barriers, build data centres and energy at speed, and export American AI to allies.",
    url: "https://www.whitehouse.gov/wp-content/uploads/2025/07/Americas-AI-Action-Plan.pdf" },
  { id: "eu-ai-continent", name: "AI Continent Action Plan", type: "governments", date: "2025-04", stance: "accelerate",
    by: "European Commission",
    summary: "Make Europe a leading AI continent through 'AI gigafactories', more data and skills, and simpler rules, alongside the AI Act.",
    url: "https://digital-strategy.ec.europa.eu/en/factpages/ai-continent-action-plan" },
  { id: "uk-opportunities", name: "AI Opportunities Action Plan", type: "governments", date: "2025-01", stance: "accelerate",
    by: "UK Government",
    summary: "Expand compute twenty-fold by 2030, set up AI Growth Zones and adopt AI across public services, to make the UK an 'AI maker, not an AI taker'.",
    url: "https://www.gov.uk/government/publications/ai-opportunities-action-plan" },
  { id: "uscc-manhattan", name: "A Manhattan Project for AGI", type: "governments", date: "2024-11", stance: "accelerate",
    by: "US–China Economic and Security Review Commission",
    summary: "Its first recommendation to Congress: a Manhattan Project-like programme to race to AGI.",
    url: "https://www.uscc.gov/annual-report/2024-annual-report-congress" },
];
