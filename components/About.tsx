export default function About() {
  return (
    <section id="about" style={{ padding: "0 20px 40px 20px" }}>
      <div className="bevel-box">
        <div className="bevel-bar-teal">About Me</div>
        <div style={{ padding: "20px", fontSize: "12px", display: "flex", gap: "20px" }}>
          <div style={{ flex: 1 }}>
            <p style={{ marginBottom: "10px" }}>
              I'm a developer from Brazil with a focus on building things that actually work at scale. 
              My interest sits at the intersection of <strong style={{ color: "var(--text-slate-200)" }}>AI systems, graph-based architectures</strong>, 
              and tools that improve how developers work.
            </p>
            <p style={{ marginBottom: "10px" }}>
              I don't just write apps — I try to build software with a point of view. Whether it's an 
              MCP server that gives AI agents real codebase context, or a neural network reading the Bitcoin 
              market, I care about the underlying model, not just the interface.
            </p>
          </div>
          <div style={{ width: "250px", borderLeft: "1px solid var(--bevel-dark)", paddingLeft: "20px" }}>
            <ul style={{ listStyle: "square", paddingLeft: "15px", lineHeight: "1.8" }}>
              <li><strong style={{ color: "var(--text-slate-200)" }}>Location:</strong> Aracaju, BR</li>
              <li><strong style={{ color: "var(--text-slate-200)" }}>Education:</strong> CS @ UNIT</li>
              <li><strong style={{ color: "var(--text-slate-200)" }}>Focus:</strong> AI / Backend / Scale</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
