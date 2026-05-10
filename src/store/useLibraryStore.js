import { create } from 'zustand'

export const useLibraryStore = create(set => ({
  openBook: null,
  openBook_set: book  => set({ openBook: book }),
  openBook_clear: ()  => set({ openBook: null }),
}))
