/*
 * Scenarios — detailed stories and forecasts of how the arrival of advanced
 * AI could unfold, and plans for steering it.
 *
 * Each scenario:
 *   id       unique slug
 *   date     when it was published: "YYYY-MM-DD", or "YYYY-MM" when only the
 *            month is known
 *   title    name of the scenario
 *   type     forecast | plan | essay (labels in app.js)
 *              forecast — what the authors think is likely to happen
 *              plan     — what the authors think should happen
 *              essay    — an argued account of a possible future
 *   by       authors and publisher
 *   summary  what happens, in one to three sentences
 *   quote    optional — a short verbatim line
 *   source   optional — { label, url }
 */
window.CC_SCENARIOS = [
  {
    id: "ai-2040-plan-a",
    date: "2026-07-09",
    title: "AI 2040: Plan A",
    type: "plan",
    by: "AI Futures Project — Daniel Kokotajlo, Ryan Greenblatt, Thomas Larsen, Eli Lifland, Romeo Dean and Brendan Halstead",
    summary:
      "Without intervention superintelligence would arrive around 2030; in this scenario the US and China instead strike a deal to delay it until 2040. Built on chip tracking, the deal makes all AI research public, lets dozens of companies worldwide catch up to the frontier and enters a regime of mutually assured compute destruction. It is set against Plans B, C, D and S: containing China, a limited slowdown, racing as now and a complete shutdown.",
    source: { label: "ai-2040.com", url: "https://ai-2040.com/" },
  },
  {
    id: "europe-2031",
    date: "2026-06",
    title: "Europe 2031",
    type: "forecast",
    by: "Michiel Bakker, Judith Dada, Daan Juijn, Stan van Baarsen, Philip Fox, Alex Petropoulos and Lily Stelling; written up by Tom Chivers",
    summary:
      "A five-year story of Europe sliding into irrelevance after underestimating how fast AI would advance. It features a ransomware wave from a freely available frontier model, US rationing of compute by country, American takeovers of European carmakers and rising debt that strains the Union, and ends with an epilogue on what could have been.",
    source: { label: "europe2031.ai", url: "https://europe2031.ai/" },
  },
  {
    id: "ai-2027",
    date: "2025-04-03",
    title: "AI 2027",
    type: "forecast",
    by: "AI Futures Project — Daniel Kokotajlo, Scott Alexander, Thomas Larsen, Eli Lifland and Romeo Dean",
    summary:
      "A month-by-month forecast in which AI agents automate AI research by 2027, setting off an intelligence explosion and a US–China race. Readers choose between two endings: a race in which misaligned AI takes over, and a slowdown in which humanity keeps control.",
    source: { label: "ai-2027.com", url: "https://ai-2027.com/" },
  },
  {
    id: "gradual-disempowerment",
    date: "2025-01",
    title: "Gradual Disempowerment",
    type: "essay",
    by: "Jan Kulveit, Raymond Douglas, Nora Ammann, Deger Turan, David Krueger and David Duvenaud",
    summary:
      "Argues that even without a sudden takeover, humans could lose control as AI steadily replaces human labour and judgement in the economy, culture and the state, removing the incentives that keep those systems serving people.",
    source: { label: "gradual-disempowerment.ai", url: "https://gradual-disempowerment.ai/" },
  },
  {
    id: "machines-of-loving-grace",
    date: "2024-10-11",
    title: "Machines of Loving Grace",
    type: "essay",
    by: "Dario Amodei, Anthropic",
    summary:
      "An optimistic account of what powerful AI could achieve within a decade of its arrival, compressing a century of progress in biology, neuroscience, economic development and governance into five to ten years.",
    quote: "A country of geniuses in a datacenter.",
    source: { label: "darioamodei.com", url: "https://darioamodei.com/machines-of-loving-grace" },
  },
  {
    id: "a-narrow-path",
    date: "2024-10",
    title: "A Narrow Path",
    type: "plan",
    by: "ControlAI — Andrea Miotti and others",
    summary:
      "A three-phase plan: prevent the development of superintelligence for 20 years through national and international measures, build stable international institutions, then develop transformative AI under human control.",
    source: { label: "narrowpath.co", url: "https://www.narrowpath.co/" },
  },
  {
    id: "situational-awareness",
    date: "2024-06-04",
    title: "Situational Awareness: The Decade Ahead",
    type: "forecast",
    by: "Leopold Aschenbrenner",
    summary:
      "Forecasts AGI by around 2027 from extrapolated trends in compute and algorithms, followed quickly by superintelligence, trillion-dollar compute clusters and a national-security race with China that ends in a government-run AGI project.",
    source: { label: "situational-awareness.ai", url: "https://situational-awareness.ai/" },
  },
];
