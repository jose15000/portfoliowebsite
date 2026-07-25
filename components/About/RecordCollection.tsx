"use client";

import { records } from "@/utils/records";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function RecordCollection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      const section = sectionRef.current;
      if (!track || !section) return;

      const items = gsap.utils.toArray<HTMLElement>(".record-item", track);
      if (items.length === 0) return;

      // as imagens das capas podem carregar depois do primeiro cálculo do
      // ScrollTrigger, mudando o tamanho da track. Quando cada uma termina
      // de carregar, força um refresh pra recalcular start/end do pin.
      const images = track.querySelectorAll("img");
      let loadedCount = 0;

      images.forEach((img) => {
        if (img.complete) {
          loadedCount++;
          return;
        }
        img.addEventListener(
          "load",
          () => {
            loadedCount++;
            if (loadedCount === images.length) {
              ScrollTrigger.refresh();
            }
          },
          { once: true }
        );
      });

      // se todas já estavam no cache/completas, refresca uma vez de qualquer forma
      if (loadedCount === images.length) {
        ScrollTrigger.refresh();
      }

      gsap.to(track, {
        xPercent: -100 * (items.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          pin: true,
          anticipatePin: 1, // evita o "salto" no exato instante em que o pin começa
          scrub: 1,
          end: () => "+=" + (track.scrollWidth - section.offsetWidth),
          snap: items.length > 1 ? 1 / (items.length - 1) : undefined,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex h-screen flex-col overflow-hidden mx-auto max-w-full px-4 md:max-w-4xl text-white"
    >
      

        <h1 className="font-times text-white text-2xl md:text-3xl lg:text-4xl">
        Currently Listening
      </h1>
      <div ref={trackRef} className="flex flex-col items-center gap-3">

        <div className="flex flex-row flex-1 gap-3">
        {records.map((record) => (
          <img
            key={record.id}
            src={record.coverUrl}
            alt={record.name}
            className="record-item size-96 flex-none relative"
          />
        ))}
        </div>
      </div>
    </section>
  );
}