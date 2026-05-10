import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const DHIKR_ITEMS = [
  { id: 'subhanallah',    ar: 'سُبْحَانَ اللَّهِ',           fr: 'Gloire à Allah',           color: '#4ECDC4' },
  { id: 'alhamdulillah',  ar: 'الْحَمْدُ لِلَّهِ',           fr: 'Louange à Allah',          color: '#C9A84C' },
  { id: 'allahuakbar',    ar: 'اللَّهُ أَكْبَرُ',             fr: 'Allah est le plus Grand',  color: '#E67E22' },
  { id: 'lailaha',        ar: 'لَا إِلَهَ إِلَّا اللَّهُ',   fr: 'Nul dieu sauf Allah',      color: '#9B59B6' },
  { id: 'astaghfirullah', ar: 'أَسْتَغْفِرُ اللَّهَ',         fr: 'Je demande pardon',        color: '#27AE60' },
]

const initialCounts = Object.fromEntries(DHIKR_ITEMS.map(d => [d.id, 0]))

export const useDhikrStore = create(
  persist(
    (set, get) => ({
      selected:    'subhanallah',
      counts:      { ...initialCounts },
      custom:      { text: '', count: 0 },
      isCustom:    false,

      setSelected: (id) => set({ selected: id, isCustom: false }),
      setIsCustom: (v)  => set({ isCustom: v }),
      setCustomText: (text) => set(s => ({ custom: { ...s.custom, text } })),

      increment: () => set(s => {
        if (s.isCustom) {
          return { custom: { ...s.custom, count: s.custom.count + 1 } }
        }
        return {
          counts: { ...s.counts, [s.selected]: s.counts[s.selected] + 1 },
        }
      }),

      reset: () => set(s => {
        if (s.isCustom) return { custom: { ...s.custom, count: 0 } }
        return {
          counts: { ...s.counts, [s.selected]: 0 },
        }
      }),

      resetAll: () => set({
        counts: { ...initialCounts },
        custom: { text: '', count: 0 },
      }),

      currentCount: () => {
        const s = get()
        return s.isCustom ? s.custom.count : s.counts[s.selected]
      },

      currentItem: () => {
        const s = get()
        if (s.isCustom) return { id: 'custom', ar: s.custom.text, fr: '', color: '#C9A84C' }
        return DHIKR_ITEMS.find(d => d.id === s.selected) || DHIKR_ITEMS[0]
      },
    }),
    { name: 'qalbi-dhikr' }
  )
)
