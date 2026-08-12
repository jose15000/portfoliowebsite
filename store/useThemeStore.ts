import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ThemeName } from '@/components/background/shaders/theme.config'

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