import { skills } from "@/utils/Skills";
import { ColoredCommands } from "./terminal/ColoredCommands";
import { Titles } from "./terminal/Titles";

export default function Skills() {
  return (
    <section id="skills" className="mt-4 text-white font-monospace mx-auto">
      <Titles title="Technical Skills" />
      <div>
        <p className="mb-4 text-white">
          Current technologies in active use:
        </p>
        <div className="flex flex-row flex-wrap gap-8 md:gap-12 mt-2">
          {skills.map(skill => (
            <ColoredCommands key={skill.id} type={skill.type} values={skill.values} />
          ))}
        </div>
      </div>
    </section>
  );
}
