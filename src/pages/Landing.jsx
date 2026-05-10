import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import FloatingJar     from '../components/Jar/FloatingJar'
import Button          from '../components/Common/Button'
import { StreakBadge } from '../components/Common/Badge'
import QuoteCarousel   from '../components/Common/QuoteCarousel'
import { useAppStore }  from '../store/useAppStore'
import { useMoodStore } from '../store/useMoodStore'
import { useSoundEffect } from '../hooks/useSoundEffect'

/* Taille du bocal selon écran */
function useJarSize() {
  const [size, setSize] = useState(200)
  useEffect(() => {
    const update = () => setSize(window.innerWidth < 400 ? 160 : window.innerWidth < 600 ? 190 : 220)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return size
}

export default function Landing() {
  const setPage = useAppStore(s => s.setPage)
  const streak  = useAppStore(s => s.streak)
  const openJar = useMoodStore(s => s.openJar)
  const theme   = useAppStore(s => s.theme)
  const isDay   = theme === 'light'
  const jarSize = useJarSize()

  const { play } = useSoundEffect()
  const [clicked, setClicked] = useState(false)

  const handleJarClick = () => {
    if (clicked) return
    setClicked(true)
    play('jar_open')
    openJar()
    setTimeout(() => setPage('mood'), 800)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">

      {/* ── Bism Allah ── */}
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="font-arabic text-center mb-5"
        style={{ fontSize: 'clamp(1rem, 3.5vw, 1.3rem)', color: 'var(--accent-gold)', opacity: 0.82, direction: 'rtl' }}
      >
        ✦ بسم الله الرحمن الرحيم ✦
      </motion.p>

      {/* ── Brand ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.85, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-1"
      >
        <h1
          className="font-arabic leading-none text-gold-shimmer"
          style={{ fontSize: 'clamp(3rem, 11vw, 5.5rem)' }}
        >
          قلبي
        </h1>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="font-display tracking-[0.3em] uppercase mb-6 text-center"
        style={{
          fontSize: 'clamp(0.6rem, 2vw, 0.78rem)',
          color: isDay ? 'var(--accent-joy-deep)' : 'var(--accent-gold)',
        }}
      >
        MON CŒUR
      </motion.p>

      {/* ── Streak ── */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="mb-6"
      >
        <StreakBadge days={streak} />
      </motion.div>

      {/* ── Citation tournante ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.6 }}
        className="w-full max-w-[360px] mb-10"
        style={{ minHeight: 100 }}
      >
        <QuoteCarousel />
      </motion.div>

      {/* ── Bocal 3D ── */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.88 }}
        animate={{ opacity: 1, y: 0,  scale: 1 }}
        transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8"
      >
        <FloatingJar onClick={handleJarClick} size={jarSize} />
      </motion.div>

      {/* ── CTA ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85 }}
        className="flex flex-col items-center gap-3 w-full max-w-xs"
      >
        <Button
          size="lg"
          variant={isDay ? 'joy' : 'primary'}
          onClick={handleJarClick}
          disabled={clicked}
          className="w-full"
        >
          🌟 Ouvrir le bocal
        </Button>
        <p
          className="font-body italic text-center"
          style={{ fontSize: 'clamp(0.8rem, 2.5vw, 0.95rem)', color: 'var(--text-tertiary)' }}
        >
          Quel est ton mood aujourd'hui ?
        </p>
      </motion.div>

      {/* Flash d'ouverture */}
      {clicked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 pointer-events-none z-40"
          style={{
            background: isDay
              ? 'radial-gradient(ellipse at center, rgba(78,205,196,0.35) 0%, transparent 70%)'
              : 'radial-gradient(ellipse at center, rgba(255,215,0,0.35) 0%, transparent 70%)',
          }}
        />
      )}
    </div>
  )
}
