type props = {
    title: string;
    item: string | string[];
}

export function List({ title, item }: props) {
    return (
        <div>
            <ul className="my-3">
                <li className="flex flex-row justify-between max-w-full md:max-w-1/2 ">
                    <strong className="text-amber-300">{title}:</strong>{item}</li>
            </ul>
        </div>
    )
}