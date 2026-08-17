"use client"

import { useState, useRef, KeyboardEvent } from 'react';

type ChatInputProps = {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!message.trim() || isLoading) return;
    onSendMessage(message);
    setMessage('');
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleInput = (event: any) => {
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  return (
    <div className="flex gap-2 items-end mt-4">
      <textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        placeholder={"type"}
        rows={3}
        cols={1}
        disabled={isLoading}
        className="flex-1 resize-none max-h-30 p-2.5 rounded-md bg-transparent focus:outline-none focus:ring-0 text-white disabled:opacity-50"
      />
      <button 
        onClick={handleSend} 
        disabled={!message.trim() || isLoading}
        className="px-4 py-2 bg-teal-500 hover:bg-slate-600 disabled:bg-zinc-700 text-black font-bold rounded-md transition-colors"
      >
        {isLoading ? "..." : "Enviar"}
      </button>
    </div>
  );
}
