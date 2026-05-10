import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MOODS } from '../data/moods'
import { getVerseForMood } from '../data/verses'

export const useMoodStore = create(
  persist(
    (set, get) => ({
      selectedMood: null,
      currentVerse: null,
      isRevealing:  false,
      jarOpen:      false,

      selectMood: (moodId) => {
        const mood  = MOODS.find(m => m.id === moodId)
        const verse = getVerseForMood(moodId)
        set({ selectedMood: mood, currentVerse: verse, jarOpen: false })
        /* Set CSS mood color */
        document.documentElement.style.setProperty('--mood-current', mood?.color || 'var(--accent-gold)')
      },

      openJar: () => set({ jarOpen: true }),

      startRevelation: () => {
        set({ isRevealing: true })
        setTimeout(() => set({ isRevealing: false }), 1200)
      },

      reset: () => set({ selectedMood: null, currentVerse: null, jarOpen: false }),
    }),
    { name: 'qalbi-mood', partialize: (s) => ({ selectedMood: s.selectedMood, currentVerse: s.currentVerse }) }
  )
)
