type props = {
    type: "minimize" | "expand" | "close"
}

export function Controls({ type }: props) {
    return (
        <div className="bg">{type === "minimize" ? "X" : ""}</div>
    )
}