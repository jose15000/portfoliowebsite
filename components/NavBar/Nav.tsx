"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import gsap from "gsap";
import { Sandwich } from "./Sandwich";
import { useScrolleStore } from "@/store/useScroll";
import { ThemeToggler } from "./ThemeToggler/ThemeToggler";

export default function Nav() {
  const [isBlurActive, setIsBlurActive] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [targetHref, setTargetHref] = useState<string | null>(null);

  const tabs = [
    { name: "Home", href: "#hero" },
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Skills", href: "#skills" },
    { name: "Contact", href: "#contact" },
  ];

const setScrolling = useScrolleStore((state) => state.setScrolling);

useEffect(() => {
  let scrollTimeout: ReturnType<typeof setTimeout>;

  const handleScroll = () => {
    setIsBlurActive(window.scrollY > 120);

    clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(() => {
      setScrolling(false);
    }, 150);
  };

  window.addEventListener("scroll", handleScroll, { passive: true });

  return () => {
    clearTimeout(scrollTimeout);
    window.removeEventListener("scroll", handleScroll);
  };
}, [setScrolling]);

useEffect(() => {
  if (!targetHref) return;

  let frameId: number;

  const checkTargetReached = () => {
    const element = document.querySelector(targetHref);

    if (!element) {
      setScrolling(false);
      setTargetHref(null);
      return;
    }

    const targetTop = element.getBoundingClientRect().top + window.scrollY;
    const currentScroll = window.scrollY;
    const reached = Math.abs(currentScroll - targetTop) < 25;

    if (reached) {
      setScrolling(false);
      setTargetHref(null);
      return;
    }

    frameId = window.requestAnimationFrame(checkTargetReached);
  };

  frameId = window.requestAnimationFrame(checkTargetReached);

  return () => cancelAnimationFrame(frameId);
}, [targetHref, setScrolling]);

  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    setScrolling(true);
    setTargetHref(href);

    const smoother = ScrollSmoother.get();

    if (!smoother) {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      setScrolling(false);
      setTargetHref(null);
      return;
    }

    const targetY = smoother.offset(href, "top top");

    gsap.to(smoother, {
      scrollTop: targetY,
      duration: 1.2,
      ease: "power3.inOut",
      onComplete: () => {
        setScrolling(false);
        setTargetHref(null);
      },
    });
  };

  return (
    <>
      <a
        href="#hero"
        onClick={(e) => handleNavClick(e, "#hero")}
        className="fixed left-4 top-4 z-50 flex h-9 w-9 items-center justify-center rounded-full font-times font-bold text-white"
      >
        JH
      </a>

      <nav className="fixed left-1/2 top-4 z-50 hidden -translate-x-1/2 md:flex">
        <div
          className={`sub-nav flex items-center rounded-lg px-2 py-3 transition-all duration-300 ${
            isBlurActive ? "dark:bg-slate-900/40 light:bg-white/1 shadow-sm backdrop-blur-md" : "bg-transparent"
          }`}
        >
          {tabs.map((tab) => (
            <a
              className="[.aqua&]:text-accent-teal-300"
              key={tab.name}
              href={tab.href}
              onClick={(e) => handleNavClick(e, tab.href)}
            >
              {tab.name}
            </a>
          ))}
      
      <ThemeToggler/>
        </div>
      </nav>


      <Sandwich
        tabs={tabs}
        isOpen={isMenuOpen}
        onToggle={() => setIsMenuOpen((prev) => !prev)}
        onSelect={handleNavClick}
      />

    </>
  );
}