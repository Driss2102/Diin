import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAppStore = create(
  persist(
    (set, get) => ({
      /* Theme */
      theme: 'dark',
      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark'
        set({ theme: next })
        document.documentElement.classList.toggle('dark',  next === 'dark')
        document.documentElement.classList.toggle('light', next === 'light')
      },

      /* Navigation */
      page: 'landing',
      setPage: (page) => set({ page }),

      /* Streak */
      streak: 7,
      lastVisit: null,
      incrementStreak: () => {
        const today = new Date().toDateString()
        const { lastVisit, streak } = get()
        if (lastVisit === today) return
        const yesterday = new Date(Date.now() - 86400000).toDateString()
        set({
          streak:    lastVisit === yesterday ? streak + 1 : 1,
          lastVisit: today,
        })
      },

      /* Sound */
      soundEnabled: true,
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),

      /* Favorites */
      favorites: [],
      addFavorite:    (item) => set((s) => ({ favorites: [item, ...s.favorites.filter(f => f.id !== item.id)] })),
      removeFavorite: (id)   => set((s) => ({ favorites: s.favorites.filter(f => f.id !== id) })),
      isFavorite:     (id)   => get().favorites.some(f => f.id === id),
    }),
    { name: 'qalbi-app' }
  )
)
