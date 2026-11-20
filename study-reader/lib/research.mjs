import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {z} from "zod";
import study from "../study-data.json" with {type: "json"};

const publication = {
  study: "https://visibilityos.co/research/ai-answer-visibility",
  dataset: "https://podpitch.github.io/visibilityos-audit-template/study/dataset/",
  scope: "These are aggregate counts from the published matched comparisons. A mention or an official link counts as brand presence. Rates describe this set of prompts and dates. They do not measure platform-wide behavior or explain causes.",
};

const readOnly = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
};

const viewNames = z.enum(study.engine_views.map(view => view.engine_view));
const views = new Map(study.engine_views.map(view => [view.engine_view, view]));

function dataResult(data) {
  const result = {...data, ...publication};
  return {
    content: [{type: "text", text: JSON.stringify(result)}],
    structuredContent: result,
  };
}

export function createResearchServer() {
  const server = new McpServer({name: "visibilityos-study-reader", version: "1.0.0"});

  server.registerTool("read_study_summary", {
    title: "Read the VisibilityOS study",
    description: "Return the study's published totals, presence gains and losses, official-link changes, and per-view counts. Use for aggregate questions about this specific study and its methodology.",
    inputSchema: {},
    annotations: readOnly,
  }, () => dataResult(study));

  server.registerTool("read_engine_view", {
    title: "Read an engine view",
    description: "Return the published comparison count, brand-presence change count and rate for one exact engine view. Engine-specific official-link counts are unavailable in the public dataset.",
    inputSchema: {engine_view: viewNames},
    annotations: readOnly,
  }, ({engine_view}) => dataResult({view: views.get(engine_view)}));

  server.registerTool("compare_engine_views", {
    title: "Compare two engine views",
    description: "Compare the published brand-presence change rates of two engine views in the VisibilityOS study. Return both denominators and the first rate minus the second in percentage points.",
    inputSchema: {first_view: viewNames, second_view: viewNames},
    annotations: readOnly,
  }, ({first_view, second_view}) => {
    const first = views.get(first_view);
    const second = views.get(second_view);
    const gap = (first.presence_change_rate - second.presence_change_rate) * 100;
    return dataResult({
      first,
      second,
      first_minus_second_percentage_points: gap,
    });
  });

  return server;
}
