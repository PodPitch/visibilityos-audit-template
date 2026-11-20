# VisibilityOS Citation Diff

**VisibilityOS by PodPitch** measures how often brands and sources appear when AI assistants answer buying questions. Citation Diff is a small command-line tool for reviewing what changed between two answers. It runs locally and sends no URLs or files to a server.

## Compare two matched answers

Ask the same buyer question under the same conditions, then save the citation URLs as one URL per line in two text files. Use the same engine, model, search setting, language and location. Keep the original answers separately so you can check the citations in context.

Requires Node.js 22 or newer.

```sh
npx visibilityos-citation-diff before.txt after.txt --brand-domain harbor-ledger.example
```

The tool reports individual pages and citation hosts added or removed. In the bundled fictional Harbor Ledger example, the official help page remains cited, while two other pages leave the source list and two appear. One source host disappears and one appears. Use `--json` if you want to save the result for comparing many rounds.

Citation page comparisons ignore fragments, default ports, and duplicates. They preserve query strings because query parameters can identify distinct pages. Host comparisons group the bare domain and its leading `www` version. The optional official-domain check counts the exact domain and its subdomains, with a dot boundary to exclude lookalikes.

Save brand mentions separately from citations. A brand can still be named after its official link disappears. In the VisibilityOS retrospective study, brand presence changed in 82 of 817 matched comparisons, and link status changed in 79.

- [VisibilityOS by PodPitch](https://visibilityos.co/)
- [Study and measurement method](https://visibilityos.co/research/ai-answer-visibility)
- [VisibilityOS audit worksheet and public template](https://github.com/PodPitch/visibilityos-audit-template)
