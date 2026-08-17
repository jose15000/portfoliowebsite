export default function Contact() {
  return (
    <section id="contact" style={{ padding: "0 20px 40px 20px" }}>
      <div className="bevel-box">
        <div className="bevel-bar-teal">Contact & Links</div>
        <div style={{ padding: "30px 20px", textAlign: "center", background: "var(--bg-slate-900)" }}>
          <h2 className="font-display" style={{ fontSize: "2rem", marginBottom: "15px" }}>Let's Talk</h2>
          <p style={{ fontSize: "12px", marginBottom: "25px", maxWidth: "400px", margin: "0 auto 25px auto", color: "var(--text-slate-400)" }}>
            If you have a project in mind, want to collaborate, or just want to say hi — my inbox is open.
          </p>
          
          <div style={{ marginBottom: "30px" }}>
            <a href="mailto:jhenrique15000@gmail.com" style={{ fontSize: "14px", padding: "8px 24px", display: "inline-block", borderRadius: "9999px", background: "rgba(245, 158, 11, 0.15)", color: "#fbbf24", border: "1px solid rgba(251, 191, 36, 0.5)" }}>
              Send eMail
            </a>
          </div>

          <div style={{ borderTop: "1px solid var(--bevel-dark)", borderBottom: "1px solid var(--bevel-light)", margin: "0 auto 20px auto", width: "80%" }}></div>

          <div style={{ fontSize: "11px", display: "flex", justifyContent: "center", gap: "20px" }}>
            <a href="https://github.com/jose15000" className="link" target="_blank" rel="noopener noreferrer">
              [ GitHub ]
            </a>
            <a href="https://www.linkedin.com/in/jos%C3%A9-henrique-oliveira-de-carvalho1500/" className="link" target="_blank" rel="noopener noreferrer">
              [ LinkedIn ]
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
