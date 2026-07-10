import { Icon } from "../icons/Icon";

type props = {
    name: string;
    description: string;
    tags: string[];
    github: string;
    icon: "context-atlas" | "lioapply" | "lstm" | "telegram-bot";
}

export function ProjectCard({ name, description, tags, github, icon }: props) {
    return (
        <article className="px-4 py-2 w-3/4 font-display mx-auto rounded-lg border border-slate-700 shadow-lg shadow-slate-950/20">
            <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
                <div className="flex flex-col">
                    <a
                        className=" text-3xl font-thin text-3xl text-accent-teal-300 hover:text-teal-200"
                        href={github}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {name}.
                    </a>
                     <span className="mt-2 text-sm text-slate-400">{description}</span>
                     
                </div>
                    <Icon name={icon}/>
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
