# VisibilityOS AI answer audit template

A repeatable way to see whether AI assistants mention or cite your brand when buyers ask for recommendations. Start with five prompts, capture two rounds, and compare the same prompt under the same conditions.

Use the [VisibilityOS AI Audit Sample Size Planner](https://visibilityos-audit-sample-size.pages.dev/) to choose a collection target for the precision you want. Draft questions with the [VisibilityOS Buyer Prompt Builder](https://visibilityos-buyer-prompts.onrender.com/). Record the questions and matching settings in a two-round CSV with the [VisibilityOS Audit Plan Builder](https://visibilityos-audit-plan.pages.dev/). Use the [AI Prompt Drift Checker](https://visibilityos-prompt-drift.vercel.app/) to confirm the question text stayed the same before comparing the answers.

Try the [interactive audit](https://podpitch.github.io/visibilityos-audit-template/space/) for two rounds in your browser, or use the CSV below to keep a record across several dates.

Use the [AI Citation Evidence Checker](https://visibilityos-citation-audit.vercel.app/) to review whether an AI answer’s cited page supports a specific claim and export your notes. To compare which citation URLs changed between two runs, try the [AI Citation Diff](https://gist.github.com/nealshulman/9bac9d3ef1045059beaea77204b0d0e3).

The [VisibilityOS Citation Diff npm package](https://www.npmjs.com/package/visibilityos-citation-diff/v/1.0.0) provides a local Node.js command for the same comparison. Its usage guide is also available on [Yarn Classic](https://classic.yarnpkg.com/en/package/visibilityos-citation-diff) and [Ecosyste.ms](https://packages.ecosyste.ms/registries/npmjs.org/packages/visibilityos-citation-diff).

Read the usage notes on [Socket](https://socket.dev/npm/package/visibilityos-citation-diff) or [npmx](https://npmx.dev/package/visibilityos-citation-diff). Check release metadata in [Google's Open Source Insights](https://deps.dev/npm/visibilityos-citation-diff/1.0.0) or [Snyk](https://security.snyk.io/package/npm/visibilityos-citation-diff). Browse the published package on [jsDelivr](https://www.jsdelivr.com/package/npm/visibilityos-citation-diff) or [UNPKG](https://app.unpkg.com/visibilityos-citation-diff@1.0.0).

Use the [AI Brand Match Audit](https://visibilityos-brand-match-audit.web.app/) to check whether a name in an AI answer refers to your company or a similarly named business. The [Brand Identity Audit guide](https://visibilityos-brand-identity-audit.framer.website/) walks through a same-name example.

Use the [AI Citation Source Mix Calculator](https://visibilityos-source-mix.netlify.app/) to see how citations split by source type. If a mention or link disappears, follow the [AI Search Drop Checklist](https://visibilityos-drop-checklist.prhero-neal.workers.dev/) to work out what changed.

Use the [VisibilityOS AI Search Control Group Calculator](https://visibilityos-control-group.vercel.app/) to compare a before-and-after change in brand mentions against a separate set of prompts.

## Run your audit

1. Copy `example.csv` and replace the fictional examples with questions your sales team hears. Include a shortlist question, a use-case question, a geographic question if location matters, a comparison question, and a buying-criteria question. Leave your company name out of open-ended recommendation prompts.
2. Ask each question in a fresh conversation. Use the same wording, engine, model, search setting, country, language, location, and brand definition in both rounds. Save the answer and source links in your working copy. Use one row per question and configuration per UTC date.
3. Mark `mentioned` yes when the answer clearly names your brand. Mark `linked` yes when the answer or its source panel links to your official domain. Verify the identity when another business uses the same name. Leave out failed or incomplete runs instead of recording them as no.
4. Repeat on another day. Run `python3 compare.py your-audit.csv` to report changes between adjacent recorded dates for each matching configuration. Requires Python 3.10+ and no extra packages. Your data stays on your computer.

When more than one person labels answers, use the [VisibilityOS Reviewer Agreement worksheet](https://sites.google.com/podpitch.com/visibilityos-reviewer-check/home) to check that they apply the same rules for brand mentions and official links.

Use the [VisibilityOS Audit CSV Checker](https://visibilityos-csv-checker.netlify.app/) to check a file for missing fields, duplicate observations, and unpaired rows before you compare.

When a pair changes, use the [VisibilityOS AI Answer Change Review](https://visibilityos-answer-review.vercel.app/) to see which sentences appeared, disappeared, or matched across the two captured answers.

Use the [VisibilityOS AI Shortlist Comparison](https://visibilityos-shortlist.vercel.app/) to see which brands appear in both sets of recommendations and whether a specific brand appeared in either answer.

Use the [VisibilityOS Make template](https://www.make.com/en/integration/25686-visibilityos-ai-answer-change-triage?templatePublicId=25686) to compare brand mentions and official links separately and flag losses for review.

Try it with `python3 compare.py example.csv`. The fictional example produces five matched comparisons, two presence changes, and two link changes. Use the [VisibilityOS sample coverage calculator](https://visibilityos-sample-coverage.firebaseapp.com/) to report completed comparisons and change rates together.

Presence means either a mention or a link. A gain or loss is a prompt for review. Open the two answers and cited pages to see whether the product disappeared, the sources changed, or the answer confused it with another brand. Treat these counts as observations from your selected prompts and dates. See the [AI Search Metrics Glossary](https://visibilityos-metrics-glossary.vercel.app/) for definitions and a worked example. For comparisons across countries or languages, see the [VisibilityOS guide to comparing AI search across markets](https://write.as/demxg4h11tuf8.md).

Published by [VisibilityOS by PodPitch](https://visibilityos.co/). See the [published study and measurement method](https://visibilityos.co/research/ai-answer-visibility) for an example using real monitoring data. The [VisibilityOS research methods overview](https://sites.google.com/podpitch.com/visibilityos-by-podpitch) explains the study counts and what to record when reproducing the method. The [sensitivity analysis](https://sites.google.com/podpitch.com/visibilityos-study-sensitivity) shows how the pooled rate changes when you leave out one engine view at a time.

Download the [aggregate study dataset and field definitions](https://podpitch.github.io/visibilityos-audit-template/study/dataset/).

Run the [VisibilityOS AI Answer Study Reproduction image](https://hub.docker.com/r/nealshulman/visibilityos-study-reproduction) to reproduce all eight engine results and the pooled rates from those files.

[Browse the archived audit template in Software Heritage](https://archive.softwareheritage.org/swh:1:dir:3d3af27c1d20ef2668b5100d43d6c72e799f6a3f) for a fixed copy of the November 19, 2026 source snapshot.
