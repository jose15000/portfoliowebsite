import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeName = 'dark'

interface ThemeState {
  theme: ThemeName;
  setTheme: (newTheme: ThemeName) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'dark',
      setTheme: (newTheme) => set({ theme: newTheme }),
    }),
    {
      name: 'theme-storage',
    }
  )
)