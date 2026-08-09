import { create } from 'zustand'

interface ScrollState {
  isScrolling: boolean
  setScrolling: (value: boolean) => void
}

export const useScrolleStore = create<ScrollState>((set) => ({
  isScrolling: false,
  setScrolling: (value) => set({ isScrolling: value }),
}))
