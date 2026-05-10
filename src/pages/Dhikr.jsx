import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, Plus } from 'lucide-react'
import MandalaDrawing from '../components/Dhikr/MandalaDrawing'
import { useDhikrStore, DHIKR_ITEMS } from '../store/useDhikrStore'
import { useAppStore } from '../store/useAppStore'
import { useSoundEffect } from '../hooks/useSoundEffect'

export default function Dhikr() {
  const {
    selected, custom, isCustom,
    setSelected, setIsCustom, setCustomText,
    increment, reset, currentCount, currentItem,
  } = useDhikrStore()

  const theme   = useAppStore(s => s.theme)
  const isDay   = theme === 'light'
  const { play } = useSoundEffect()

  const item  = currentItem()
  const count = currentCount()
  const color = item.color || '#C9A84C'

  const [pulse, setPulse] = useState(0)

  const handleTap = useCallback(() => {
    play('select')
    increment()
    setPulse(p => p + 1)
  }, [increment, play])

  const handleReset = () => {
    play('paper')
    reset()
    setPulse(0)
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4 pt-4 pb-6 relative">

      {/* ── Titre ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-5 w-full"
      >
        <p
          className="font-mono tracking-[0.20em] uppercase mb-1"
          style={{ fontSize: 'clamp(0.58rem, 1.8vw, 0.68rem)', color: isDay ? 'var(--accent-joy-deep)' : 'var(--accent-gold)' }}
        >
          DHIKR
        </p>
        <h2
          className="font-display"
          style={{ fontSize: 'clamp(1.2rem, 4vw, 1.8rem)', color: 'var(--text-primary)' }}
        >
          Souvenir d'Allah
        </h2>
      </motion.div>

      {/* ── Sélecteur dhikr — grille visible sans scroll ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="flex flex-wrap justify-center gap-2 w-full max-w-lg mb-5"
      >
        {DHIKR_ITEMS.map(d => {
          const active = !isCustom && selected === d.id
          return (
            <button
              key={d.id}
              onClick={() => setSelected(d.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-pill transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                background: active ? `${d.color}22` : 'var(--glass)',
                border:     `1px solid ${active ? d.color + '70' : 'var(--glass-border)'}`,
                color:      active ? d.color : 'var(--text-secondary)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <span
                className="font-arabic leading-none"
                style={{ fontSize: 'clamp(0.82rem, 2.5vw, 0.96rem)', direction: 'rtl' }}
              >
                {d.ar}
              </span>
            </button>
          )
        })}

        {/* Custom */}
        <button
          onClick={() => setIsCustom(true)}
          className="flex items-center gap-1 px-3 py-2 rounded-pill transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            background: isCustom ? 'rgba(201,168,76,0.18)' : 'var(--glass)',
            border:     `1px solid ${isCustom ? 'var(--accent-gold)' : 'var(--glass-border)'}`,
            color:      isCustom ? 'var(--accent-gold)' : 'var(--text-secondary)',
          }}
        >
          <Plus size={12} />
          <span className="font-mono" style={{ fontSize: '0.65rem' }}>Perso</span>
        </button>
      </motion.div>

      {/* ── Input dhikr perso ── */}
      <AnimatePresence>
        {isCustom && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{    opacity: 0, height: 0 }}
            className="w-full max-w-sm mb-3 overflow-hidden"
          >
            <input
              value={custom.text}
              onChange={e => setCustomText(e.target.value)}
              placeholder="Écris ton dhikr en arabe ou français…"
              className="w-full rounded-pill px-4 py-2.5 outline-none font-arabic text-center transition-all duration-200"
              style={{
                fontSize:   'clamp(0.9rem, 2.8vw, 1.1rem)',
                direction:  'rtl',
                background: 'var(--glass)',
                border:     '1px solid var(--glass-border)',
                color:      'var(--text-primary)',
                backdropFilter: 'blur(12px)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Compteur + reset EN HAUT ── */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-4 mb-4"
      >
        <motion.span
          key={count}
          initial={{ scale: 1.3, opacity: 0.5 }}
          animate={{ scale: 1,   opacity: 1 }}
          transition={{ duration: 0.18 }}
          className="font-mono font-bold"
          style={{ fontSize: 'clamp(2rem, 6vw, 2.8rem)', color }}
        >
          {count}
        </motion.span>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-pill transition-all hover:scale-105 active:scale-95"
          style={{
            background: 'var(--glass)',
            border:     '1px solid var(--glass-border)',
            color:      'var(--text-tertiary)',
          }}
        >
          <RotateCcw size={13} />
          <span className="font-mono" style={{ fontSize: '0.65rem' }}>Réinit.</span>
        </button>
      </motion.div>

      {/* ── Mandala cliquable ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        onClick={handleTap}
        className="relative flex items-center justify-center"
        style={{
          cursor: 'pointer',
          WebkitTapHighlightColor: 'transparent',
          userSelect: 'none',
        }}
      >
        {/* Halo derrière */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none transition-all duration-500"
          style={{
            boxShadow: `0 0 ${40 + (Math.min(count, 100) / 100) * 80}px ${color}${Math.round(0.15 + (Math.min(count, 100) / 100) * 0.25 * 255).toString(16).padStart(2, '0')}`,
          }}
        />

        <MandalaDrawing
          count={count}
          color={color}
          pulse={pulse}
          size={Math.min(window.innerWidth - 48, 300)}
          variant={isCustom ? 'custom' : selected}
        />
      </motion.div>

      {/* ── Dhikr actif affiché ── */}
      <motion.div
        key={`${selected}-${isCustom}`}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mt-5"
      >
        <p
          className="font-arabic"
          style={{
            fontSize:  'clamp(1.3rem, 4.5vw, 1.8rem)',
            lineHeight: 1.8,
            color:     color,
            direction: 'rtl',
          }}
        >
          {isCustom ? (custom.text || 'Ton dhikr ici…') : item.ar}
        </p>
        {!isCustom && (
          <p className="font-body italic" style={{ fontSize: 'clamp(0.78rem, 2.2vw, 0.9rem)', color: 'var(--text-tertiary)' }}>
            {item.fr}
          </p>
        )}
      </motion.div>

      {/* ── Conseil tap (première fois) ── */}
      {count === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-3 font-body italic text-center"
          style={{ fontSize: 'clamp(0.75rem, 2vw, 0.88rem)', color: 'var(--text-tertiary)' }}
        >
          Touche la fleur pour commencer
        </motion.p>
      )}
    </div>
  )
}
