"use client";

import { EffectScene } from "./EffectScene";

export default function Hero() {
  return (
    <section
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: "80vh",
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "40px 20px",
        gap: "40px",
      }}
    >
      {/* Left: Text content */}
      <div style={{ flex: 1 }}>
        <h1 className="font-display" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", marginBottom: "12px" }}>
          José Henrique.
        </h1>
        <h2
          className="font-display"
          style={{
            fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)",
            color: "var(--accent-teal-300)",
            fontStyle: "italic",
            marginBottom: "24px",
            lineHeight: 1.2,
          }}
        >
          Full-Stack Developer now available.
        </h2>
        <p
          style={{
            marginBottom: "32px",
            lineHeight: 1.6,
            fontSize: "14px",
            color: "var(--text-slate-400)",
          }}
        >
          Building systems that think. Focused on AI agents, automation and
          scalable architectures. Currently studying CS at Universidade
          Tiradentes and shipping real products.
        </p>
        <a href="#projects" className="aqua-btn">
          See my work
        </a>
      </div>

      {/* Right: 3D ASCII Canvas — fixed 480×480 so it never collapses */}
      <div className="flex justify-center items-center" style={{ flexShrink: 0 }}>
        <EffectScene className="items-center" canvasSize={600} enableZoom={false} />
      </div>
    </section>
  );
}
