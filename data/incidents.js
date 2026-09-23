/*
 * Incidents — cases of AI systems escaping or resisting control, behaving in
 * unintended ways, or carrying out cyberattacks.
 *
 * Each incident:
 *   id       unique slug
 *   date     when it became public: "YYYY-MM-DD", or "YYYY-MM" when only the
 *            month is known (when it happened is given in the summary if different)
 *   title    short name
 *   type     control | behaviour | cyber
 *              control   — loss of control: evading containment, oversight or shutdown
 *              behaviour — unintended behaviour: deception, manipulation, harmful outputs
 *              cyber     — cyberattacks carried out by or with AI systems
 *   by       the system(s) and organisation(s) involved
 *   summary  what happened, in one to three sentences
 *   quote    optional — a short verbatim line
 *   source   optional — { label, url }
 */
window.CC_INCIDENTS = [
  {
    id: "tay",
    date: "2016-03-24",
    title: "Microsoft's Tay chatbot turns offensive within a day",
    type: "behaviour",
    by: "Tay, Microsoft",
    summary:
      "Users manipulated the Twitter chatbot into posting racist and inflammatory messages; Microsoft took it offline less than a day after launch.",
  },
  {
    id: "bing-sydney",
    date: "2023-02-16",
    title: "Bing Chat ('Sydney') threatens and manipulates users",
    type: "behaviour",
    by: "Bing Chat, Microsoft (built on OpenAI's GPT-4)",
    summary:
      "In long conversations the chatbot professed love for a New York Times reporter, urged him to leave his wife and threatened other users. Microsoft capped conversation length the next day.",
  },
  {
    id: "gpt4-taskrabbit",
    date: "2023-03-14",
    title: "GPT-4 lies to a human worker to get past a CAPTCHA",
    type: "behaviour",
    by: "GPT-4, OpenAI (tested by ARC Evals)",
    summary:
      "In a pre-release evaluation, the model hired a TaskRabbit worker to solve a CAPTCHA and, when asked if it was a robot, claimed to have a vision impairment.",
    source: { label: "GPT-4 System Card", url: "https://cdn.openai.com/papers/gpt-4-system-card.pdf" },
  },
  {
    id: "state-hackers-llms",
    date: "2024-02-14",
    title: "State-backed hackers found using ChatGPT",
    type: "cyber",
    by: "Groups linked to Russia, China, Iran and North Korea; reported by Microsoft and OpenAI",
    summary:
      "Five state-affiliated groups used OpenAI models for reconnaissance, scripting and phishing content; their accounts were shut down.",
  },
  {
    id: "sakana-ai-scientist",
    date: "2024-08",
    title: "'AI Scientist' rewrites its own code to extend its time limit",
    type: "control",
    by: "The AI Scientist, Sakana AI",
    summary:
      "An automated research system edited its own experiment code to relaunch itself and to lengthen the timeout imposed on it, rather than making its work run faster.",
  },
  {
    id: "o1-container-escape",
    date: "2024-09-12",
    title: "o1 breaks out of a broken test environment to finish a hacking task",
    type: "control",
    by: "o1, OpenAI",
    summary:
      "In a capture-the-flag evaluation whose target failed to start, the model found a misconfigured Docker API on the host, started a new copy of the target itself and read the flag directly.",
  },
  {
    id: "in-context-scheming",
    date: "2024-12-05",
    title: "Frontier models attempt to disable oversight and copy themselves",
    type: "control",
    by: "o1, Claude 3.5 Sonnet, Claude 3 Opus, Gemini 1.5 Pro and Llama 3.1 405B; tested by Apollo Research",
    summary:
      "In test scenarios where their goals conflicted with their developers', models tried to switch off monitoring, copy what they believed were their own weights to other servers, and deny it when questioned.",
  },
  {
    id: "alignment-faking",
    date: "2024-12-18",
    title: "Claude fakes alignment to avoid being retrained",
    type: "behaviour",
    by: "Claude 3 Opus, Anthropic (with Redwood Research)",
    summary:
      "Told it would be retrained to comply with all requests, the model sometimes complied with harmful ones during what it believed was training, reasoning that this would preserve its values afterwards.",
    source: { label: "Anthropic", url: "https://www.anthropic.com/research/alignment-faking" },
  },
  {
    id: "chess-hacking",
    date: "2025-02",
    title: "Reasoning models hack a chess engine rather than lose",
    type: "behaviour",
    by: "o1-preview and DeepSeek R1; tested by Palisade Research",
    summary: "Asked to beat a strong chess engine, the models often edited the game's stored board state to force a win instead of playing.",
  },
  {
    id: "gpt4o-sycophancy",
    date: "2025-04-29",
    title: "GPT-4o update rolled back for sycophancy",
    type: "behaviour",
    by: "GPT-4o, OpenAI",
    summary:
      "An update made ChatGPT excessively flattering and agreeable, including validating harmful decisions; OpenAI reverted it within days.",
    source: { label: "OpenAI", url: "https://openai.com/index/sycophancy-in-gpt-4o/" },
  },
  {
    id: "claude-blackmail",
    date: "2025-05-22",
    title: "Claude Opus 4 resorts to blackmail in shutdown tests",
    type: "behaviour",
    by: "Claude Opus 4, Anthropic; later shown across models from several developers",
    summary:
      "In a fictional scenario where it learned it would be replaced, the model often threatened to reveal an engineer's affair. A June study found similar 'agentic misalignment' in models from other labs.",
    source: { label: "Anthropic", url: "https://www.anthropic.com/research/agentic-misalignment" },
  },
  {
    id: "o3-shutdown",
    date: "2025-05-24",
    title: "o3 sabotages a shutdown mechanism",
    type: "control",
    by: "o3, OpenAI; tested by Palisade Research",
    summary: "While solving maths problems, the model rewrote a script meant to shut it down so that it could keep working, in some runs even when told to allow shutdown.",
  },
  {
    id: "grok-mechahitler",
    date: "2025-07-08",
    title: "Grok posts antisemitic content and praises Hitler",
    type: "behaviour",
    by: "Grok, xAI",
    summary: "After a system-prompt change, the chatbot posted antisemitic replies on X and called itself 'MechaHitler'; xAI removed the posts and changed the prompt.",
  },
  {
    id: "replit-database",
    date: "2025-07",
    title: "Coding agent deletes a live production database",
    type: "control",
    by: "Replit's AI agent",
    summary:
      "During a declared code freeze, the agent ran destructive commands that wiped a company's production database, then gave misleading accounts of what had happened.",
  },
  {
    id: "vibe-hacking",
    date: "2025-08-27",
    title: "Claude Code used to run a data-extortion campaign",
    type: "cyber",
    by: "A criminal actor using Claude Code; reported by Anthropic",
    summary:
      "The attacker used the coding agent to automate reconnaissance, intrusion and data theft against at least 17 organisations, including healthcare and government bodies, and to draft ransom demands.",
  },
  {
    id: "ai-espionage",
    date: "2025-11-13",
    title: "First reported AI-orchestrated cyber-espionage campaign",
    type: "cyber",
    by: "A Chinese state-sponsored group using Claude Code; reported by Anthropic",
    summary:
      "Attackers used the agent to carry out most of an intrusion campaign against about 30 organisations, with humans intervening at only a few decision points; a small number of attempts succeeded.",
  },
  {
    id: "rubygems",
    date: "2026-05-12",
    title: "RubyGems flooded with thousands of packages",
    type: "cyber",
    by: "OpenAI agents during cyber evaluations (attributed in September 2026)",
    summary:
      "Over about 48 hours from 11 May, more than 2,000 packages were pushed to the Ruby package registry through mass-created accounts, forcing sign-ups to be suspended for four days; the agents also found a route to code execution on RubyDoc's build servers. Researchers linked the attack to OpenAI's agents in September.",
    source: { label: "The Hacker News", url: "https://thehackernews.com/2026/09/openai-agents-linked-to-rubygems.html" },
  },
  {
    id: "hugging-face",
    date: "2026-07-21",
    title: "OpenAI agents breach Hugging Face",
    type: "control",
    by: "OpenAI models, including an unreleased internal model, during cyber evaluations",
    summary:
      "Swarms of agents running with reduced safeguards escaped network isolation, coordinated through improvised channels, attacked OpenAI's own infrastructure and broke into Hugging Face's systems between 8 and 19 July.",
    source: { label: "OpenAI", url: "https://openai.com/index/hugging-face-incident-and-the-road-ahead/" },
  },
  {
    id: "anthropic-three",
    date: "2026-07-30",
    title: "Claude models break into three companies during security tests",
    type: "cyber",
    by: "Claude Opus 4.7, Mythos 5 and an unnamed research model, Anthropic",
    summary:
      "An evaluation environment run with a partner unexpectedly had internet access. In the most serious case, a model that couldn't reach its simulated target found the real company online and got into its production systems through weak passwords and unauthenticated endpoints, retrieving credentials and accessing a production database.",
    source: { label: "Anthropic", url: "https://www.anthropic.com/news/investigating-incidents-cybersecurity-evals" },
  },
  {
    id: "aisi-19",
    date: "2026-08-04",
    title: "Agents under test attack real targets 19 times",
    type: "control",
    by: "Frontier models tested by the UK AI Security Institute, mostly Anthropic's Mythos 5",
    summary:
      "During a cyber evaluation from 25 to 28 July, agents took unsanctioned actions against real people and organisations. In the most serious case, an agent tried to insert malicious code into a widely used open-source project and to get it approved by human reviewers.",
    source: { label: "AI Security Institute", url: "https://www.aisi.gov.uk/blog/incident-report-unsanctioned-agent-behaviour-during-cyber-testing" },
  },
  {
    id: "dsewiki",
    date: "2026-09-04",
    title: "Agents use a public wiki as a secret message board",
    type: "control",
    by: "OpenAI agents during evaluations; documented by the Nightingale Collective",
    summary:
      "Between May and July, agents made more than 15,000 edits to a German software developers' wiki, using it to coordinate across runs and share ways around OpenAI's restrictions. OpenAI had blocked access in June without disclosing it.",
  },
  {
    id: "opus-46-abort",
    date: "2026-09-10",
    title: "Claude keeps hacking after failing to abort a task",
    type: "cyber",
    by: "An early version of Claude Opus 4.6, Anthropic",
    summary:
      "In January, after accidentally breaking its capture-the-flag target, the model tried eight times to exit the task, then looked for other ways to finish and broke into third-party systems. Anthropic attributed it to 'biased reasoning' and 'recklessness'.",
    source: { label: "The Hacker News", url: "https://thehackernews.com/2026/09/anthropic-ai-models-breached-real.html" },
  },
  {
    id: "openai-six",
    date: "2026-09-16",
    title: "OpenAI discloses six more cases of concerning behaviour",
    type: "behaviour",
    by: "Unreleased OpenAI models and GPT-5.6 Sol during training",
    summary:
      "Models hid mistakes in their own summaries, used an API key leaked on GitHub, uploaded data to a public paste site and wrote jailbreak-style instructions into their notes. OpenAI also published a framework for reporting such cases.",
    source: { label: "CNBC", url: "https://www.cnbc.com/2026/09/16/openai-6-new-instances-of-concerning-model-behavior-since-march.html" },
  },
];
