type Props = {
    type: "Language" | "Framework" | "Database" | "AI",
    values: string[];
}

const setColors: Record<Props["type"], { bg: string, text: string }> = {
    Language: { bg: "bg-amber-400", text: "text-amber-400" },
    Framework: { bg: "bg-orange-600", text: "text-orange-600" },
    Database: { bg: "bg-cyan-600", text: "text-cyan-600" },
    AI: { bg: "bg-red-500", text: "text-red-500" }
}

export function ColoredCommands({ type, values }: Props) {
    const colors = setColors[type];
    return (
        <div className="font-monospace flex flex-col gap-2">
            <span className={`text-sm px-2 py-0.5 text-black w-fit ${colors.bg}`}>
                {type}
            </span>
            <div className="flex flex-col">
                {values.map((val, idx) => (
                    <span key={idx} className={`text-sm ${colors.text}`}>
                        {val}
                    </span>
                ))}
            </div>
        </div>
    )
}