import { ContextAtlasIcon } from "./ContextAtlasIcon"
import { LSTMProjectIcon } from "./LSTMProjectIcon"

type icon = {
    name:string;
}

export function Icon({ name }: icon) {
    return (
        <div className="flex w-full items-center justify-end">
            {name === "context-atlas" && <ContextAtlasIcon/>}
            {name==="lstm" && <LSTMProjectIcon/>}
        </div>
    )
}