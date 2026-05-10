import { motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'

const NAV_ITEMS = [
  { id: 'landing',    label: 'Accueil'      },
  { id: 'mood',       label: 'Mood'          },
  { id: 'revelation', label: "Aujourd'hui"   },
  { id: 'duaa',       label: 'Douaa'         },
  { id: 'dhikr',      label: 'Dhikr'         },
  { id: 'library',    label: 'Bibliothèque'  },
  { id: 'favorites',  label: 'Favoris'       },
]

export default function Navbar({ scrolled }) {
  const { page, setPage, theme, toggleTheme } = useAppStore()
  const isDay = theme === 'light'

  return (
    <motion.nav
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
      style={{
        height:   72,
        padding: '0 clamp(0.75rem, 3vw, 2rem)',
        background: scrolled ? (isDay ? 'rgba(245,242,237,0.94)' : 'rgba(10,10,26,0.88)') : 'transparent',
        backdropFilter:       scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--glass-border-soft)' : 'none',
        transition: 'background 0.4s, backdrop-filter 0.4s',
      }}
    >
      {/* Brand */}
      <button
        onClick={() => setPage('landing')}
        className="flex items-center gap-2 shrink-0"
        aria-label="Accueil"
      >
        <span className="font-arabic" style={{ fontSize: 'clamp(1.3rem, 3.5vw, 1.7rem)', color: 'var(--accent-gold)', lineHeight: 1 }}>
          قلبي
        </span>
        <span
          className="hidden sm:block font-mono uppercase"
          style={{ fontSize: '0.58rem', letterSpacing: '0.18em', color: 'var(--text-tertiary)' }}
        >
          MON CŒUR
        </span>
      </button>

      {/* Desktop links — scrollable si nécessaire */}
      <div className="hidden md:flex items-center gap-0 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {NAV_ITEMS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setPage(id)}
            className="relative px-3 py-2 font-body italic transition-colors duration-200 whitespace-nowrap shrink-0"
            style={{
              fontSize: '0.85rem',
              color: page === id ? 'var(--accent-gold)' : 'var(--text-secondary)',
            }}
          >
            {label}
            {page === id && (
              <motion.div
                layoutId="nav-dot"
                className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                style={{ background: 'var(--accent-gold)' }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Contrôles */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full transition-all hover:scale-110 active:scale-95"
          style={{
            color:      isDay ? 'var(--accent-gold-deep)' : 'var(--accent-gold)',
            background: 'var(--glass)',
            border:     '1px solid var(--glass-border)',
          }}
          aria-label={isDay ? 'Mode nuit' : 'Mode jour'}
        >
          <motion.div key={theme} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ duration: 0.28 }}>
            {isDay ? <Moon size={15} /> : <Sun size={15} />}
          </motion.div>
        </button>
      </div>
    </motion.nav>
  )
}
