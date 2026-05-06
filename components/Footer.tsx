export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="footer" style={{ padding: "0 20px 40px 20px" }}>
      <div 
        style={{ 
          borderTop: "1px solid var(--bevel-dark)", 
          borderBottom: "1px solid var(--bevel-light)", 
          margin: "0 0 20px 0" 
        }} 
      />
      <div 
        style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          fontSize: "10px",
          color: "var(--text-slate-400)"
        }}
      >
        <span>
          Copyright © {year} José Henrique Oliveira de Carvalho. All rights reserved.
        </span>
        <a href="#hero" className="link" style={{ color: "var(--text-slate-400)" }}>
          Top
        </a>
      </div>
    </footer>
  );
}
