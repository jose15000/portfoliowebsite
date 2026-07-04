type props = {
    name: string;
    year: string;
    description: string;
    tags: string[];
    github: string;
}
export function ListProjects({ name, year, description, tags, github }: props) {
    return (
        <div className="text-monospace">
            <div className="flex flex-row gap-2">
                <a className="" href={github}>{name}</a>
                <span>{year}</span>
            </div>
            <span className="">{tags}</span>
            <p className="">{description}</p>
        </div>
    )
}