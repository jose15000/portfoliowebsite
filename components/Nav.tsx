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
    <header>
      <div className="sub-nav">
        {tabs.map(tab => (
          <a
            key={tab.name}
            href={tab.href}
          >
            {tab.name}
          </a>
        ))}
      </div>
    </header>
  );
}
