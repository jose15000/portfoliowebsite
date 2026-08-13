"use client";

import gsap from "gsap";
import { EffectScene } from "./EffectScene";
import { ScrollSmoother } from "gsap/all";

export default function Hero() {
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
    // 1. Limpei as classes da section. Agora ela só serve para centralizar o painel na tela.
    <section className="font-display min-h-[80vh] w-full px-4 lg:px-8 py-12 flex items-center justify-center">
      
      <div className="
        w-full max-w-7xl 
        flex flex-col lg:flex-row items-center justify-between gap-10 
        aqua:bg-white/5 aqua:backdrop-blur-md rounded-3xl aqua:border aqua:border-slate-200/10 
        px-5 py-2 md:p-12 lg:p-16 aqua:shadow-2xl overflow-hidden
      ">
        
        <div className="w-full lg:flex-1 flex flex-col items-center md:items-start text-center md:text-start z-10">
          <h1 className="text-5xl font-medium md:text-6xl lg:text-7xl xl:text-8xl mb-4 dark:text-slate-200 aqua:text-slate-900">
            José Henrique.
          </h1>
          <h2 className="italic font-times dark:text-teal-500 aqua:text-slate-900 text-2xl md:text-3xl lg:text-4xl mb-6 leading-tight">
            Full-Stack Developer
          </h2>
          <p className="dark:text-slate-300 aqua:text-slate-900 font-times text-sm md:text-base mb-8 leading-relaxed max-w-xl">
            Building systems that think. Focused on AI agents, automation and
            scalable architectures. Shipping real products.
          </p>

          <div className="flex flex-row gap-4 md:gap-10 items-center md:text-xl justify-center md:justify-start">
            <a href="#about" onClick={(e) => handleNavClick(e, "#about")} className="group aqua-btn aqua:px-2 aqua:text-slate-900 inline-block flex flex-row gap-2 items-center dark:text-amber-400 text-xl">
              <span className="inline-block transition-transform duration-300 group-hover:rotate-90 aqua:hidden">{">"}</span>
              About Me
              <span className="inline-block w-[7px] h-[14px] aqua:bg-slate-200 dark:bg-amber-400 -mb-0.5 aqua:hidden dark:animate-blink ml-2" />
            </a>
            
            <div>
              <a href="#chat" onClick={(e) => handleNavClick(e, "#chat")} className="aqua-btn group aqua:px-2 text-slate-500 transition-colors text-xl flex items-center">
                <span className="font-semibold aqua: hidden font-times transition-colors group-hover:text-slate-900 dark:group-hover:text-amber-400 [.aqua_.group:hover_&]:hidden">
                  [
                </span>
                <span className="px-1 transition-colors dark:text-amber-500 dark:group-hover:text-amber-400 [.aqua_&]:text-slate-900">
                  Talk to AI Me
                </span>
                <span className="font-semibold font-times aqua:hidden transition-colors group-hover:text-slate-900 dark:group-hover:text-amber-400 [.aqua_.group:hover_&]:text-slate-200">
                  ]
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* 4. LADO DIREITO: O MACBOOK */}
        <div className="flex justify-center items-center shrink-0 z-10 w-[300px] h-[300px] md:w-[450px] md:h-[450px]">
          <EffectScene className="w-full h-full" enableZoom={false} />
        </div> 

      </div>
    </section>
  );
}