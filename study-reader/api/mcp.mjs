import {WebStandardStreamableHTTPServerTransport} from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import {createResearchServer} from "../lib/research.mjs";

const origins = new Set([
  "https://chatgpt.com",
  "https://platform.openai.com",
  "https://visibilityos-study-reader.vercel.app",
]);

export default {
  async fetch(request) {
    const origin = request.headers.get("origin");
    if (origin && !origins.has(origin)) {
      return new Response("Origin not allowed", {status: 403});
    }

    if (request.method !== "POST") {
      return new Response(null, {status: 405, headers: {Allow: "POST"}});
    }

    const transport = new WebStandardStreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });
    const server = createResearchServer();
    await server.connect(transport);

    try {
      return await transport.handleRequest(request);
    } finally {
      await server.close();
    }
  },
};
