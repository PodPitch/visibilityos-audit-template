# VisibilityOS AI answer audit template

A repeatable way to see whether AI assistants mention or cite your brand when buyers ask for recommendations. Start with five prompts, capture two rounds, and compare the same prompt under the same conditions.

Try the [interactive audit](https://podpitch.github.io/visibilityos-audit-template/space/) for two rounds in your browser, or use the CSV below to keep a record across several dates.

Use the [AI Citation Evidence Checker](https://visibilityos-citation-audit.vercel.app/) to review whether an AI answer’s cited page supports a specific claim and export your notes.

Use the [AI Brand Match Audit](https://visibilityos-brand-match-audit.web.app/) to check whether a name in an AI answer refers to your company or a similarly named business.

## Run your audit

1. Copy `example.csv` and replace the fictional examples with questions your sales team hears. Include a shortlist question, a use-case question, a geographic question if location matters, a comparison question, and a buying-criteria question. Leave your company name out of open-ended recommendation prompts.
2. Ask each question in a fresh conversation. Use the same wording, engine, model, search setting, country, language, location, and brand definition in both rounds. Save the answer and source links in your working copy. Use one row per question and configuration per UTC date.
3. Mark `mentioned` yes when the answer clearly names your brand. Mark `linked` yes when the answer or its source panel links to your official domain. Verify the identity when another business uses the same name. Leave out failed or incomplete runs instead of recording them as no.
4. Repeat on another day. Run `python3 compare.py your-audit.csv` to report changes between adjacent recorded dates for each matching configuration. Requires Python 3.10+ and no extra packages. Your data stays on your computer.

Try it with `python3 compare.py example.csv`. The fictional example produces five matched comparisons, two presence changes, and two link changes.

Presence means either a mention or a link. A gain or loss is a prompt for review. Open the two answers and cited pages to see whether the product disappeared, the sources changed, or the answer confused it with another brand. Treat these counts as observations from your selected prompts and dates.

Published by [VisibilityOS by PodPitch](https://visibilityos.co/). See the [published study and measurement method](https://visibilityos.co/research/ai-answer-visibility) for an example using real monitoring data.
