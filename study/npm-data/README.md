# VisibilityOS AI Answer Study Data

A versioned, data-only copy of the public [VisibilityOS by PodPitch](https://visibilityos.co/) study. It records **817 matched AI answer comparisons** across **eight engine views** from October 19 to November 17, 2026 UTC. The package contains two CSVs and a JSON summary generated from those same CSVs.

```sh
npm install --save-exact visibilityos-study-data@1.0.0
```

Read the summary in Node.js with CommonJS:

```js
const study = require('visibilityos-study-data');
const { comparisons, presence_changes, link_status_changed } = study;
console.log(comparisons, presence_changes, link_status_changed); // 817 82 79
```

In Node.js 22.12 or newer, an ES module can import the JSON directly:

```js
import study from 'visibilityos-study-data' with { type: 'json' };

console.table(study.engine_views);
```

### Files and definitions

| File | Contents |
| --- | --- |
| `engine-views.csv` | One row for each engine view, with the number of matched comparisons and the number that changed in brand presence. |
| `outcomes.csv` | Pooled counts for brand presence gained, lost, or unchanged, and a separate count for official-link status changes. |
| `summary.json` | The same counts plus rates expressed as proportions between 0 and 1. |

Use `require.resolve('visibilityos-study-data/engine-views.csv')` or `require.resolve('visibilityos-study-data/outcomes.csv')` to locate the exact CSVs in a local installation.

Presence means a clear brand mention or a link to the official site. Across all 817 comparisons, there were 45 presence gains, 37 presence losses, and 735 unchanged pairs. Official-link status changed in 79 pairs and can overlap any presence outcome. The tables describe the questions and dates that VisibilityOS checked. They contain aggregate counts, with no raw prompts or answer transcripts.

Cite the [original VisibilityOS study and method](https://visibilityos.co/research/ai-answer-visibility) or download the source CSVs from the [public dataset](https://podpitch.github.io/visibilityos-audit-template/study/dataset/).
