"use client";

import { Titles } from "../terminal/Titles";
import { List } from "../terminal/List";
import { info } from "@/utils/info";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import TubeImage from "../Tubelist";

export default function About() {
  const container = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      tl.from(container.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
      }).from(
        headerRef.current,
        {
          opacity: 0,
          x: -80,
          duration: 0.8,
        },
        "<"
      );
    },
    { scope: container }
  );

  return (
    <section ref={container} id="about" className="w-full text-sm md:text-base font-monospace text-white px-5 py-12">
      <div className="max-w-full">
        <Titles title="About me"/>
        {/* Adicionado o ref no h1 para a animação do GSAP funcionar nele */}
        <h1 ref={headerRef} className="font-display italic text-teal-300 text-3xl md:text-3xl lg:text-4xl mb-6 leading-tight">
          Turning ideas into products.
        </h1>
     
        <div className="flex flex-col md:flex-row">
          
          {/* A MÁGICA ACONTECE AQUI */}
          {/* 
            Substituímos o <img /> pelo seu <TubeImage />. 
            Note o 'shrink-0': ele impede que o texto esmague a imagem no flexbox.
            Usei w-64 h-64 no mobile e w-96 h-96 no desktop (que são os equivalentes a size-64/96).
          */}
          <TubeImage 
            src="/images/me.png" 
            alt="me" 
            className="w-64 h-64 md:w-96 md:h-96 md:mr-10 mb-4 mx-auto shrink-0"
            maxAngle={35} 
            range={600}
          />

          <div className="text-sm md:text-base max-w-full">
            <p className="mb-3">
              I'm a developer from Brazil focused on building production-ready software that solves real problems. 

              I enjoy designing systems as much as writing code. Whether I'm building AI agents, MCP servers, or backend platforms, I care about the architecture behind the product—not just the interface.
              My interest sits at the intersection of <strong className="text-slate-50">AI systems, graph-based architectures</strong>,
              and tools that improve how developers work.
            </p>
            <p>
              I don't just write apps — I try to build software with a point of view. Whether it's an
              MCP server that gives AI agents real codebase context, or a neural network reading the Bitcoin
              market, I care about the underlying model, not just the interface.
            </p>
          </div>
        </div>
        
        <div className="mt-12">
          {info.map(i => (
            <List key={i.id} title={i.title} item={i.description} />
          ))}
        </div>
      </div>
    </section>
  );
}