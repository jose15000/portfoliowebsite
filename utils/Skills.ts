export type SkillType = "Language" | "Framework" | "Database" | "AI";

export const skills: { id: number; type: SkillType; values: string[] }[] = [
    { id: 1, type: "Language", values: ["TypeScript", "Python"] },
    { id: 2, type: "Framework", values: ["React", "Next.js", "Node.js", "Bun"] },
    { id: 3, type: "Database", values: ["PostgreSQL", "Redis", "Prisma"] },
    { id: 4, type: "AI", values: ["AI Agents", "LLM Orchestration", "MCP Protocol", "Graph Systems"] }
];