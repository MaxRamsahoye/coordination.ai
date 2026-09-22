# Coordination Console

A dashboard that tracks coordination on frontier AI: a timeline of events (past and ongoing) and a map of the individuals and institutions involved, with each one's position on **pacing the frontier** and a **coordinated slowdown** of development.

## What's inside

| Section | What it shows |
|---|---|
| **Overview** | Headline counts, where actors stand by sector, the direction of events by year (toward coordination vs. toward racing), latest developments and live processes |
| **Timeline** | About 100 dated events from 2017 to the present. Filter by category, direction, status and actor, or search the text. Each entry links to its sources |
| **Actors** | 65 people and institutions from government, industry, civil society, academia and multilateral bodies. View them as a spectrum board or a table. Each profile has a position, dated evidence, "tension" notes where what they say and what they do diverge, and the timeline events they appear in |
| **Method** | The position scale, how event direction is judged, and how to make corrections |

### Position scale

| Position | Meaning |
|---|---|
| Halt / prohibit | Pause or prohibit frontier or superintelligence development until safety and consent conditions are met |
| Coordinated pacing | Slow or gate the frontier through coordination, red lines, verification or conditional commitments |
| Guardrails | Binding safety rules and oversight, but no general slowdown |
| Proceed & compete | Put speed and competitiveness first, with voluntary or light-touch safeguards |
| Accelerate | Oppose constraints and treat AI as a race to win |
| Unclear | No clear public position |

## Running it

It's a static site with no build step and no dependencies. Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000
```

To deploy on GitHub Pages, go to **Settings → Pages → Deploy from branch → `main` / root**. (`.nojekyll` is included.)

## Editing the data

All content is in three plain JavaScript files, so no fetch or server is needed:

- `data/events.js`: timeline events (`date`, `title`, `category`, `signal` of 1/0/-1, `status` of past/ongoing, `summary`, `actors`, `sources`)
- `data/actors.js`: actors (`kind`, `sector`, `stance` from -2 to 2 or `null`, `summary`, optional `tension`, `evidence`)
- `data/meta.js`: the "data as of" date

Actor ids in `events.js` must match ids in `actors.js`. Check them with:

```sh
node -e 'global.window={};require("./data/events.js");require("./data/actors.js");const A=new Set(window.CC_ACTORS.map(a=>a.id));for(const e of window.CC_EVENTS)for(const a of e.actors)if(!A.has(a))console.log("missing",a,"in",e.id)'
```

Deep links: `#timeline`, `#actors`, `#actor=<id>`, `#event=<id>`.

Positions are editorial summaries of public statements and actions as of the dataset date. Recent entries cover fast-moving stories, so please send corrections with sources.
