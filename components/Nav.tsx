"use client";

import { useEffect, useState } from "react";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import gsap from "gsap";

export default function Nav() {
  const [isBlurActive, setIsBlurActive] = useState(false);

  const tabs = [
    { name: "Home", href: "#hero" },
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Skills", href: "#skills" },
    { name: "Contact", href: "#contact" }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsBlurActive(window.scrollY > 120);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();

    const smoother = ScrollSmoother.get();

    if (!smoother) {
      // fallback se o Smoother ainda não montou
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    // smoother.offset() converte o alvo (seletor + posição) pra um valor
    // de scrollTop no sistema de coordenadas interno do Smoother
    const targetY = smoother.offset(href, "top top");

    gsap.to(smoother, {
      scrollTop: targetY,
      duration: 1.2,
      ease: "power3.inOut",
    });
  };

  return (
    <>
      <a
        href="#hero"
        onClick={(e) => handleNavClick(e, "#hero")}
        className="fixed top-4 left-4 z-50 flex h-9 w-9 items-center justify-center rounded-full"
      >
        JH
      </a>

      <nav className="fixed top-4 left-1/2 z-50 -translate-x-1/2">
        <div
          className={`sub-nav flex items-center rounded-lg px-2 py-3 transition-all duration-300 ${
            isBlurActive ? "bg-slate-900/40 backdrop-blur-xl shadow-lg" : "bg-transparent"
          }`}
        >
          {tabs.map(tab => (
            <a
              key={tab.name}
              href={tab.href}
              onClick={(e) => handleNavClick(e, tab.href)}
            >
              {tab.name}
            </a>
          ))}
        </div>
      </nav>
    </>
  );
}