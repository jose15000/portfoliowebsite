type props = {
    title: string;
}

export function Titles({ title }: props) {
    return (
        <div className="flex flex-row align-center gap-3 mb-3">
            <h1 className="shrink-0"> {'>'} {title} </h1>
            <span className="md:hidden overflow-hidden">{"=".repeat(40)}</span>
            <span className="hidden md:inline overflow-hidden">{"=".repeat(100)}</span>
        </div>
    )
}