/*
 * Companions — other websites useful for following AI risk and its
 * governance.
 *
 * Each site:
 *   id       unique slug
 *   name     name
 *   type     guides | trackers | research | newsletters (the category pills)
 *   by       who runs it
 *   summary  what you'll find there, in a sentence or two
 *   url      address
 */
window.CC_COMPANIONS = [
  // ── Guides and courses
  { id: "aisafety-com", name: "AISafety.com", type: "guides", by: "AISafety.com",
    summary: "A hub for getting involved in AI safety: a map of the field's organisations, courses, events, communities, jobs and funding.",
    url: "https://www.aisafety.com/" },
  { id: "aisafety-info", name: "AISafety.info", type: "guides", by: "Rob Miles and volunteers",
    summary: "Plain-language answers to common questions about the risks of advanced AI, from the basics to the technical arguments.",
    url: "https://aisafety.info/" },
  { id: "bluedot", name: "BlueDot Impact", type: "guides", by: "BlueDot Impact",
    summary: "Free courses on AI safety and AI governance, run in small cohorts with facilitated discussion.",
    url: "https://bluedot.org/" },
  { id: "80000-hours", name: "80,000 Hours", type: "guides", by: "80,000 Hours",
    summary: "Career advice and in-depth profiles on working to reduce risks from advanced AI, with a jobs board and a podcast.",
    url: "https://80000hours.org/" },
  { id: "compendium", name: "The Compendium", type: "guides", by: "Connor Leahy, Gabriel Alfour, Chris Scammell, Andrea Miotti and Adam Shimi",
    summary: "An explainer on the extinction risk from AI: how the race to superintelligence works, who is running it and why it's dangerous.",
    url: "https://www.thecompendium.ai/" },
  { id: "keep-the-future-human", name: "Keep the Future Human", type: "guides", by: "Anthony Aguirre",
    summary: "An essay and site arguing we should close the 'gates' to AGI and superintelligence and build controllable AI tools instead.",
    url: "https://keepthefuturehuman.ai/" },

  // ── Trackers and data
  { id: "ai-incident-database", name: "AI Incident Database", type: "trackers", by: "Responsible AI Collaborative",
    summary: "A large open collection of reported harms and near-misses from AI systems deployed in the world.",
    url: "https://incidentdatabase.ai/" },
  { id: "ai-lab-watch", name: "AI Lab Watch", type: "trackers", by: "Zach Stein-Perlman",
    summary: "Scores and tracks what the frontier labs do to avert extreme risks, from safety frameworks to security.",
    url: "https://ailabwatch.org/" },
  { id: "fli-safety-index", name: "AI Safety Index", type: "trackers", by: "Future of Life Institute",
    summary: "Independent expert grades for the frontier labs' safety practices, published each season.",
    url: "https://futureoflife.org/ai-safety-index-summer-2026/" },
  { id: "saferai-ratings", name: "SaferAI ratings", type: "trackers", by: "SaferAI",
    summary: "Ratings of the frontier labs' risk management practices.",
    url: "https://www.safer-ai.org/" },
  { id: "epoch-data", name: "Epoch AI data", type: "trackers", by: "Epoch AI",
    summary: "Data and charts on AI models, training compute, hardware and benchmarks, tracking how fast the frontier moves.",
    url: "https://epoch.ai/data" },
  { id: "metaculus", name: "Metaculus", type: "trackers", by: "Metaculus",
    summary: "Community forecasts on questions about AI progress and its risks, such as when AGI arrives.",
    url: "https://www.metaculus.com/" },

  // ── Research and discussion
  { id: "international-report", name: "International AI Safety Report", type: "research", by: "Chaired by Yoshua Bengio, with experts nominated by 30 countries, the EU, OECD and UN",
    summary: "The international scientific review of what general-purpose AI can do and the risks it poses, updated regularly.",
    url: "https://internationalaisafetyreport.org/" },
  { id: "alignment-forum", name: "AI Alignment Forum", type: "research", by: "Lightcone Infrastructure",
    summary: "Where researchers post and discuss work on aligning and controlling advanced AI.",
    url: "https://www.alignmentforum.org/" },
  { id: "lesswrong", name: "LessWrong", type: "research", by: "Lightcone Infrastructure",
    summary: "A long-running forum on rationality and AI risk, home to much of the early and current debate.",
    url: "https://www.lesswrong.com/" },

  // ── Newsletters
  { id: "ai-safety-newsletter", name: "AI Safety Newsletter", type: "newsletters", by: "Center for AI Safety",
    summary: "Regular updates on developments in AI and AI safety, written for a general audience.",
    url: "https://newsletter.safe.ai/" },
  { id: "import-ai", name: "Import AI", type: "newsletters", by: "Jack Clark",
    summary: "A weekly newsletter on AI research and its implications, from Anthropic's co-founder.",
    url: "https://jack-clark.net/" },
];
