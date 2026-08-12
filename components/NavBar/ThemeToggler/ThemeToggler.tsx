"use client";

import { useThemeStore } from "@/store/useThemeStore";

export function ThemeToggler  () {

    const theme = useThemeStore((state) => state.theme);
    const changeTheme = useThemeStore((state)=> state.setTheme);

    const handleThemeChange = () => {
        if(theme == "aqua") changeTheme("dark");
        else{

            changeTheme("aqua");
        }
    }

    return (
        <button 
  onClick={() => handleThemeChange()}
  className="
    cursor-pointer font-semibold font-times transition-colors
    
    dark:text-slate-400 
    dark:hover:text-amber-400
    
    [.aqua_&]:text-blue-950 
    [.aqua_&:hover]:text-cyan-700
  "
>
  Theme: [{theme === "aqua" ? "A" : "D"}]
</button>
    )
}