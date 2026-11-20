# VisibilityOS Study Reader

The reader serves the published AI answer study through a read-only MCP endpoint. It provides aggregate results, a single model view, and a comparison of two views. The service does not query AI assistants or need an account.

From the repository root, generate the snapshot with the existing study reproduction script before running or packaging the service.

```sh
python3 study/reproduce.py --json > study-reader/study-data.json
cd study-reader
npm ci
```

The website is in `public/` and the Streamable HTTP endpoint is `/api/mcp`. The service uses Node.js 22. Deployments should include the snapshot generated from the same source revision. Use the [public dataset and study method](https://podpitch.github.io/visibilityos-audit-template/study/dataset/) to interpret counts and rates.
