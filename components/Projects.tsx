import { projects } from "@/utils/projects";
import { Titles } from "./terminal/Titles";
import { ProjectCard } from "./ProjectCard/ProjectCard";

export default function Projects() {
  return (
    <main id="projects" className="w-full text-sm md:text-base  font-monospace text-[#0F172A] px-5 py-12 shadow-lg">
      <Titles title="Projects" />
      <h1 className="font-display italic text-teal-300 text-3xl md:text-3xl lg:text-4xl mb-6 leading-tight">What I've Built</h1>
      <div className="flex flex-col md:flex-row gap-2">
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
    </main>
  );
}
