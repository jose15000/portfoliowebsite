"use client"

import { useEffect, useRef, useState } from "react";
import { Titles } from "../terminal/Titles";
import { ChatBody } from "./ChatModal/ChatBody";
import { ChatHeader } from "./ChatModal/ChatHeader";
import { ChatMessages } from "./ChatModal/ChatMessage";
import { ChatModal } from "./ChatModal/ChatModal";
import { ChatInput } from "./ChatModal/ChatInput";
import { UserPictures } from "./ChatModal/UserPictures";
import { AvatarPicker } from "./ChatModal/AvatarPicker";
import { loadingPlaceholders } from "@/utils/loadingPlaceHolders";

type Message = {
id: string;
role: "user" | "system";
message: string;
}

export function Chat() {
const [loading, setLoading] = useState(false);
const [messages, setMessages] = useState<Message[]>([]);
const [loadingMessage, setLoadingMessage] = useState(""); 

const ref = useRef<HTMLDivElement>(null);
const messagesContainerRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, [messages]);

async function request(messageContent: string) {
    if (!messageContent.trim() || loading) return;

  const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        message: messageContent
    };

    setMessages((prev) => [...prev, userMessage]);

    const randomIndex = Math.floor(Math.random() * loadingPlaceholders.length);

    setLoadingMessage(loadingPlaceholders[randomIndex]);
    setLoading(true);

    try {
        const response = await fetch(`${process.env.BACKEND_URL!}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                prompt: messageContent
            })
        });

        if (!response.ok) {
            throw new Error("Failed to send message");
        }

        const data = await response.json();

    
        const aiText = data.choices?.[0]?.message?.content

        const aiMessage: Message = {
            id: crypto.randomUUID(),
            role: "system",
            message: aiText,
        };
        
        setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
} 

return (
    <section id="chat" className="text-sm md:text-base font-monospace text-white px-5 py-12">
        <div className="flex flex-col w-full max-w-5xl">
            <Titles title="Chat with the AI"/>
            <h1 className="font-display italic text-teal-300 text-3xl md:text-3xl lg:text-4xl mb-6 leading-tight">
              Wanna Know more? Ask AI!
            </h1>

            <ChatModal className="w-full md:w-4/6 h-full md:h-[60vh] flex-col md:flex-row gap-4 overflow-visible">
                
                <div className="flex flex-col flex-1 gap-4">
                    
                    <ChatBody className="flex flex-col flex-1 min-h-0 px-4 py-3 overflow-hidden">

                    <div className="shrink-0">
                        <ChatHeader/>
                    </div>

                        <div ref={messagesContainerRef} className="flex flex-col flex-1 min-h-0 gap-2 mt-4 overflow-y-auto">
                            <ChatMessages message={"Hello! I'm the digital representation of José Henrique's portfolio. You can ask me about his projects, tech stack, or experience."} role="system"/>
                             <ChatMessages message={"Hello! I'm the digital representation of José Henrique's portfolio. You can ask me about his projects, tech stack, or experience."} role="system"/>
                             <ChatMessages message={"Hello! I'm the digital representation of José Henrique's portfolio. You can ask me about his projects, tech stack, or experience."} role="system"/>
                            
                            
                        <ChatMessages message={"Hello! I'm the digital representation of José Henrique's portfolio. You can ask me about his projects, tech stack, or experience."} role="system"/>
                            {messages.map((message) => (
                                <ChatMessages key={message.id} message={message.message} role={message.role}/>
                            ))}
                            {loading && (
                                    <div className="shrink-0 mt-4">

                                        <div> 
                                            <div className="animate-shimmer-text font-monospace text-sm">
                                                {loadingMessage}
                                            </div>
                                        </div>
                                    </div>
                                )}

                        <div ref={ref}/>
                        </div>
                       
                    </ChatBody>

                    <div className="flex flex-row justify-between gap-2">
                    <ChatBody className="px-3 w-full py-3 shrink-0 w-fit">
                        <span>merda</span>
                        <ChatInput isLoading={loading} onSendMessage={request}/>
                    </ChatBody>
                     <ChatBody key="picker-container" className="shrink-0 px-2 size-fit py-2 gap-4">
                        <AvatarPicker className="w-full" defaultAvatar="/images/pfps/Beach Chairs.png" />
                    </ChatBody>
                    </div>

                </div>

                <div className="flex flex-col items-center justify-between">
                    <ChatBody key="image-container" className="px-2 size-fit w-fit py-2 gap-4">
                        <UserPictures src={"/images/me.png"} isUser={false}/>
                    </ChatBody>
             
                </div>


            </ChatModal>
        </div>
    </section>
);


}