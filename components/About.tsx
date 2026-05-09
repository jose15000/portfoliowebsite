export default function About() {
  return (
    <section id="about" className="text-sm md:text-base font-monospace text-white px-5 ">
      <div >
        <div className="flex flex-row gap-3">
          <div className=""> {'>'} About Me </div>
          <span className="md:hidden overflow-hidden">{"=".repeat(50)}</span>
          <span className="hidden md:inline overflow-hidden">{"=".repeat(100)}</span>
        </div>

        <div className="w-full md:max-w-4/6">
          <div>
            <p>
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
            <ul>
              <li className="flex flex-row justify-between max-w-1/4 "><strong className="text-amber-300">location:</strong> Aracaju, BR</li>
              <li className="flex flex-row justify-between max-w-1/4 "><strong className="text-amber-300" >education:</strong> CS @ UNIT</li>
              <li className="flex flex-row justify-between max-w-1/4 "><strong className="text-amber-300">focus:</strong> AI / Backend / Scale</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
