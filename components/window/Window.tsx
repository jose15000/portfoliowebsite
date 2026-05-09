type props = {
    title: string;
    year: string;
    description: string;
    tags: string[];
    link: string;
}

export function Window({ title, year, description, tags, link }: props) {
    return (
        <div className="shadow-win95 p-0.5">
            <main className="bg-[#c0c0c0]">
                <div className="flex flex-row">
                    <div className="px-1 bg-linear-to-r from-[#000080] to-[#1084D0] block w-full text-sm">project.info</div>
                    <span className="shadow-win95 px-0.5 items-center text-xs text-black">x</span>
                </div>

                <div className="text-xs font-thin text-black flex flex-col p-2">
                    <h1 className="text xs font-thin text-black">{title}</h1>
                    <span>© {year}</span>
                    <p>{description}</p>
                    <line></line>
                    <p className="">{tags}</p>
                    <a href={link} className="text-xs text-center py-1 px-3 shadow-win95 self-end mt-2">check repo</a>
                </div>
            </main>

        </div>
    )
}