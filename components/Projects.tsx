const projects = [
  {
    id: "contextatlas",
    name: "ContextAtlas",
    year: "2025",
    description: "An MCP server that gives AI coding agents a real understanding of your codebase. Analyzes the AST, file graph, and relationships.",
    tags: ["TypeScript", "MCP", "AI"],
    github: "https://github.com/jose15000/ContextAtlas",
  },
  {
    id: "lstm-bitcoin",
    name: "LSTM Bitcoin Prediction",
    year: "2024",
    description: "A deep learning pipeline using LSTM networks to forecast Bitcoin price trends from time-series data. Built in Python with Jupyter.",
    tags: ["Python", "LSTM", "ML"],
    github: "https://github.com/jose15000/LSTM-Bitcoin-market-preditcion",
  },
  {
    id: "lioapply",
    name: "lioApply",
    year: "2024",
    description: "A job application tool that automates the tedious parts of the job hunt — tracking applications and personalizing outreach.",
    tags: ["Automation", "TypeScript"],
    github: "https://github.com/jose15000/lioApply",
  },
  {
    id: "miniboss",
    name: "Miniboss",
    year: "2024",
    description: "A modular SaaS foundation with auth, multi-tenancy, and admin built in from day one.",
    tags: ["SaaS", "Backend"],
    github: "https://github.com/jose15000/Miniboss",
  },
];

export default function Projects() {
  return (
    <section id="projects" style={{ padding: "0 20px 40px 20px" }}>
      <div className="bevel-box">
        <div className="bevel-bar-teal">Selected Projects</div>
        
        {/* Table-like Layout */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {projects.map((project, index) => (
            <div 
              key={project.id} 
              style={{ 
                display: "flex", 
                padding: "15px 20px", 
                borderBottom: index !== projects.length - 1 ? "1px solid var(--bevel-dark)" : "none",
                background: index % 2 === 0 ? "var(--bg-slate-800)" : "var(--bg-slate-900)"
              }}
            >
              {/* Left col: Title & Year */}
              <div style={{ width: "200px", paddingRight: "20px" }}>
                <h3 className="font-display" style={{ fontSize: "1.2rem", marginBottom: "5px" }}>
                  <a href={project.github} className="link" target="_blank" rel="noopener noreferrer">
                    {project.name}
                  </a>
                </h3>
                <div style={{ fontSize: "10px", color: "var(--text-slate-400)" }}>
                  Release Date: {project.year}
                </div>
              </div>
              
              {/* Middle col: Description */}
              <div style={{ flex: 1, paddingRight: "20px", fontSize: "12px", color: "var(--text-slate-200)" }}>
                {project.description}
              </div>

              {/* Right col: Tags/Link */}
              <div style={{ width: "120px", fontSize: "10px", borderLeft: "1px solid var(--bevel-dark)", paddingLeft: "15px" }}>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 10px 0", color: "var(--accent-teal-300)" }}>
                  {project.tags.map(tag => (
                    <li key={tag}>• {tag}</li>
                  ))}
                </ul>
                <a href={project.github} className="link" target="_blank" rel="noopener noreferrer">View Source</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
