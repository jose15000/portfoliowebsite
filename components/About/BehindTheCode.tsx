import Link from "next/link";
import { Titles } from "../terminal/Titles";

export function BehindTheCode() {
    return(
        <section className="flex flex-col mx-auto max-w-full px-4 md:max-w-4xl py-24 text-white font-monospace">
             <Titles title="Continue the story" />
                  <h1 className="font-display text-teal-300 text-2xl md:text-3xl lg:text-4xl mb-6 leading-tight">
                   What's Next
                  </h1>
            
                <div className="flex flex-col">
                <a href="#" className="group text-slate-500 transition-colors text-lg">
          <span className="group-hover:text-amber-400 transition-colors font-semibold font-times ">[</span>
          <span className="text-amber-400 px-1">
          Talk to the AI
          </span>
          <span className="group-hover:text-amber-400 transition-colors font-semibold font-times">]</span>
          </a>

               <a href="#" className="group text-slate-500 transition-colors text-lg">
          <span className="group-hover:text-amber-400 transition-colors font-semibold font-times ">[</span>
          <span className="text-amber-400 px-1">
          See my projects
          </span>
          <span className="group-hover:text-amber-400 transition-colors font-semibold font-times">]</span>
          </a>

                </div>

        </section>
    )
}