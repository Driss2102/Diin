import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Background    from './components/Background/Background'
import Navbar        from './components/Layout/Navbar'
import BottomNav     from './components/Layout/BottomNav'
import Landing       from './pages/Landing'
import MoodSelector  from './pages/MoodSelector'
import Revelation    from './pages/Revelation'
import Favorites     from './pages/Favorites'
import Duaa          from './pages/Duaa'
import Dhikr         from './pages/Dhikr'
import Library       from './pages/Library'
import PdfReader     from './components/Reader/PdfReader'
import { useAppStore }     from './store/useAppStore'
import { useLibraryStore } from './store/useLibraryStore'

const PAGES = {
  landing:    Landing,
  mood:       MoodSelector,
  revelation: Revelation,
  favorites:  Favorites,
  duaa:       Duaa,
  dhikr:      Dhikr,
  library:    Library,
}

const pageVariants = {
  initial: { opacity: 0 },
  enter:   { opacity: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
}

export default function App() {
  const page            = useAppStore(s => s.page)
  const theme           = useAppStore(s => s.theme)
  const incrementStreak = useAppStore(s => s.incrementStreak)
  const [scrolled, setScrolled] = useState(false)

  const openBook       = useLibraryStore(s => s.openBook)
  const openBook_clear = useLibraryStore(s => s.openBook_clear)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark',  theme === 'dark')
    root.classList.toggle('light', theme === 'light')
  }, [theme])

  useEffect(() => { incrementStreak() }, [incrementStreak])

  /* Ferme le lecteur automatiquement si l'utilisateur change de page */
  useEffect(() => { openBook_clear() }, [page]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const Page = PAGES[page] || Landing

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Background />
      <Navbar scrolled={scrolled} />
      <main className="relative z-10" style={{ paddingTop: 72, paddingBottom: 80, minHeight: '100vh' }}>
        <motion.div
          key={page}
          variants={pageVariants}
          initial="initial"
          animate="enter"
        >
          <Page />
        </motion.div>
      </main>
      <BottomNav />

      {/* ── Lecteur PDF ─ rendu hors de <main> pour que z-[200] couvre Navbar + BottomNav ── */}
      <AnimatePresence>
        {openBook && (
          <PdfReader
            key={openBook.id}
            book={openBook}
            onClose={openBook_clear}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
