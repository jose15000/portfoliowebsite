import { formatTextWithEmoticons } from "@/utils/parseText";

type props = {
    role: "user" | "system";
    message: string
    isLoading?: boolean
}

export function ChatMessages({role, message, isLoading}: props) {

    return (
        <div>
            <h3 className={`${role == "system" ? "text-blue-400" : "text-green-200"}`}>
                {(role == "system" ? "José's AI says:": "Visitor says:")}
                </h3>
            <span className={`text-sm`}>{formatTextWithEmoticons(message)}</span>
        </div>
    )
}