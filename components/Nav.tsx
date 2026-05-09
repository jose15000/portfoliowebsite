"use client";

export default function Nav() {

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
