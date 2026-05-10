type props = {
    skill: string[]
    type: "languages" | "frameworks" | "databases" | "AI"
}

export function SkillsList({ skill, type }: props) {
    return (

        <div>
            <ul className="flex flex-col">
                <li>
                    <span className="text-amber-400">*{type}: </span>
                    <span className="text-slate-300">{skill.join(", ")}</span>
                </li>
            </ul>


        </div>
    )
}