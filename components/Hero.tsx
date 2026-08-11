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

    <section className="font-display flex mb-0 flex-col items-center text-center md:text-start justify-center lg:flex-row gap-10 items-center justify-between min-h-[80vh] w-full px-2 lg:px-6 lg:py-12"
    style={{
    // Cria um contorno suave escuro que separa o texto do ruído do CRT
    textShadow: '0 0 20px rgba(0,0,0,0.8), 0 0 30px rgba(0,0,0,0.5)'
  }}
    >
      <div className="w-full lg:flex-1 text-[#1E3A8A]">
        <h1 className="text-5xl font-medium md:text-6xl lg:text-7xl xl:text-8xl mb-4">
          José Henrique.
        </h1>
        <h2 className="italic font-times text-[#1E3A8A] text-2xl md:text-3xl lg:text-4xl mb-6 leading-tight">
          Full-Stack Developer
        </h2>
        <p className="text-[#1E3A8A] font-semibold font-times text-sm md:text-base mb-8 leading-relaxed max-w-xl">
          Building systems that think. Focused on AI agents, automation and
          scalable architectures. Shipping real products.
        </p>

          <div className="flex flex-row gap-4 md:gap-10 items-center justify-center md:justify-start">
            <a href="#about" onClick={(e) => handleNavClick(e, "#about")} className="group inline-block flex flex-row gap-2 items-center text-amber-400 text-xl hover:underline">
            <span className="inline-block transition-transform duration-300 group-hover:rotate-90">{">"}</span>
           About Me
        <span className="inline-block w-[7px] h-[14px] bg-amber-400 -mb-0.5 animate-blink ml-2" />
        </a>
        <div>

        
        <a href="#chat" className="group text-slate-500 transition-colors text-lg">
          <span className="group-hover:text-amber-400 transition-colors font-semibold font-times ">[</span>
          <span className="text-amber-400 px-1">
          Talk to AI Me
          </span>
          <span className="group-hover:text-amber-400 transition-colors font-semibold font-times">]</span>
          </a>
        
        </div>
        </div>
      </div>

      <div className="flex justify-center items-center shrink-0 z-1">
        <EffectScene className="w-[350px] h-[350px] md:w-[600px] md:h-[600px]" enableZoom={false} />
      </div> 

    </section>
  
  );
}
