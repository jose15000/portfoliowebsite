const skills = [
  "TypeScript", "React", "Next.js", "Node.js",
  "Python", "PostgreSQL", "Redis", "Docker",
  "Graph Systems", "AST Analysis", "AI Agents",
  "LLM Orchestration", "MCP Protocol", "REST APIs",
  "Event-driven Architecture", "Bun", "Git", "Prisma",
];

export default function Skills() {
  return (
    <section id="skills" style={{ padding: "0 20px 40px 20px" }}>
      <div className="bevel-box">
        <div className="bevel-bar-teal">Technical Stack</div>
        <div style={{ padding: "20px", background: "var(--bg-slate-800)" }}>
          <p style={{ fontSize: "11px", marginBottom: "15px", fontStyle: "italic", color: "var(--text-slate-400)" }}>
            Current technologies in active use:
          </p>
          <div style={{ fontSize: "12px", lineHeight: "1.8" }}>
            {skills.map((skill, i) => (
              <span key={skill}>
                <span style={{ fontWeight: "bold", color: "var(--text-slate-200)" }}>{skill}</span>
                {i < skills.length - 1 && <span style={{ color: "var(--accent-teal-800)", margin: "0 8px" }}>|</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
