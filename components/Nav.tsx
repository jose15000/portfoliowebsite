"use client";

import { useState } from "react";

export default function Nav() {
  const [activeTab, setActiveTab] = useState("Home");

  const tabs = [
    { name: "Home", href: "#hero" },
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Skills", href: "#skills" },
    { name: "Contact", href: "#contact" }
  ];

  return (
    <header style={{ paddingTop: 20 }}>
      {/* Main Tabs */}
      <div className="mac-tabs-container">
        {tabs.map(tab => (
          <a
            key={tab.name}
            href={tab.href}
            className={`mac-tab ${activeTab === tab.name ? "active" : ""}`}
            onClick={() => setActiveTab(tab.name)}
          >
            {tab.name}
          </a>
        ))}
      </div>

      {/* Sub Navigation Bar */}
      <div className="sub-nav">
        <a href="https://github.com/jose15000" target="_blank" rel="noopener noreferrer">GitHub Profile</a> |
        <a href="https://www.linkedin.com/in/jos%C3%A9-henrique-oliveira-de-carvalho1500/" target="_blank" rel="noopener noreferrer"> LinkedIn</a> |
        <a href="mailto:jhenrique15000@gmail.com">Email Me</a> |
        <a href="https://github.com/jose15000/ContextAtlas" target="_blank" rel="noopener noreferrer">ContextAtlas</a>
      </div>
    </header>
  );
}
