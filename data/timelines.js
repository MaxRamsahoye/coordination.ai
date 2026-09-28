/*
 * Histories — what selected leaders have said about AI risk, and about
 * slowing or regulating AI, over the years (Positions › Histories).
 *
 * Each person:
 *   id, name, role
 *   pattern  in a few words, how their position has held or moved
 *   summary  an analysis of how it has stayed the same or changed over time
 *   entries: each
 *     date    YYYY, YYYY-MM or YYYY-MM-DD
 *     stance  ban | pace | oppose — the position the statement took, if any
 *             (as on the rest of Positions); leave out for a warning about
 *             risk that takes no position on slowing down or new rules
 *     title   what happened, in a few words
 *     note    what they said or did; quotes are verbatim
 *     source  { label, url }
 *     entry   optional — "page:id" of the same item elsewhere on the site
 */
(function () {
  const CAIS = { label: "Center for AI Safety", url: "https://safe.ai/statement-on-ai-risk" };
  const CAIS_NOTE = "Signed the one-sentence Statement on AI Risk: 'Mitigating the risk of extinction from AI should be a global priority alongside other societal-scale risks such as pandemics and nuclear war.'";
  const RESPONSES = { label: "Forbes", url: "https://www.forbes.com/sites/rahuldogra/2026/09/18/the-ai-pacing-debate-goes-mainstream-after-amodei-altman-and-musk-all-agree-to-slow-down/" };
  const UN = { label: "Fortune", url: "https://fortune.com/2026/09/23/trump-un-ai-globalist-scheme-altman-amodei-security-council/" };

  window.CC_TIMELINES = [
    {
      id: "altman", name: "Sam Altman", role: "Chief Executive, OpenAI",
      pattern: "Shifted, then shifted back",
      summary: "Has moved more than anyone here. He warned in 2015 that superhuman AI was probably the greatest threat to humanity, and in 2023 asked the Senate to license the most powerful systems. By 2025 he was telling senators that pre-approval would be \"disastrous\" for America's lead. In September 2026 he swung back, backing the pacing proposal and taking the case for international oversight to the UN. What has held is his acknowledgement of the risk; what has changed is whether he wants rules that slow the race.",
      entries: [
        { date: "2015-02-25", title: "Calls superhuman AI the greatest threat",
          note: "Wrote that 'development of superhuman machine intelligence (SMI) is probably the greatest threat to the continued existence of humanity.'",
          source: { label: "blog.samaltman.com", url: "https://blog.samaltman.com/machine-intelligence-part-1" } },
        { date: "2023-02-24", stance: "pace", title: "Planning for AGI and Beyond",
          note: "Set out OpenAI's plan for a gradual transition to AGI, adding that it may become important for the most advanced efforts to agree to limit the growth of compute.",
          source: { label: "OpenAI", url: "https://openai.com/index/planning-for-agi-and-beyond/" } },
        { date: "2023-05-16", stance: "pace", title: "Asks the Senate to license powerful AI",
          note: "Told the Senate Judiciary Committee 'if this technology goes wrong, it can go quite wrong', and proposed a new agency to license the most powerful AI systems.",
          source: { label: "US Senate Judiciary Committee", url: "https://www.judiciary.senate.gov/committee-activity/hearings/oversight-of-ai-rules-for-artificial-intelligence" } },
        { date: "2023-05-30", title: "Signs the Statement on AI Risk", note: CAIS_NOTE, source: CAIS, entry: "statements:cais-statement" },
        { date: "2025-05-08", stance: "oppose", title: "Warns against pre-approval of AI",
          note: "Told the Senate Commerce Committee that requiring government approval before releasing powerful AI would be 'disastrous' for America's lead: a reversal of his 2023 position.",
          source: { label: "The Washington Post", url: "https://www.washingtonpost.com/technology/2025/05/08/altman-congress-openai-regulation/" } },
        { date: "2026-09", stance: "pace", title: "Endorses pacing the frontier",
          note: "Responding to 'We Must Pace the Frontier': 'committing to having independent evaluators with employee-like access is a great idea, and we will do the same.' Went to the UN Security Council with Dario Amodei to ask for international oversight of AI.",
          source: [RESPONSES, UN] },
      ],
    },
    {
      id: "amodei", name: "Dario Amodei", role: "Chief Executive, Anthropic",
      pattern: "Consistent, and firming",
      summary: "The most consistent of the five. Since 2023 he has paired warnings about catastrophic risk (he puts the chance of things going \"really, really badly\" at 25%) with calls for testing and oversight, while making the case for AI's benefits. \"We Must Pace the Frontier\" in 2026 took that a step further, from testing and transparency to an explicit call to slow the rate at which capabilities grow.",
      entries: [
        { date: "2023-05-30", title: "Signs the Statement on AI Risk", note: CAIS_NOTE, source: CAIS, entry: "statements:cais-statement" },
        { date: "2023-07-25", stance: "pace", title: "Warns the Senate on bioweapons",
          note: "Told the Senate Judiciary Committee that AI could help with large-scale biological attacks within two to three years, and called for testing and auditing of powerful models.",
          source: { label: "US Senate Judiciary Committee", url: "https://www.judiciary.senate.gov/committee-activity/hearings/oversight-of-ai-principles-for-regulation" } },
        { date: "2024-10-11", title: "Machines of Loving Grace",
          note: "Set out how powerful AI could compress decades of scientific progress into years, while arguing that the risks must be managed to get there.",
          source: { label: "darioamodei.com", url: "https://darioamodei.com/machines-of-loving-grace" }, entry: "materials:machines-of-loving-grace" },
        { date: "2025-09-17", title: "Puts the chance of catastrophe at 25%",
          note: "Said 'there's a 25% chance that things go really, really badly' with AI.",
          source: { label: "Axios", url: "https://www.axios.com/2025/09/17/anthropic-dario-amodei-p-doom-25-percent" } },
        { date: "2026-09-12", stance: "pace", title: "We Must Pace the Frontier",
          note: "Argued the industry should slow the rate at which capabilities increase — pacing, not pausing — with evaluators embedded in labs, common standards among companies in democracies, and verifiable coordination with authoritarian governments.",
          source: { label: "darioamodei.com", url: "https://darioamodei.com/post/we-must-pace-the-frontier" }, entry: "materials:we-must-pace-the-frontier" },
        { date: "2026-09", stance: "pace", title: "Takes the case to the UN",
          note: "Went to the UN Security Council with Sam Altman to ask for international oversight of AI.",
          source: UN },
      ],
    },
    {
      id: "hassabis", name: "Demis Hassabis", role: "Chair, Google DeepMind",
      pattern: "Consistent",
      summary: "Consistent, if quieter than the others. He has acknowledged the risk of extinction since 2023 and has long argued for international institutions modelled on the IPCC, CERN and the International Atomic Energy Agency. In 2026 he endorsed pacing as the \"right path forward\", in line with what he had said before.",
      entries: [
        { date: "2023-05-30", title: "Signs the Statement on AI Risk", note: CAIS_NOTE, source: CAIS, entry: "statements:cais-statement" },
        { date: "2023-10-24", stance: "pace", title: "Compares AI risk to the climate crisis",
          note: "Said the risks of AI must be taken as seriously as the climate crisis, and proposed international bodies modelled on the IPCC, CERN and the International Atomic Energy Agency.",
          source: { label: "The Guardian", url: "https://www.theguardian.com/technology/2023/oct/24/ai-risk-climate-crisis-google-deepmind-chief-demis-hassabis-regulation" } },
        { date: "2026-08", title: "Steps down as chief executive",
          note: "Became chair of Google DeepMind, handing over as chief executive.",
          source: { label: "Fortune", url: "https://fortune.com/2026/08/05/demis-hassabis-steps-down-google-deepmind-ai-shakeup/" } },
        { date: "2026-09", stance: "pace", title: "Backs pacing the frontier",
          note: "Called 'We Must Pace the Frontier' the 'right path forward' at a 'critical moment'.",
          source: RESPONSES },
      ],
    },
    {
      id: "musk", name: "Elon Musk", role: "Chief Executive, SpaceX and xAI",
      pattern: "Consistent in words, mixed in action",
      summary: "Among the earliest and loudest to warn, from \"summoning the demon\" in 2014 to asking governors to regulate in 2017 and signing the call for a pause in 2023. His words have been consistent; his actions less so. He founded xAI months after calling for a pause, and put the odds of AI going badly at 10 to 20% while raising money to build it. In 2026 he backed pacing.",
      entries: [
        { date: "2014-10-24", title: "'Summoning the demon'",
          note: "Called AI probably humanity's 'biggest existential threat': 'With artificial intelligence we are summoning the demon.'",
          source: { label: "The Guardian", url: "https://www.theguardian.com/technology/2014/oct/27/elon-musk-artificial-intelligence-ai-biggest-existential-threat" } },
        { date: "2017-07-15", stance: "pace", title: "Asks governors to regulate",
          note: "Told the National Governors Association that 'AI is a fundamental risk to the existence of human civilization', and urged regulation before it's too late.",
          source: { label: "NPR", url: "https://www.npr.org/sections/thetwo-way/2017/07/17/537686649/elon-musk-warns-governors-artificial-intelligence-poses-existential-risk" } },
        { date: "2023-03-22", stance: "ban", title: "Signs the call for a pause",
          note: "Signed the open letter asking labs to pause training systems more powerful than GPT-4 for at least six months.",
          source: { label: "Future of Life Institute", url: "https://futureoflife.org/open-letter/pause-giant-ai-experiments/" }, entry: "statements:pause-letter" },
        { date: "2024-10-29", title: "Puts the chance of AI 'going bad' at 10–20%",
          note: "Said AI is 'most likely going to be great', but 'there's some chance, which could be 10 to 20%, that it goes bad', while raising money for xAI.",
          source: { label: "Fortune", url: "https://fortune.com/2024/10/30/elon-musk-ai-could-go-bad-existential-threat-xai-fundraising" } },
        { date: "2026-09", stance: "pace", title: "'Dario is right'",
          note: "Quote-posted 'We Must Pace the Frontier' with 'Dario is right.'",
          source: RESPONSES },
      ],
    },
    {
      id: "zuckerberg", name: "Mark Zuckerberg", role: "Chief Executive, Meta",
      pattern: "Consistently against",
      summary: "Consistently sceptical of AI risk and of slowing down. He called doomsday talk \"pretty irresponsible\" in 2017, championed releasing model weights openly in 2024 and set out Meta's aim of personal superintelligence in 2025. In 2026 he was the one frontier lab leader to reject a coordinated slowdown, preferring each company to act on its own.",
      entries: [
        { date: "2017-07-23", title: "Calls doomsday talk 'irresponsible'",
          note: "Said of AI 'naysayers' who 'drum up these doomsday scenarios': 'I think it's really negative and in some ways I actually think it is pretty irresponsible.'",
          source: { label: "CNBC", url: "https://www.cnbc.com/2017/07/24/mark-zuckerberg-elon-musks-doomsday-ai-predictions-are-irresponsible.html" } },
        { date: "2024-07-23", title: "Open Source AI Is the Path Forward",
          note: "Argued that openly releasing model weights, as Meta does with Llama, is safer and better for the world than keeping the most capable models closed.",
          source: { label: "Meta", url: "https://about.fb.com/news/2024/07/open-source-ai-is-the-path-forward/" } },
        { date: "2025-07-30", title: "Personal Superintelligence",
          note: "Wrote that 'developing superintelligence is now in sight', and set out Meta's aim of personal superintelligence for everyone.",
          source: { label: "Meta", url: "https://www.meta.com/superintelligence/" } },
        { date: "2026-09-15", stance: "oppose", title: "Rejects a coordinated slowdown",
          note: "Broke with the other lab leaders over pacing the frontier, arguing that competition and existing liability give each company reason enough to act on safety alone.",
          source: [{ label: "The Rundown AI", url: "https://www.therundown.ai/news/zuckerberg-meta-coordinated-ai-slowdown" }, { label: "BNN Bloomberg", url: "https://www.bnnbloomberg.ca/business/artificial-intelligence/2026/09/21/tech-leaders-governments-split-over-ai-doom-fears/" }] },
      ],
    },
  ];
})();
