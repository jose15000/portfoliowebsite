"use client";

import { experiences } from "@/utils/experience";
import { Titles } from "../terminal/Titles";
import { TimelineItem } from "./TimelineItem";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function JourneyComponent() {
  const container = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>(".timeline-item");

      items.forEach((item) => {
        gsap.from(item, {
          opacity: 0,
          y: 40,
          duration: 0.6,
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
          },
        });
      });


      if (progressRef.current) {
        gsap.to(progressRef.current, {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: container.current,
            start: "top center",
            end: "bottom center",
            scrub: true,
          },
        });
      }

      items.forEach((item) => {
        const dot = item.querySelector<HTMLElement>(".timeline-dot");
        if (!dot) return;

        const description = item.querySelector<HTMLElement>(".timeline-description");
        if (!description) return;

               if (description) {
          gsap.set(description, { height: 0, opacity: 0 });
        }
 
        ScrollTrigger.create({
          trigger: item,
          start: "top center",
          end: "bottom center",
          onEnter: () => activate(),
          onEnterBack: () => activate(),
          onLeave: () => deactivate(),
          onLeaveBack: () => deactivate(),
        });
 
        function activate() {
          dot?.classList.add("is-active");
          if (description) {
            gsap.to(description, {
              height: "auto",
              opacity: 1,
              duration: 0.4,
              ease: "power2.out",
            });
          }
        }
 
        function deactivate() {
          dot?.classList.remove("is-active");
          if (description) {
            gsap.to(description, {
              height: 0,
              opacity: 0,
              duration: 0.3,
              ease: "power2.in",
            });
          }
        }
      });
    },

    { scope: container }
  );

  return (
    <section className="flex flex-col mx-auto max-w-4xl py-24 text-white font-monospace">
      <Titles title="Journey" />
      <h1 className="font-display italic text-teal-300 text-3xl md:text-3xl lg:text-4xl mb-6 leading-tight">
        A bit of my story as a developer.
      </h1>

      <div className="relative" ref={container}>
        <div className="absolute left-[11px] top-0 h-full w-px bg-neutral-800" />
        <div
          ref={progressRef}
          className="timeline-progress absolute left-[11px] top-0 h-full w-px bg-teal-300"
        />

        <style>{`
          .timeline-progress {
            transform-origin: top;
            transform: scaleY(0);
          }
          .timeline-dot.is-active {
            background-color: rgb(94 234 212); /* teal-300 */
            border-color: rgb(94 234 212);
            box-shadow: 0 0 0 4px rgba(94, 234, 212, 0.2);
          }
        `}</style>

        <div className="space-y-14">
          {experiences.map((experience) => (
            <TimelineItem
              className={"timeline-item"}
              key={experience.company}
              experience={experience}
            />
          ))}
        </div>
      </div>
    </section>
  );
}