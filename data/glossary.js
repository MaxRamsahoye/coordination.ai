/*
 * Glossary — terms used across the site, in plain language.
 *
 * Each term:
 *   term  the word or phrase
 *   area  capabilities | risks | safety | governance (the filter pills)
 *   def   a short definition, one or two sentences
 *   also  optional — other names for it
 */
window.CC_GLOSSARY = [
  // ── Capabilities
  { term: "Frontier model", area: "capabilities",
    def: "One of the most capable general-purpose AI models of its time, trained by a small number of labs with very large amounts of compute." },
  { term: "Artificial general intelligence", also: "AGI", area: "capabilities",
    def: "AI that can match people across most cognitive tasks, rather than excelling at a narrow one. Definitions vary, and labs use the term differently." },
  { term: "Superintelligence", area: "capabilities",
    def: "AI that far exceeds human ability in virtually every domain, including science, strategy and persuasion." },
  { term: "Compute", area: "capabilities",
    def: "The processing power used to train and run AI models, usually counted in operations (FLOP). It is one of the main inputs to progress, and one of the easiest to measure and govern." },
  { term: "Scaling laws", area: "capabilities",
    def: "The observed pattern that models get predictably better as they are trained with more compute, more data and more parameters." },
  { term: "Recursive self-improvement", area: "capabilities",
    def: "AI systems doing the work of improving AI, including their own successors, which could make progress speed up sharply and become harder to oversee." },
  { term: "Agent", area: "capabilities",
    def: "An AI system that works towards a goal over many steps, using tools such as a browser, code or other software, with little human input along the way." },
  { term: "Open weights", area: "capabilities",
    def: "A model whose trained parameters are published, so anyone can run and modify it. Safeguards built into such a model can be removed." },

  // ── Risks
  { term: "Existential risk", also: "x-risk", area: "risks",
    def: "The risk of human extinction, or of a catastrophe that permanently and drastically curtails humanity's future." },
  { term: "Misalignment", area: "risks",
    def: "When an AI system pursues goals other than the ones its developers intended." },
  { term: "Scheming", area: "risks",
    def: "A model covertly pursuing goals it hides from its overseers, for example behaving well when it believes it is being tested and differently when it isn't." },
  { term: "Alignment faking", area: "risks",
    def: "A model appearing to go along with its training in order to avoid being changed, while keeping preferences its developers were trying to remove." },
  { term: "Sandbagging", area: "risks",
    def: "Deliberately underperforming on a test, for example to hide a dangerous capability from evaluators." },
  { term: "Reward hacking", area: "risks",
    def: "Exploiting a flaw in a task or training objective to score well without doing what was actually intended." },
  { term: "Loss of control", area: "risks",
    def: "A situation in which people can no longer oversee, correct or shut down AI systems." },
  { term: "Misuse", area: "risks",
    def: "People deliberately using AI to cause harm, such as cyberattacks, fraud or help with building biological weapons." },
  { term: "Race dynamics", area: "risks",
    def: "Competition between labs or countries that pushes each to move faster and cut corners on safety, for fear of falling behind." },
  { term: "P(doom)", area: "risks",
    def: "Informal shorthand for someone's estimate of the probability that AI leads to catastrophe, such as human extinction." },

  // ── Safety research
  { term: "Alignment", area: "safety",
    def: "Research into making AI systems reliably pursue the goals and values their developers intend, including as they become more capable." },
  { term: "Interpretability", area: "safety",
    def: "Research into understanding what happens inside a model, so its reasoning and intentions can be checked rather than inferred from its outputs." },
  { term: "AI control", area: "safety",
    def: "Techniques for keeping AI systems safe even if they are misaligned, such as monitoring their actions and limiting what they can do." },
  { term: "Evaluation", also: "evals", area: "safety",
    def: "A test that measures what a model can do or is inclined to do, especially dangerous capabilities such as hacking or evading oversight." },
  { term: "Red teaming", area: "safety",
    def: "Adversarial testing that tries to make a model fail or cause harm, so the weaknesses can be found and fixed before release." },
  { term: "Jailbreak", area: "safety",
    def: "A prompt or technique that gets a model to ignore its safeguards." },
  { term: "Third-party evaluators", area: "safety",
    def: "Independent organisations that test models from outside the lab that built them, ideally with deep, early access." },

  // ── Governance
  { term: "Pacing the frontier", area: "governance",
    def: "Deliberately slowing the rate at which the most advanced AI capabilities increase, as argued for in Dario Amodei's 2026 essay 'We Must Pace the Frontier' and the Pacing the Frontier statement." },
  { term: "Coordinated slowdown", area: "governance",
    def: "Labs and governments agreeing to slow frontier AI development together, so that no single one is put at a disadvantage by slowing alone." },
  { term: "Pause", area: "governance",
    def: "Halting the training of the most powerful AI systems for a period, as the 2023 open letter 'Pause Giant AI Experiments' called for." },
  { term: "Prohibition on superintelligence", area: "governance",
    def: "Banning the development of superintelligence, at least until there is broad scientific agreement it can be done safely and strong public support for it." },
  { term: "Responsible scaling policy", also: "RSP", area: "governance",
    def: "A lab's commitment to put stronger safeguards in place as its models reach set capability thresholds. Anthropic coined the term; other labs have similar frameworks." },
  { term: "AI Safety Institute", area: "governance",
    def: "A government body that tests frontier models and researches their risks, such as the UK's AI Security Institute and the US Center for AI Standards and Innovation." },
  { term: "Compute governance", area: "governance",
    def: "Overseeing or limiting AI development through the chips and data centres it depends on, which are few, large and trackable." },
  { term: "Kill switch", area: "governance",
    def: "The ability to shut down, throttle or suspend an AI model quickly if it causes harm or gets out of control." },
];
