export type SkillType = "languages" | "frameworks" | "databases" | "AI";

export const skills: { id: number; type: SkillType; values: string[] }[] = [
    { id: 1, type: "languages", values: ["TypeScript", "Python"] },
    { id: 2, type: "frameworks", values: ["React", "Next.js", "Node.js", "Bun"] },
    { id: 3, type: "databases", values: ["PostgreSQL", "Redis", "Prisma"] },
    { id: 4, type: "AI", values: ["AI Agents", "LLM Orchestration", "MCP Protocol", "Graph Systems"] }
];