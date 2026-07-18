import { projects } from "@/utils/projects";
import { Titles } from "./terminal/Titles";
import { ProjectCard } from "./ProjectCard/ProjectCard";

export default function Projects() {
  return (
    <section id="projects" className="flex flex-col px-5 text-white font-monospace size-full">
      <Titles title="Projects" />
      <h1 className="font-display italic text-teal-300 text-3xl md:text-3xl lg:text-4xl mb-6 leading-tight">What I've Built</h1>
      <div className="mx-auto flex flex-row gap-2">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            name={project.name}
            description={project.description}
            tags={project.tags}
            github={project.github}
          />
        ))}
      </div>
    </section>
  );
}
