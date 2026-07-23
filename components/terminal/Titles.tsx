type props = {
    title: string;
}

export function Titles({ title }: props) {
    return (
        <div className="flex flex-row align-center gap-3 mb-3">
            <h1 className="shrink-0 text-sm"> {'>'} {title} </h1>
            
        </div>
    )
}