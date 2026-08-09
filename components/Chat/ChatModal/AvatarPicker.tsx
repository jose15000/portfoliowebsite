"use client";

import { useRef, useState, type FocusEvent } from "react";
import { PRESET_AVATARS } from "./presetAvatars";
import { usePersistedAvatar } from "./usePersistedAvatar";

type Props = {
  className?: string;
  defaultAvatar?: string;
};

export function AvatarPicker({ className = "", defaultAvatar }: Props) {
  const { avatar, setAvatar } = usePersistedAvatar(defaultAvatar ?? PRESET_AVATARS[0]);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!wrapperRef.current?.contains(e.relatedTarget as Node)) {
      setOpen(false);
    }
  };

  return (
    <div
      ref={wrapperRef}
      onBlur={handleBlur}
      className={`relative inline-flex items-center gap-2 ${className}`}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="block w-full max-w-[96px] aspect-square overflow-hidden border border-slate-700 hover:border-teal-300 transition-colors"
        aria-label="Trocar foto de perfil"
        aria-expanded={open}
      >
        <img
          src={avatar}
          alt="Sua foto de perfil"
          className="w-full h-full object-cover"
        />
      </button>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-slate-700 bg-[#0D1723] text-xs text-slate-300 hover:border-teal-300 transition-colors"
        aria-label="Abrir seletor de avatar"
        aria-expanded={open}
      >
        ▸
      </button>

      {open && (
        <div className="absolute left-full top-0 z-20 ml-2 w-48 rounded-sm bg-[#0D1723] border border-teal-800/60 shadow-2xl shadow-slate-950/50 p-2">
          <p className="text-[10px] text-slate-400 mb-2 tracking-wide uppercase">
           Choose a picture.
          </p>
          <div className="grid grid-cols-4 gap-1.5">
            {PRESET_AVATARS.map((url) => (
              <button
                key={url}
                type="button"
                onClick={() => {
                  setAvatar(url);
                  setOpen(false);
                }}
                className={`aspect-square overflow-hidden border transition-colors ${
                  url === avatar
                    ? "border-teal-300"
                    : "border-slate-700 hover:border-teal-300"
                }`}
                aria-label="Selecionar avatar"
              >
                <img src={url} alt="Avatar preset" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
