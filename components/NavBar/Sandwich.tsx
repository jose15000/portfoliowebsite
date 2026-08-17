"use client";

import { useEffect, type MouseEvent } from "react";


type Tab = {
  name: string;
  href: string;
};

type SandwichProps = {
  tabs: Tab[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (event: MouseEvent<HTMLAnchorElement>, href: string) => void;
};

export function Sandwich({ tabs, isOpen, onToggle, onSelect }: SandwichProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onToggle();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onToggle]);

  return (
    <div className="fixed top-4 right-4 z-[60] md:hidden">
      <button
        type="button"
        onClick={onToggle}
        className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 p-2 text-white"
        aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        aria-expanded={isOpen}
      >
        <span className={`h-0.5 w-5 rounded-full bg-white transition-all ${isOpen ? "translate-y-2 rotate-45" : ""}`} />
        <span className={`h-0.5 w-5 rounded-full bg-white transition-all ${isOpen ? "opacity-0" : ""}`} />
        <span className={`h-0.5 w-5 rounded-full bg-white transition-all ${isOpen ? "-translate-y-2 -rotate-45" : ""}`} />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm"
          onClick={onToggle}
        >
          <div
            className="ml-auto flex h-full w-72 max-w-[85vw] flex-col bg-slate-900/95 p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <span className="font-times text-lg font-semibold text-white">Menu</span>
              <button
                type="button"
                onClick={onToggle}
                className="rounded-full p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
                aria-label="Fechar menu"
              >
                ✕
              </button>
            </div>

            <nav className="flex flex-col gap-2">
              {tabs.map((tab) => (
                <a
                  key={tab.name}
                  href={tab.href}
                  onClick={(event) => onSelect(event, tab.href)}
                  className="rounded-lg px-3 py-3 text-sm font-medium text-slate-100 transition hover:bg-white/10"
                >
                  {tab.name}
                </a>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}