import { Titles } from "./terminal/Titles";
import { List } from "./terminal/List";
import { info } from "@/utils/info";


export default function About() {
  return (
    <section id="about" className="text-sm md:text-base font-monospace text-white px-5">
      <div >
        <Titles title="About Me" />
        <div className="w-full md:max-w-4/6">
          <div className="text:sm md:text-base">
            <p className="mb-3">
              I'm a developer from Brazil with a focus on building things that actually work at scale.
              My interest sits at the intersection of <strong className="text-slate-50">AI systems, graph-based architectures</strong>,
              and tools that improve how developers work.
            </p>
            <p>
              I don't just write apps — I try to build software with a point of view. Whether it's an
              MCP server that gives AI agents real codebase context, or a neural network reading the Bitcoin
              market, I care about the underlying model, not just the interface.
            </p>
          </div>
          <div>
            {info.map(info => (
              <List key={info.id} title={info.title} item={info.description} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
