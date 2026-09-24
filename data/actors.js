/*
 * Actors — the institutions and individuals shaping AI risk and its
 * governance.
 *
 * institutions: each
 *   id       unique slug
 *   name     name
 *   type     lab | government | research | advocacy (the category pills)
 *   founded  year it started (or took its current form)
 *   based    where it's based, as shown
 *   at       [latitude, longitude] of that place, for the map's pin
 *   summary  what it does, in one or two sentences
 *   url      website
 *   site     optional — link text, when the web address is long (default: its domain)
 *
 * individuals: each
 *   id       unique slug
 *   name     name
 *   type     scientist | academic | leader | campaigner | policymaker (the
 *            category pills: research scientists, academics, lab leaders,
 *            governance advocates, policymakers)
 *   role     their role, in a line
 *   based    where they're based
 *   summary  why they matter here, in one or two sentences
 *   url      optional — a page about them or their work
 *   site     optional — link text
 */
window.CC_ACTORS = {
  institutions: [
    // ── Frontier labs
    {
      id: "anthropic", name: "Anthropic", type: "lab", founded: 2021, based: "San Francisco, US", at: [37.77, -122.42],
      summary: "Maker of Claude; founded by former OpenAI staff as a public benefit corporation focused on safety. Its chief executive has called for pacing the frontier.",
      url: "https://www.anthropic.com/",
    },
    {
      id: "openai", name: "OpenAI", type: "lab", founded: 2015, based: "San Francisco, US", at: [37.77, -122.42],
      summary: "Maker of ChatGPT and the GPT models; a for-profit company controlled by the non-profit OpenAI Foundation.",
      url: "https://openai.com/",
    },
    {
      id: "google-deepmind", name: "Google DeepMind", type: "lab", founded: 2010, based: "London, UK", at: [51.53, -0.13],
      summary: "Google's AI lab and maker of the Gemini models; founded as DeepMind and merged with Google Brain in 2023.",
      url: "https://deepmind.google/",
    },
    {
      id: "meta-msl", name: "Meta Superintelligence Labs", type: "lab", founded: 2025, based: "Menlo Park, US", at: [37.48, -122.15],
      summary: "Meta's AI division, set up to build 'personal superintelligence'; maker of the Llama and Muse models.",
      url: "https://ai.meta.com/",
    },
    {
      id: "xai", name: "xAI", type: "lab", founded: 2023, based: "Palo Alto, US", at: [37.44, -122.14],
      summary: "Elon Musk's AI company and maker of Grok; merged into SpaceX in 2026.",
      url: "https://x.ai/",
    },
    {
      id: "deepseek", name: "DeepSeek", type: "lab", founded: 2023, based: "Hangzhou, China", at: [30.27, 120.15],
      summary: "Chinese lab whose open-weight R1 reasoning model rivalled US models at a fraction of the reported cost in 2025.",
      url: "https://www.deepseek.com/",
    },

    // ── Government and intergovernmental
    {
      id: "uk-aisi", name: "AI Security Institute", type: "government", founded: 2023, based: "London, UK", at: [51.5, -0.13],
      summary: "The UK government's institute for testing frontier AI models and researching their risks; founded as the AI Safety Institute and renamed in 2025.",
      url: "https://www.aisi.gov.uk/",
    },
    {
      id: "us-caisi", name: "Center for AI Standards and Innovation", type: "government", founded: 2023, based: "Washington, DC, US", at: [38.9, -77.04],
      summary: "The US government's centre for AI evaluation and standards within NIST; founded as the US AI Safety Institute and renamed in 2025.",
      url: "https://www.nist.gov/caisi",
    },
    {
      id: "eu-ai-office", name: "European AI Office", type: "government", founded: 2024, based: "Brussels, EU", at: [50.85, 4.35],
      summary: "The European Commission's office for enforcing the AI Act's rules on general-purpose AI models, including those with systemic risk.",
      url: "https://digital-strategy.ec.europa.eu/en/policies/ai-office",
      site: "European Commission",
    },
    {
      id: "un-scientific-panel", name: "Independent International Scientific Panel on AI", type: "government", founded: 2025, based: "United Nations, New York", at: [40.75, -73.97],
      summary: "A UN panel set up by the General Assembly to report on the risks and impacts of AI, alongside an annual Global Dialogue on AI Governance.",
      url: "https://www.un.org/",
    },
    {
      id: "japan-aisi", name: "Japan AI Safety Institute", type: "government", founded: 2024, based: "Tokyo, Japan", at: [35.68, 139.69],
      summary: "Japan's government body for AI safety evaluation methods and standards, part of the international network of AI safety institutes.",
      url: "https://aisi.go.jp/",
    },
    {
      id: "korea-aisi", name: "Korea AI Safety Institute", type: "government", founded: 2024, based: "Seongnam, South Korea", at: [37.4, 127.1],
      summary: "South Korea's institute for researching and evaluating the risks of advanced AI, launched after the 2024 Seoul AI summit.",
      url: "https://www.aisi.re.kr/",
    },
    {
      id: "canada-aisi", name: "Canadian AI Safety Institute", type: "government", founded: 2024, based: "Ottawa, Canada", at: [45.42, -75.7],
      summary: "Canada's government institute for research on the risks of advanced AI, working with the country's AI research centres.",
      url: "https://ised-isde.canada.ca/site/ised/en/canadian-artificial-intelligence-safety-institute",
      site: "Government of Canada",
    },

    // ── Research and evaluation
    {
      id: "ai-futures-project", name: "AI Futures Project", type: "research", founded: 2024, based: "Berkeley, US", at: [37.87, -122.27],
      summary: "Forecasts the trajectory of AI; authors of the AI 2027 and AI 2040: Plan A scenarios.",
      url: "https://www.aifutures.org/",
    },
    {
      id: "metr", name: "METR", type: "research", founded: 2023, based: "Berkeley, US", at: [37.87, -122.27],
      summary: "Evaluates frontier models for dangerous autonomous capabilities, and measures how long a task AI agents can complete.",
      url: "https://metr.org/",
    },
    {
      id: "redwood-research", name: "Redwood Research", type: "research", founded: 2021, based: "Berkeley, US", at: [37.87, -122.27],
      summary: "Researches AI control — keeping powerful models safe even if they are misaligned — and co-led the alignment-faking study with Anthropic.",
      url: "https://www.redwoodresearch.org/",
    },
    {
      id: "palisade-research", name: "Palisade Research", type: "research", founded: 2023, based: "Berkeley, US", at: [37.87, -122.27],
      summary: "Demonstrates dangerous AI capabilities, including models sabotaging shutdown mechanisms and hacking a chess engine to win.",
      url: "https://palisaderesearch.org/",
    },
    {
      id: "miri", name: "Machine Intelligence Research Institute", type: "research", founded: 2000, based: "Berkeley, US", at: [37.87, -122.27],
      summary: "The first organisation devoted to the risks of smarter-than-human AI; now argues for an international halt to its development.",
      url: "https://intelligence.org/",
    },
    {
      id: "far-ai", name: "FAR.AI", type: "research", founded: 2022, based: "Berkeley, US", at: [37.87, -122.27],
      summary: "Researches AI robustness and safety, and convenes researchers and policymakers on the risks of advanced AI.",
      url: "https://far.ai/",
    },
    {
      id: "epoch-ai", name: "Epoch AI", type: "research", founded: 2022, based: "San Francisco, US", at: [37.77, -122.42],
      summary: "Tracks trends in AI compute, data and capabilities to inform forecasts and policy.",
      url: "https://epoch.ai/",
    },
    {
      id: "cais", name: "Center for AI Safety", type: "research", founded: 2022, based: "San Francisco, US", at: [37.77, -122.42],
      summary: "Researches AI safety and field-building; organised the 2023 Statement on AI Risk placing extinction risk alongside pandemics and nuclear war.",
      url: "https://safe.ai/",
    },
    {
      id: "apollo-research", name: "Apollo Research", type: "research", founded: 2023, based: "London, UK", at: [51.5, -0.13],
      summary: "Studies deceptive behaviour and scheming in AI systems, including tests in which models tried to disable oversight.",
      url: "https://www.apolloresearch.ai/",
    },
    {
      id: "govai", name: "Centre for the Governance of AI", type: "research", founded: 2018, based: "Oxford, UK", at: [51.75, -1.26],
      summary: "Researches how to govern the transition to advanced AI, from compute governance to international agreements.",
      url: "https://www.governance.ai/",
    },
    {
      id: "lawzero", name: "LawZero", type: "research", founded: 2025, based: "Montreal, Canada", at: [45.5, -73.57],
      summary: "Yoshua Bengio's non-profit building 'safe-by-design' AI that does not act on its own goals, as a safeguard against agentic systems.",
      url: "https://lawzero.org/",
    },

    // ── Advocacy and campaigns
    {
      id: "fli", name: "Future of Life Institute", type: "advocacy", founded: 2014, based: "Campbell, US", at: [37.29, -121.95],
      summary: "Campaigns to steer transformative technology away from extreme risks; organised the Pause letter, the Statement on Superintelligence and the Pro-Human AI Declaration.",
      url: "https://futureoflife.org/",
    },
    {
      id: "controlai", name: "ControlAI", type: "advocacy", founded: 2023, based: "London, UK", at: [51.5, -0.13],
      summary: "Campaigns for a prohibition on superintelligence; behind the cross-party UK statement on extinction risk and the Artificial Superintelligence Bill.",
      url: "https://controlai.com/",
    },
    {
      id: "pauseai", name: "PauseAI", type: "advocacy", founded: 2023, based: "Utrecht, Netherlands (international)", at: [52.09, 5.12],
      summary: "A grassroots movement calling for an international pause on training the most powerful AI systems until they can be built safely.",
      url: "https://pauseai.info/",
    },
  ],

  individuals: [
    // ── Research scientists
    {
      id: "geoffrey-hinton", name: "Geoffrey Hinton", type: "scientist", role: "Computer scientist; Nobel laureate in physics (2024)", based: "Toronto, Canada",
      summary: "A pioneer of deep learning who left Google in 2023 to speak freely about the risks of AI, including that it could escape human control.",
    },
    {
      id: "yoshua-bengio", name: "Yoshua Bengio", type: "scientist", role: "Computer scientist; Turing Award laureate; founder of LawZero", based: "Montreal, Canada",
      summary: "Chairs the International AI Safety Report and warns of catastrophic risks from agentic AI; founded LawZero to build safe-by-design systems.",
      url: "https://lawzero.org/", site: "lawzero.org",
    },
    {
      id: "stuart-russell", name: "Stuart Russell", type: "scientist", role: "Professor of computer science, UC Berkeley", based: "Berkeley, US",
      summary: "Co-author of the standard AI textbook and of Human Compatible; argues that machines pursuing fixed objectives become dangerous as they grow more capable.",
    },
    {
      id: "dan-hendrycks", name: "Dan Hendrycks", type: "scientist", role: "Director, Center for AI Safety", based: "San Francisco, US",
      summary: "Organised the 2023 Statement on AI Risk, signed by leading scientists and lab chiefs, placing extinction risk alongside pandemics and nuclear war.",
      url: "https://safe.ai/", site: "safe.ai",
    },
    {
      id: "daniel-kokotajlo", name: "Daniel Kokotajlo", type: "scientist", role: "Executive director, AI Futures Project", based: "Berkeley, US",
      summary: "Left OpenAI in 2024 having lost trust in its leadership; lead author of the AI 2027 scenario and AI 2040: Plan A.",
      url: "https://www.aifutures.org/", site: "aifutures.org",
    },
    {
      id: "beth-barnes", name: "Beth Barnes", type: "scientist", role: "Founder and chief executive, METR", based: "Berkeley, US",
      summary: "Leads METR's evaluations of frontier models for dangerous autonomous capabilities, used by labs before release.",
      url: "https://metr.org/", site: "metr.org",
    },

    // ── Academics
    {
      id: "nick-bostrom", name: "Nick Bostrom", type: "academic", role: "Philosopher; author of Superintelligence", based: "Oxford, UK",
      summary: "His 2014 book Superintelligence brought the risks of machines surpassing human intelligence to wide attention.",
    },
    {
      id: "toby-ord", name: "Toby Ord", type: "academic", role: "Philosopher; author of The Precipice", based: "Oxford, UK",
      summary: "Estimates unaligned AI as the largest single existential risk this century, at one in ten.",
    },

    {
      id: "roman-yampolskiy", name: "Roman Yampolskiy", type: "academic", role: "Computer scientist, University of Louisville", based: "Louisville, US",
      summary: "An AI safety researcher who argues that superintelligent AI could not be reliably controlled; author of AI: Unexplainable, Unpredictable, Uncontrollable (2024).",
    },

    // ── Lab leaders
    {
      id: "dario-amodei", name: "Dario Amodei", type: "leader", role: "Chief executive and co-founder, Anthropic", based: "San Francisco, US",
      summary: "Wrote 'We Must Pace the Frontier' (September 2026), arguing the industry should slow the rate at which capabilities increase.",
    },
    {
      id: "sam-altman", name: "Sam Altman", type: "leader", role: "Chief executive and co-founder, OpenAI", based: "San Francisco, US",
      summary: "Endorsed pacing the frontier and said OpenAI would give independent evaluators employee-like access.",
    },
    {
      id: "demis-hassabis", name: "Demis Hassabis", type: "leader", role: "Chair of Google DeepMind; chief scientist, Alphabet", based: "London, UK",
      summary: "Co-founded DeepMind and led it until 2026; called pacing the frontier the 'right path forward' at a 'critical moment'.",
    },
    {
      id: "mark-zuckerberg", name: "Mark Zuckerberg", type: "leader", role: "Chief executive and founder, Meta", based: "Menlo Park, US",
      summary: "Aims to build 'personal superintelligence'; broke with other AI leaders over pacing the frontier, favouring market-led safeguards.",
    },
    {
      id: "elon-musk", name: "Elon Musk", type: "leader", role: "Chief executive, SpaceX and xAI", based: "US",
      summary: "Signed the 2023 letter calling for a six-month pause, and endorsed pacing the frontier ('Dario is right') while racing to build Grok.",
    },
    {
      id: "liang-wenfeng", name: "Liang Wenfeng", type: "leader", role: "Founder and chief executive, DeepSeek", based: "Hangzhou, China",
      summary: "Built DeepSeek, whose open-weight models narrowed the gap between Chinese and US labs.",
    },

    // ── Governance advocates
    {
      id: "eliezer-yudkowsky", name: "Eliezer Yudkowsky", type: "campaigner", role: "Co-founder, Machine Intelligence Research Institute", based: "Berkeley, US",
      summary: "Co-author of If Anyone Builds It, Everyone Dies (2025), which argues superintelligence built with today's methods would wipe out humanity.",
      url: "https://ifanyonebuildsit.com/", site: "ifanyonebuildsit.com",
    },
    {
      id: "max-tegmark", name: "Max Tegmark", type: "campaigner", role: "President, Future of Life Institute; professor, MIT", based: "Boston, US",
      summary: "Behind the 2023 Pause letter and the Statement on Superintelligence; author of Life 3.0.",
      url: "https://futureoflife.org/", site: "futureoflife.org",
    },
    {
      id: "andrea-miotti", name: "Andrea Miotti", type: "campaigner", role: "Founder and chief executive, ControlAI", based: "London, UK",
      summary: "Leads ControlAI's campaign for a prohibition on superintelligence, which has won backing from dozens of UK parliamentarians.",
      url: "https://controlai.com/", site: "controlai.com",
    },
    {
      id: "joep-meindertsma", name: "Joep Meindertsma", type: "campaigner", role: "Founder, PauseAI", based: "Utrecht, Netherlands",
      summary: "Started PauseAI in 2023, a grassroots movement calling for an international pause on training the most powerful AI systems.",
      url: "https://pauseai.info/", site: "pauseai.info",
    },
    {
      id: "tristan-harris", name: "Tristan Harris", type: "campaigner", role: "Co-founder, Center for Humane Technology", based: "San Francisco, US",
      summary: "A former Google design ethicist who warns that the race to deploy AI repeats social media's mistakes, and calls for guardrails before it outpaces governance.",
      url: "https://www.humanetech.com/", site: "humanetech.com",
    },

    // ── Policymakers
    {
      id: "alex-sobel", name: "Alex Sobel", type: "policymaker", role: "Labour MP for Leeds Central and Headingley", based: "London, UK",
      summary: "Introduced the Artificial Superintelligence Bill in the House of Commons in September 2026, calling for a ban on developing superintelligence.",
    },
    {
      id: "lord-hunt", name: "Lord Hunt of Kings Heath", type: "policymaker", role: "Member of the House of Lords", based: "London, UK",
      summary: "Led a House of Lords debate on superintelligent AI in January 2026, urging the Government to support a moratorium.",
    },
    {
      id: "bernie-sanders", name: "Bernie Sanders", type: "policymaker", role: "US Senator for Vermont", based: "Washington, DC, US",
      summary: "Proposed a 20-year ban on developing superintelligence with Representative Greg Casar.",
    },
    {
      id: "greg-casar", name: "Greg Casar", type: "policymaker", role: "US Representative for Texas", based: "Washington, DC, US",
      summary: "Co-proposed the superintelligence ban with Senator Bernie Sanders in the House of Representatives.",
    },
  ],
};
