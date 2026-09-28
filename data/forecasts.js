/*
 * Timelines — forecasts of when AGI or superintelligence will arrive, from
 * lab leaders, researchers and forecasters, and surveys and forecasting
 * platforms (the Timelines page).
 *
 * Each forecast:
 *   id       unique slug
 *   who      who made it
 *   kind     leaders | forecasters | surveys (the category pills)
 *   made     when it was made: YYYY, YYYY-MM or YYYY-MM-DD
 *   what     the milestone forecast, in their terms
 *   year     the central or most likely year (optional if only a range)
 *   low/high optional — the range given; `open: true` for "or later"
 *   note     what they said; quotes are verbatim
 *   source   { label, url }
 *   entry    optional — "page:id" of the same item elsewhere on the site
 */
window.CC_FORECASTS = [
  // ── Lab leaders
  { id: "musk-2024", who: "Elon Musk", kind: "leaders", made: "2024-04-08", what: "AI smarter than the smartest human",
    year: 2025, low: 2025, high: 2026,
    note: "'If you define AGI as smarter than the smartest human, I think it's probably next year, within two years.'",
    source: { label: "Fortune", url: "https://fortune.com/2024/04/09/elon-musk-ai-smarter-than-humans-by-next-year" } },
  { id: "amodei-2024", who: "Dario Amodei", kind: "leaders", made: "2024-10-11", what: "'Powerful AI', smarter than a Nobel laureate in most fields",
    year: 2026, open: true,
    note: "Wrote that powerful AI 'could come as early as 2026', though it could also take much longer.",
    source: { label: "darioamodei.com", url: "https://darioamodei.com/machines-of-loving-grace" }, entry: "materials:machines-of-loving-grace" },
  { id: "legg", who: "Shane Legg, Google DeepMind", kind: "leaders", made: "2023-10", what: "Minimal AGI",
    year: 2028,
    note: "Has put a 50% chance on AGI by 2028 for some twenty years, and still does.",
    source: { label: "Dwarkesh Podcast", url: "https://www.dwarkesh.com/p/shane-legg" } },
  { id: "altman-2024", who: "Sam Altman", kind: "leaders", made: "2024-09-23", what: "Superintelligence",
    low: 2030, high: 2035,
    note: "Wrote that 'it is possible that we will have superintelligence in a few thousand days'.",
    source: { label: "ia.samaltman.com", url: "https://ia.samaltman.com/" } },
  { id: "hassabis-2025", who: "Demis Hassabis", kind: "leaders", made: "2025-04-20", what: "AGI: all the capabilities humans have",
    low: 2030, high: 2035,
    note: "Said AGI will arrive 'in the next five to ten years'.",
    source: { label: "CBS News", url: "https://www.cbsnews.com/news/artificial-intelligence-google-deepmind-ceo-demis-hassabis-60-minutes-transcript/" } },

  // ── Researchers and forecasters
  { id: "aschenbrenner", who: "Leopold Aschenbrenner", kind: "forecasters", made: "2024-06-04", what: "AGI",
    year: 2027,
    note: "Argued that AGI by 2027 is 'strikingly plausible', from the trends in compute and algorithms, with superintelligence soon after.",
    source: { label: "situational-awareness.ai", url: "https://situational-awareness.ai/" }, entry: "materials:situational-awareness" },
  { id: "ai-2027", who: "AI Futures Project (AI 2027)", kind: "forecasters", made: "2025-04-03", what: "A superhuman coder, then superintelligence",
    year: 2027,
    note: "The month-by-month scenario in which AI that automates AI research arrives in 2027 and superintelligence follows within the year.",
    source: { label: "ai-2027.com", url: "https://ai-2027.com/" }, entry: "materials:ai-2027" },
  { id: "aifp-2026", who: "Daniel Kokotajlo, AI Futures Project", kind: "forecasters", made: "2026", what: "A superhuman coder",
    year: 2030,
    note: "Updated forecasts have pushed the AI 2027 authors' timelines back: Kokotajlo's median for a superhuman coder is now 2030.",
    source: { label: "AI Futures Project", url: "https://blog.aifutures.org/p/q25-2026-timelines-update-uplift" } },
  { id: "ai-2040", who: "AI Futures Project (AI 2040)", kind: "forecasters", made: "2026-07-09", what: "Superintelligence, without intervention",
    year: 2030,
    note: "AI 2040: Plan A assumes that without intervention superintelligence would arrive around 2030, and imagines a US–China deal to delay it to 2040.",
    source: { label: "ai-2040.com", url: "https://ai-2040.com/" }, entry: "materials:ai-2040-plan-a" },
  { id: "hinton-2023", who: "Geoffrey Hinton", kind: "forecasters", made: "2023-05", what: "AI smarter than people",
    low: 2028, high: 2043,
    note: "Said AI could be smarter than us in 5 to 20 years, 'without much confidence'; he had previously thought 20 to 50.",
    source: { label: "LessWrong", url: "https://www.lesswrong.com/posts/bLvc7XkSSnoqSukgy/a-brief-collection-of-hinton-s-recent-comments-on-agi-risk" } },

  // ── Surveys and forecasting platforms
  { id: "metaculus-weak", who: "Metaculus: weakly general AI", kind: "surveys", made: "2026", what: "Weakly general AI (no robotics)",
    year: 2028,
    note: "The community's median for a weakly general AI system being publicly known is June 2028.",
    source: { label: "Metaculus", url: "https://www.metaculus.com/questions/3479/date-weakly-general-ai-is-publicly-known/" } },
  { id: "aggregate", who: "Combined forecast (AGI Timelines Dashboard)", kind: "surveys", made: "2026-09-03", what: "AGI",
    year: 2031, low: 2027, high: 2044,
    note: "Combining forecasts from several platforms: AGI in 2031, with an 80% chance of between 2027 and 2044.",
    source: { label: "AGI Timelines Dashboard", url: "https://agi.goodheartlabs.com/" } },
  { id: "metaculus-agi", who: "Metaculus: general AI", kind: "surveys", made: "2026", what: "A general AI system, with robotics",
    year: 2033, low: 2029,
    note: "More than 1,800 forecasters put the median at January 2033, with a 25% chance by 2029.",
    source: { label: "Metaculus", url: "https://www.metaculus.com/questions/5121/date-of-artificial-general-intelligence/" } },
  { id: "aiimpacts-2023", who: "AI Impacts survey of 2,778 AI researchers", kind: "surveys", made: "2023-10", what: "Machines outperforming humans at every task",
    year: 2047, low: 2027,
    note: "A 50% chance by 2047 and 10% by 2027: 13 years earlier than the same survey a year before.",
    source: { label: "arXiv", url: "https://arxiv.org/abs/2401.02843" } },
  { id: "aiimpacts-2022", who: "AI Impacts survey, 2022", kind: "surveys", made: "2022-08", what: "Machines outperforming humans at every task",
    year: 2060,
    note: "The previous survey's 50% date, before the arrival of ChatGPT.",
    source: { label: "AI Impacts", url: "https://wiki.aiimpacts.org/ai_timelines/predictions_of_human-level_ai_timelines/ai_timeline_surveys/2023_expert_survey_on_progress_in_ai" } },
];
