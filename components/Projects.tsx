import { projects } from "@/utils/projects";
import { Titles } from "./terminal/Titles";

export default function Projects() {
  return (
    <section id="projects" className="px-5 text-white font-monospace size-full">
      <Titles title="Projects" />
      <div className="flex flex-col md:flex-row gap-2">
        {/* {projects.map(project => (
          <Window key={project.id} title={project.name} year={project.year} description={project.description} tags={project.tags} link={project.github} />
        ))} */}
      </div>

    </section>
  );
}
