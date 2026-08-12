import { Icon } from "../icons/Icon";

type props = {
    name: string;
    description: string;
    tags: string[];
    github: string;
}

export function ProjectCard({ name, description, tags, github }: props) {
    return (
        <article className="bg-white/1 backdrop-blur-sm px-4 py-2 w-3/4 font-display mx-auto rounded-lg border border-slate-700 shadow-lg shadow-slate-950/20">
            <div className="flex flex-row items-center">
                <div className="flex flex-col">
                    <a
                        className=" text-3xl font-thin text-3xl text-slate-200 text-accent-teal-300 hover:text-teal-200"
                        href={github}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {name}.
                    </a>
                     <span className="mt-2 text-sm text-slate-400">{description}</span>
                     
                </div>
            </div>
                   
            <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-slate-700 px-2 py-1 text-xs text-slate-400">
                        {tag}
                    </span>
                ))}
            </div>
        </article>
    );
}
