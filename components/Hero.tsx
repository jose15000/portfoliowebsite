"use client";

import { EffectScene } from "./EffectScene";

export default function Hero() {
  return (
    <section className="font-display flex flex-col lg:flex-row gap-10 items-center justify-between min-h-[80vh] w-full max-w-6xl mx-auto px-6 py-12">
      <div className="w-full lg:flex-1 ">
        <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl mb-4 text-slate-200">
          José Henrique.
        </h1>
        <h2 className="italic text-teal-300 text-2xl md:text-3xl lg:text-4xl mb-6 leading-tight">
          Full-Stack Developer now available.
        </h2>
        <p className="text-slate-400 text-sm md:text-base mb-8 leading-relaxed max-w-xl">
          Building systems that think. Focused on AI agents, automation and
          scalable architectures. Currently studying CS at Universidade
          Tiradentes and shipping real products.
        </p>
        <a href="#projects" className="aqua-btn w-max">
          See my work
        </a>
      </div>

      <div className="flex justify-center items-center shrink-0">
        <EffectScene className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px]" enableZoom={false} />
      </div>
    </section>
  );
}
