import { useEffect, useState } from "react";

const STORAGE_KEY = "chat:selected-avatar";

/**
 * Keeps the user's chosen avatar in sessionStorage so it survives
 * refreshes within the same tab/session, but resets on a new session.
 */
export function usePersistedAvatar(defaultAvatar: string) {
  const [avatar, setAvatarState] = useState<string>(defaultAvatar);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAvatarState(stored);
    }
  }, []);

  const setAvatar = (url: string) => {
    setAvatarState(url);
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(STORAGE_KEY, url);
    }
  };

  return { avatar, setAvatar };
}
