import { ReactNode } from "react"
import { ChatMessages } from "./ChatMessage"

type props = {
    children: ReactNode;
    className?: string;
}

export function ChatBody ({children, className}: props) {
    return (
         <div className={`rounded-md bg-[#0D1723] ring-1 ring-slate-700 ${className}`}>
            {children}
        </div>
    )
}