/*
 * Organisations — bodies working on AI safety, evaluation and coordination.
 *
 * Each organisation:
 *   id       unique slug
 *   name     name
 *   type     government | research | advocacy (the filter pills)
 *   founded  year it started (or took its current form)
 *   based    where it's based
 *   summary  what it does, in one or two sentences
 *   url      website
 *   site     optional — link text, when the web address is long (default: its domain)
 */
window.CC_ORGANISATIONS = [
  // ── Government and intergovernmental
  {
    id: "uk-aisi", name: "AI Security Institute", type: "government", founded: 2023, based: "London, UK",
    summary: "The UK government's institute for testing frontier AI models and researching their risks; founded as the AI Safety Institute and renamed in 2025.",
    url: "https://www.aisi.gov.uk/",
  },
  {
    id: "us-caisi", name: "Center for AI Standards and Innovation", type: "government", founded: 2023, based: "Washington, DC, US",
    summary: "The US government's centre for AI evaluation and standards within NIST; founded as the US AI Safety Institute and renamed in 2025.",
    url: "https://www.nist.gov/caisi",
  },
  {
    id: "eu-ai-office", name: "European AI Office", type: "government", founded: 2024, based: "Brussels, EU",
    summary: "The European Commission's office for enforcing the AI Act's rules on general-purpose AI models, including those with systemic risk.",
    url: "https://digital-strategy.ec.europa.eu/en/policies/ai-office",
    site: "European Commission",
  },
  {
    id: "un-scientific-panel", name: "Independent International Scientific Panel on AI", type: "government", founded: 2025, based: "United Nations",
    summary: "A UN panel set up by the General Assembly to report on the risks and impacts of AI, alongside an annual Global Dialogue on AI Governance.",
    url: "https://www.un.org/",
  },

  // ── Research and evaluation
  {
    id: "ai-futures-project", name: "AI Futures Project", type: "research", founded: 2024, based: "Berkeley, US",
    summary: "Forecasts the trajectory of AI; authors of the AI 2027 and AI 2040: Plan A scenarios.",
    url: "https://www.aifutures.org/",
  },
  {
    id: "metr", name: "METR", type: "research", founded: 2023, based: "Berkeley, US",
    summary: "Evaluates frontier models for dangerous autonomous capabilities, and measures how long a task AI agents can complete.",
    url: "https://metr.org/",
  },
  {
    id: "apollo-research", name: "Apollo Research", type: "research", founded: 2023, based: "London, UK",
    summary: "Studies deceptive behaviour and scheming in AI systems, including tests in which models tried to disable oversight.",
    url: "https://www.apolloresearch.ai/",
  },
  {
    id: "redwood-research", name: "Redwood Research", type: "research", founded: 2021, based: "Berkeley, US",
    summary: "Researches AI control — keeping powerful models safe even if they are misaligned — and co-led the alignment-faking study with Anthropic.",
    url: "https://www.redwoodresearch.org/",
  },
  {
    id: "palisade-research", name: "Palisade Research", type: "research", founded: 2023, based: "Berkeley, US",
    summary: "Demonstrates dangerous AI capabilities, including models sabotaging shutdown mechanisms and hacking a chess engine to win.",
    url: "https://palisaderesearch.org/",
  },
  {
    id: "epoch-ai", name: "Epoch AI", type: "research", founded: 2022, based: "San Francisco, US",
    summary: "Tracks trends in AI compute, data and capabilities to inform forecasts and policy.",
    url: "https://epoch.ai/",
  },
  {
    id: "cais", name: "Center for AI Safety", type: "research", founded: 2022, based: "San Francisco, US",
    summary: "Researches AI safety and field-building; organised the 2023 Statement on AI Risk placing extinction risk alongside pandemics and nuclear war.",
    url: "https://safe.ai/",
  },

  // ── Advocacy and campaigns
  {
    id: "fli", name: "Future of Life Institute", type: "advocacy", founded: 2014, based: "Campbell, US and Brussels",
    summary: "Campaigns to steer transformative technology away from extreme risks; organised the Pause letter, the Statement on Superintelligence and the Pro-Human AI Declaration.",
    url: "https://futureoflife.org/",
  },
  {
    id: "controlai", name: "ControlAI", type: "advocacy", founded: 2023, based: "London, UK",
    summary: "Campaigns for a prohibition on superintelligence; behind the cross-party UK statement on extinction risk and the Artificial Superintelligence Bill.",
    url: "https://controlai.com/",
  },
  {
    id: "pauseai", name: "PauseAI", type: "advocacy", founded: 2023, based: "International",
    summary: "A grassroots movement calling for an international pause on training the most powerful AI systems until they can be built safely.",
    url: "https://pauseai.info/",
  },
];
