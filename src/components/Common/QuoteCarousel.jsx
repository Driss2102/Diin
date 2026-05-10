import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { QUOTES } from '../../data/quotes'
import { useAppStore } from '../../store/useAppStore'

const INTERVAL = 6500
const POOL_SIZE = 5

/* 5 citations aléatoires choisies UNE FOIS au montage */
function pickRandom() {
  return [...QUOTES]
    .sort(() => Math.random() - 0.5)
    .slice(0, POOL_SIZE)
}

export default function QuoteCarousel() {
  const isDay = useAppStore(s => s.theme) === 'light'
  const [pool]   = useState(pickRandom)
  const [index,  setIndex]    = useState(0)
  const [dir,    setDir]      = useState(1)

  const advance = useCallback((d = 1) => {
    setDir(d)
    setIndex(i => (i + d + POOL_SIZE) % POOL_SIZE)
  }, [])

  useEffect(() => {
    const t = setInterval(() => advance(1), INTERVAL)
    return () => clearInterval(t)
  }, [advance])

  const q = pool[index]

  const v = {
    enter:  d => ({ opacity: 0, y: d > 0 ?  12 : -12 }),
    center: {    opacity: 1, y: 0 },
    exit:   d => ({ opacity: 0, y: d > 0 ? -8  :  8  }),
  }

  return (
    <div className="relative w-full" style={{ minHeight: 110 }}>
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={index}
          custom={dir}
          variants={v}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-2"
        >
          {/* Arabe — prioritaire, grand */}
          <p
            className="font-arabic text-center"
            style={{
              fontSize:  'clamp(1.1rem, 3.8vw, 1.4rem)',
              lineHeight: 1.8,
              color:     'var(--text-primary)',
              direction: 'rtl',
            }}
          >
            {q.ar}
          </p>
          {/* Français — discret, sous-titre */}
          <p
            className="font-body italic text-center"
            style={{
              fontSize:  'clamp(0.65rem, 2vw, 0.78rem)',
              color:     'var(--text-tertiary)',
              lineHeight: 1.4,
            }}
          >
            {q.fr}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* 5 dots */}
      <div className="absolute -bottom-5 left-0 right-0 flex justify-center gap-1.5">
        {pool.map((_, i) => (
          <button
            key={i}
            onClick={() => { setDir(i > index ? 1 : -1); setIndex(i) }}
            className="rounded-full transition-all duration-300"
            style={{
              width:      i === index ? 16 : 4,
              height:     4,
              background: i === index
                ? (isDay ? 'var(--accent-joy)' : 'var(--accent-gold)')
                : 'var(--glass-border)',
            }}
          />
        ))}
      </div>
    </div>
  )
}
