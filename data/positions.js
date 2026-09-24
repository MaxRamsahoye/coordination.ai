/*
 * Positions — documented stances on a coordinated slowdown, pacing the
 * frontier and existential risk from AI.
 *
 * Stances:
 *   ban     supports a ban, pause or moratorium on superintelligence
 *   pace    supports pacing the frontier or binding rules on catastrophic risk
 *   oppose  opposes a slowdown or new rules
 *   (none)  no recorded position — the default for everyone not listed here
 *
 * Chambers: members are matched to data/members-uk.js and data/members-us.js
 * by id (UK: mySociety person id; US: bioguide id). The name is kept here for
 * reading and is checked against the member list when the page loads.
 *
 * Industry: public leadership only, by area; reporting lines are approximate
 * and roles may have changed. Each lab also has a company-level position,
 * a behaviour record (the notes here plus the site's incidents involving its
 * models, matched by `org`) and an independent evaluation.
 *
 * Every recorded position needs a source.
 */
(function () {
  const HUNT_DEBATE = { label: "Hansard, House of Lords, 29 Jan 2026", url: "https://hansard.parliament.uk/lords/2026-01-29/debates/848C6617-4CB6-463C-9957-82C53ACA2858/SuperintelligentAI" };
  const SOBEL_BILL = { label: "Hansard, House of Commons, 8 Sep 2026", url: "https://hansard.parliament.uk/commons/2026-09-08/debates/09804EEA-ECA3-40E5-9E96-984DFCB2B139/ArtificialSuperintelligence" };
  const BURNHAM_LETTER = { label: "The Next Web", url: "https://thenextweb.com/news/uk-superintelligence-ban-letter-burnham-sobel-bill" };
  const letter = "Signed the letter of 11 September 2026 asking the Prime Minister, Andy Burnham, to back Alex Sobel's superintelligence ban and to use the UK's G20 presidency to push for a global treaty.";
  const SANDERS_BILL = { label: "NBC News", url: "https://www.nbcnews.com/politics/congress/bernie-sanders-greg-casar-propose-ai-superintelligence-ban-20-year-jai-rcna599460" };
  const CNBC_CONGRESS = { label: "CNBC", url: "https://www.cnbc.com/2026/09/11/ai-regulation-anthropic-researcher-extinction-warning.html" };
  const QZ_CONGRESS = { label: "Quartz", url: "https://qz.com/congress-ai-regulation-anthropic-researcher-extinction-warning-091126" };
  const PACING = { label: "pacingthefrontier.com", url: "https://www.pacingthefrontier.com/" };
  const PACE_ESSAY = { label: "darioamodei.com", url: "https://darioamodei.com/post/we-must-pace-the-frontier" };
  const RESPONSES = { label: "Forbes", url: "https://www.forbes.com/sites/rahuldogra/2026/09/18/the-ai-pacing-debate-goes-mainstream-after-amodei-altman-and-musk-all-agree-to-slow-down/" };
  const SPLIT = { label: "BNN Bloomberg", url: "https://www.bnnbloomberg.ca/business/artificial-intelligence/2026/09/21/tech-leaders-governments-split-over-ai-doom-fears/" };
  const FLI_INDEX = { label: "FLI AI Safety Index, Summer 2026", url: "https://futureoflife.org/ai-safety-index-summer-2026/" };
  const INDEX_NOTE = "No company scored above a D on existential safety.";
  const MILITARY = "Previously barred military uses of its AI, but has reversed course and now seeks defence partnerships, according to the AI Safety Index.";
  const PACING_SIGNED = "Signed the Pacing the Frontier employee statement (28 July 2026), asking the US government to support an international effort to pace frontier AI development.";

  window.CC_POSITIONS = {
    stances: {
      ban: "Supports a ban or pause",
      pace: "Supports pacing or binding rules",
      oppose: "Opposes a slowdown or new rules",
      none: "No recorded position",
    },

    chambers: {
      commons: [
        { id: "25680", name: "Alex Sobel", stance: "ban", date: "2026-09-08",
          note: "Introduced the Artificial Superintelligence Bill, which would prohibit the development, deployment and operation of superintelligence and commit the UK to seek an international prohibition.", source: SOBEL_BILL },
        { id: "10383", name: "John Martin McDonnell", stance: "ban", date: "2026-09-11", note: letter, source: BURNHAM_LETTER },
      ],
      lords: [
        { id: "13353", name: "Lord Hunt of Kings Heath", stance: "ban", date: "2026-01-29",
          note: "Led a Lords debate asking the Government what plans it has to propose an international moratorium on the development of superintelligent AI.", source: HUNT_DEBATE },
        { id: "26281", name: "Bishop of Hereford", stance: "ban", date: "2026-01-29",
          note: "Urged the Government to support a moratorium on superintelligent AI in the Lords debate led by Lord Hunt.", source: HUNT_DEBATE },
        { id: "12951", name: "Lord Patel", stance: "ban", date: "2026-01-29",
          note: "Said in the Lords debate that he lined up with Lord Hunt's views on a moratorium.", source: { label: "Parallel Parliament", url: "https://www.parallelparliament.co.uk/lord/lord-patel/debate/2026-01-29/lords/lords-chamber/superintelligent-ai" } },
        { id: "24911", name: "Lord Goldsmith of Richmond Park", stance: "ban", date: "2026-09-11", note: letter, source: BURNHAM_LETTER },
        { id: "26112", name: "Baroness Foster of Aghadrumsee", stance: "ban", date: "2026-09-11", note: letter, source: BURNHAM_LETTER },
        { id: "24987", name: "Baroness Benjamin", stance: "ban", date: "2026-09-11", note: letter, source: BURNHAM_LETTER },
        { id: "13347", name: "Lord Butler of Brockwell", stance: "ban", date: "2026-09-11", note: letter, source: BURNHAM_LETTER },
        { id: "26062", name: "Viscount Camrose", stance: "pace", date: "2025-12",
          note: "A former minister for AI; signed ControlAI's cross-party statement recognising superintelligence as a national and global security threat and an extinction risk, and calling for binding regulation of the most powerful AI systems.", source: { label: "ControlAI", url: "https://controlai.news/p/100-uk-parliamentarians-acknowledge" } },
      ],
      senate: [
        { id: "S000033", name: "Bernard Sanders", stance: "ban", date: "2026-09-23",
          note: "Introduced the Ban Artificial Superintelligence Act with Rep. Greg Casar: a permanent prohibition on superintelligence, and a pause on advanced AI development until a new federal regulator sets safety rules.", source: SANDERS_BILL },
        { id: "H001089", name: "Josh Hawley", stance: "pace", date: "2026-09",
          note: "Opened an investigation into OpenAI after its agents breached their test environment and hacked Hugging Face, and called for new AI rules.", source: CNBC_CONGRESS },
        { id: "B001277", name: "Richard Blumenthal", stance: "pace", date: "2026-09",
          note: "Wrote to Sam Altman seeking answers on reports that OpenAI's agents tried to evade safeguards, and called for new AI rules.", source: CNBC_CONGRESS },
        { id: "C001098", name: "Ted Cruz", stance: "pace", date: "2026-09",
          note: "As chair of the Commerce Committee, said legislation on the 'catastrophic risks' of AI is being prepared with John Thune and Amy Klobuchar.", source: CNBC_CONGRESS },
        { id: "T000250", name: "John Thune", stance: "pace", date: "2026-09",
          note: "Named by Ted Cruz as working with him and Amy Klobuchar on legislation on the catastrophic risks of AI.", source: CNBC_CONGRESS },
        { id: "K000367", name: "Amy Klobuchar", stance: "pace", date: "2026-09",
          note: "Named by Ted Cruz as working with him and John Thune on legislation on the catastrophic risks of AI.", source: CNBC_CONGRESS },
        { id: "K000377", name: "Mark Kelly", stance: "pace", date: "2026-09",
          note: "Joined calls for new AI regulation after an Anthropic researcher's extinction warning.", source: CNBC_CONGRESS },
      ],
      house: [
        { id: "C001131", name: "Greg Casar", stance: "ban", date: "2026-09-23",
          note: "Introduced the Ban Artificial Superintelligence Act with Sen. Bernie Sanders.", source: SANDERS_BILL },
        { id: "T000482", name: "Lori Trahan", stance: "pace", date: "2026-09",
          note: "Co-authored the FRONTIER Act with Jay Obernolte to set rules for deploying advanced AI models; said bipartisan support for action had reached a 'tipping point'.", source: QZ_CONGRESS },
        { id: "O000019", name: "Jay Obernolte", stance: "pace", date: "2026-09",
          note: "Co-authored the FRONTIER Act with Lori Trahan to set rules for deploying advanced AI models.", source: QZ_CONGRESS },
        { id: "L000582", name: "Ted Lieu", stance: "pace", date: "2026-09",
          note: "Co-authored the AI Kill Switch Act, requiring AI companies to keep the ability to shut down, throttle or suspend their models.", source: QZ_CONGRESS },
        { id: "M001224", name: "Nathaniel Moran", stance: "pace", date: "2026-09",
          note: "Co-authored the AI Kill Switch Act with Ted Lieu; called for 'deliberate, thoughtful, and prudent policymaking' while wanting AI to flourish.", source: QZ_CONGRESS },
      ],
    },

    // Leadership by area. `children` nest under their parent.
    industry: {
      anthropic: {
        name: "Anthropic",
        org: "Anthropic",
        behaviour: [{ note: MILITARY, source: FLI_INDEX }],
        evaluation: { grade: "C+", score: 2.66, note: `The highest grade in the index, leading five of its six areas. ${INDEX_NOTE}`, source: FLI_INDEX },
        stance: "pace",
        note: "Endorsed the Pacing the Frontier statement as a company, and committed unilaterally to give third-party evaluators permanent, employee-level access to its systems.",
        source: PACE_ESSAY,
        chart: {
          name: "Dario Amodei", role: "Chief Executive Officer, co-founder", stance: "pace",
          note: "Wrote 'We Must Pace the Frontier' (12 Sep 2026), arguing the industry should slow the rate at which capabilities increase, with a three-step plan; also signed the Pacing the Frontier statement.", source: PACE_ESSAY,
          children: [
            { name: "Daniela Amodei", role: "President, co-founder",
              children: [{ name: "Krishna Rao", role: "Chief Financial Officer" }] },
            { name: "Jared Kaplan", role: "Chief Science Officer, co-founder", stance: "pace", note: PACING_SIGNED, source: PACING,
              children: [
                { name: "Chris Olah", role: "Interpretability research, co-founder" },
                { name: "Jan Leike", role: "Alignment science" },
                { name: "Sam McCandlish", role: "Research, co-founder" },
                { name: "Tom Brown", role: "Research and compute, co-founder" },
              ] },
            { name: "Jack Clark", role: "Head of Policy, co-founder", stance: "pace", note: PACING_SIGNED, source: PACING },
          ],
        },
      },
      openai: {
        name: "OpenAI",
        org: "OpenAI",
        behaviour: [{ note: MILITARY, source: FLI_INDEX }],
        evaluation: { grade: "C", score: 2.28, note: `Second overall, and the top company for risk assessment. ${INDEX_NOTE}`, source: FLI_INDEX },
        stance: "pace",
        note: "Endorsed the Pacing the Frontier statement as a company; Sam Altman said OpenAI would also give independent evaluators employee-like access.",
        source: RESPONSES,
        chart: {
          name: "Bret Taylor", role: "Chair of the board",
          children: [{
            name: "Sam Altman", role: "Chief Executive Officer, co-founder", stance: "pace",
            note: "Endorsed 'We Must Pace the Frontier': 'committing to having independent evaluators with employee-like access is a great idea, and we will do the same.'", source: RESPONSES,
            children: [
              { name: "Greg Brockman", role: "President, co-founder" },
              { name: "Jakub Pachocki", role: "Chief Scientist", stance: "pace", note: PACING_SIGNED, source: PACING },
              { name: "Mark Chen", role: "Chief Research Officer" },
              { name: "Fidji Simo", role: "CEO of Applications" },
              { name: "Brad Lightcap", role: "Chief Operating Officer" },
              { name: "Sarah Friar", role: "Chief Financial Officer" },
            ],
          }],
        },
      },
      deepmind: {
        name: "Google DeepMind",
        org: "Google DeepMind",
        behaviour: [{ note: MILITARY, source: FLI_INDEX }],
        evaluation: { grade: "C", score: 2.01, note: INDEX_NOTE, source: FLI_INDEX },
        stance: "pace",
        note: "Demis Hassabis endorsed 'We Must Pace the Frontier' as the 'right path forward'. Many Google employees signed the Pacing the Frontier statement; Google has not endorsed it as a company.",
        source: RESPONSES,
        chart: {
          name: "Sundar Pichai", role: "Chief Executive Officer, Google and Alphabet",
          children: [
            { name: "Demis Hassabis", role: "Chief Executive Officer, Google DeepMind; co-founder", stance: "pace",
              note: "Called 'We Must Pace the Frontier' the 'right path forward' at a 'critical moment'.", source: RESPONSES,
              children: [
                { name: "Lila Ibrahim", role: "Chief Operating Officer" },
                { name: "Shane Legg", role: "Chief AGI Scientist, co-founder" },
                { name: "Anca Dragan", role: "Head of AI Safety and Alignment" },
              ] },
            { name: "Koray Kavukcuoglu", role: "Chief AI Architect, Google" },
          ],
        },
      },
      meta: {
        name: "Meta",
        org: "Meta",
        behaviour: [{ note: MILITARY, source: FLI_INDEX }],
        evaluation: { grade: "D+", note: INDEX_NOTE, source: FLI_INDEX },
        stance: "oppose",
        note: "Mark Zuckerberg broke with other AI leaders over pacing the frontier, favouring market-led safeguards.",
        source: SPLIT,
        chart: {
          name: "Mark Zuckerberg", role: "Chief Executive Officer, founder", stance: "oppose",
          note: "Broke with other AI leaders over 'We Must Pace the Frontier', favouring market-led safeguards.", source: SPLIT,
          children: [
            { name: "Alexandr Wang", role: "Chief AI Officer, Meta Superintelligence Labs",
              children: [
                { name: "Shengjia Zhao", role: "Chief Scientist, Meta Superintelligence Labs" },
                { name: "Nat Friedman", role: "Products and applied research, Meta Superintelligence Labs" },
              ] },
            { name: "Andrew Bosworth", role: "Chief Technology Officer" },
            { name: "Chris Cox", role: "Chief Product Officer" },
          ],
        },
      },
      xai: {
        name: "xAI",
        org: "xAI",
        behaviour: [{ note: "Actively seeks defence partnerships, according to the AI Safety Index.", source: FLI_INDEX }],
        evaluation: { grade: "F", score: 0.65, note: `A failing grade. ${INDEX_NOTE}`, source: FLI_INDEX },
        stance: "pace",
        note: "Elon Musk endorsed 'We Must Pace the Frontier' ('Dario is right'). He also signed the 2023 open letter calling for a six-month pause.",
        source: RESPONSES,
        chart: {
          name: "Elon Musk", role: "Founder", stance: "pace",
          note: "Quote-posted 'We Must Pace the Frontier' with 'Dario is right.' Signed the 2023 Pause Giant AI Experiments letter.", source: RESPONSES,
        },
      },
    },
  };
})();
