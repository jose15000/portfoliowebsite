import { skills } from "@/utils/Skills";
import { Titles } from "./terminal/Titles";
import { SkillsList } from "./terminal/SkillsList";

export default function Skills() {
  return (
    <section id="skills" className="text-white font-monospace mt-4 w-full px-5 md:px-5">
      <Titles title="Technical Skills" />
      <div>
        <p className="mb-4 text-white">
          Current technologies in active use:
        </p>
        <div className="flex flex-col flex-wrap gap-8 md:gap-12 mt-2 shrink-0">
          {skills.map(skill => (
            <SkillsList type={skill.type} skill={skill.values} />
          ))}
        </div>
      </div>
    </section>
  );
}
