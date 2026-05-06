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

  await client.connect(transport);
  
  const result = await client.callTool({
    name: "onboarding",
    arguments: {}
  });

  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}

main().catch(console.error);
