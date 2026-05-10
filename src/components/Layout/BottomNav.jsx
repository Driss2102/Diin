import { motion } from 'framer-motion'
import { Home, Smile, BookOpen, Repeat2, Bookmark, Library } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'

const ITEMS = [
  { id: 'landing',   label: 'Accueil', Icon: Home     },
  { id: 'mood',      label: 'Mood',    Icon: Smile    },
  { id: 'dhikr',     label: 'Dhikr',   Icon: Repeat2  },
  { id: 'library',   label: 'Livres',  Icon: Library  },
  { id: 'favorites', label: 'Favoris', Icon: Bookmark },
]

export default function BottomNav() {
  const { page, setPage } = useAppStore()

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
      className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden"
      style={{
        background:           'var(--glass)',
        backdropFilter:       'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop:            '1px solid var(--glass-border)',
        paddingBottom:        'env(safe-area-inset-bottom)',
      }}
    >
      {ITEMS.map(({ id, label, Icon }) => {
        const active = page === id
        return (
          <button
            key={id}
            onClick={() => setPage(id)}
            className="flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 relative transition-all duration-200"
            style={{ color: active ? 'var(--accent-gold)' : 'var(--text-tertiary)' }}
          >
            {/* Indicateur top */}
            {active && (
              <motion.div
                layoutId="bottom-indicator"
                className="absolute top-0 w-8 h-0.5 rounded-full"
                style={{ background: 'var(--accent-gold)' }}
              />
            )}

            <motion.div
              animate={{ scale: active ? 1.18 : 1, y: active ? -1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <Icon size={19} strokeWidth={active ? 2 : 1.5} />
            </motion.div>

            <span className="font-mono" style={{ fontSize: '0.56rem', letterSpacing: '0.06em' }}>
              {label}
            </span>
          </button>
        )
      })}
    </motion.div>
  )
}
