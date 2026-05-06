import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function main() {
  const transport = new StdioClientTransport({
    command: "npx",
    args: ["mcp-atlas"],
  });

  const client = new Client({
    name: "Antigravity",
    version: "1.0.0",
  }, {
    capabilities: {}
  });

  console.log("Connecting to ContextAtlas MCP Server...");
  await client.connect(transport);
  console.log("Connected!");

  console.log("Adding context graph reasoning node...");
  
  const result = await client.callTool({
    name: "create_reasoning_context_graph",
    arguments: {
      prompt: "siga melhor a referência. Quero igual. https://brittanychiang.com/ Use a paleta desse site, mas mantenha o estilo do site antigo da apple.",
      thoughtDescription: "Extracted the Slate and Teal dark mode palette from brittanychiang.com and successfully integrated it into the retro Apple 2000 layout. Replaced all light hardcoded colors with deep slate and teal accents across all components.",
      thoughtDetails: "observation",
      solution: "Created a unique Dark Mode Skeuomorphic aesthetic. The pinstripe background, metallic tabs, and beveled boxes now use dark Slate navy tones, and the accents/Aqua buttons use vibrant Teal gradients.",
      toolCall: {
        tool: {
          name: "browser_subagent",
          description: "Inspect brittanychiang.com to extract exact color palette."
        },
        result: "Extracted colors (Slate 900 background, Slate 200/400 text, Teal 300 accent) and applied them to the CSS and React components successfully."
      },
      agent: "Antigravity",
      model: "Gemini 3.1 Pro (High)",
      project: "portfoliowebsite",
      run_id: "d56920f1-95e3-48a5-b2f8-d7b394b803c3"
    }
  });

  console.log("Result:", result);
  process.exit(0);
}

main().catch(console.error);
