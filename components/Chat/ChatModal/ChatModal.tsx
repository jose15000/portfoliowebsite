
import { ReactNode } from "react";

type props = {
  children: ReactNode;
  className?: string;
};

export function ChatModal({ children, className = "" }: props) {
  return (
    <div className={`flex rounded-md bg-[#131C29] px-3 py-3 shadow-2xl shadow-slate-950/30 ring-1 ring-slate-700 ${className}`}>
      {children}
    </div>
  );
}