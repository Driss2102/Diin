import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check } from 'lucide-react'
import { DUAAS, DUAA_CATEGORIES } from '../data/duaas'
import { useAppStore } from '../store/useAppStore'

const CAT_COLORS = {
  pardon:     '#E8A0B4',
  quotidien:  '#F7DC6F',
  protection: '#4ECDC4',
  difficulte: '#E67E22',
  voyage:     '#3498DB',
  savoir:     '#9B59B6',
  famille:    '#E74C3C',
  guerison:   '#27AE60',
}

function DuaaCard({ d, index }) {
  const [copied, setCopied] = useState(false)
  const catColor = CAT_COLORS[d.cat] || '#C9A84C'

  const handleCopy = () => {
    const text = `${d.arabic}\n\n${d.latin}\n\n« ${d.fr} »`
    navigator.clipboard?.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{    opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-card overflow-hidden mb-3"
      style={{
        background:     'var(--glass)',
        backdropFilter: 'blur(24px)',
        border:         `1px solid ${catColor}28`,
        boxShadow:      `var(--shadow-card), 0 0 30px ${catColor}10`,
      }}
    >
      {/* Barre colorée latérale */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-card"
        style={{ background: catColor }}
      />

      <div className="p-5 pl-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <span
              className="inline-block font-mono tracking-[0.12em] uppercase rounded-pill mb-1.5"
              style={{
                fontSize:   '0.6rem',
                padding:    '2px 8px',
                background: `${catColor}20`,
                border:     `1px solid ${catColor}45`,
                color:      catColor,
              }}
            >
              {DUAA_CATEGORIES.find(c => c.id === d.cat)?.icon}{' '}
              {DUAA_CATEGORIES.find(c => c.id === d.cat)?.label}
            </span>
            <h3
              className="font-display block"
              style={{
                fontSize: 'clamp(0.82rem, 2.5vw, 0.96rem)',
                color:    'var(--text-primary)',
              }}
            >
              {d.title}
            </h3>
            {d.subtitle && (
              <p className="font-body italic" style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                {d.subtitle}
              </p>
            )}
          </div>

          <button
            onClick={handleCopy}
            className="shrink-0 p-2 rounded-full transition-all hover:scale-110 active:scale-90 mt-1"
            style={{
              background: copied ? `${catColor}25` : 'var(--glass)',
              border:     `1px solid ${copied ? catColor : 'var(--glass-border)'}`,
              color:      copied ? catColor : 'var(--text-tertiary)',
            }}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
          </button>
        </div>

        {/* Texte arabe */}
        <p
          className="font-arabic text-right mb-4"
          style={{
            fontSize:   'clamp(1.05rem, 3.5vw, 1.4rem)',
            lineHeight: 2.3,
            color:      'var(--text-primary)',
            direction:  'rtl',
          }}
        >
          {d.arabic}
        </p>

        {/* Séparateur */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px" style={{ background: 'var(--glass-border)' }} />
          <span style={{ color: catColor, fontSize: 10 }}>✦</span>
          <div className="flex-1 h-px" style={{ background: 'var(--glass-border)' }} />
        </div>

        {/* Translittération */}
        <p
          className="font-body italic mb-3"
          style={{
            fontSize:   'clamp(0.72rem, 2vw, 0.82rem)',
            color:      'var(--text-tertiary)',
            lineHeight: 1.7,
          }}
        >
          {d.latin}
        </p>

        {/* Traduction française */}
        <p
          className="font-body"
          style={{
            fontSize:   'clamp(0.82rem, 2.4vw, 0.94rem)',
            color:      'var(--text-secondary)',
            lineHeight: 1.65,
          }}
        >
          « {d.fr} »
        </p>
      </div>
    </motion.div>
  )
}

export default function Duaa() {
  const theme  = useAppStore(s => s.theme)
  const isDay  = theme === 'light'
  const [activeCat, setActiveCat] = useState('all')

  const filtered = activeCat === 'all'
    ? DUAAS
    : DUAAS.filter(d => d.cat === activeCat)

  return (
    <div className="min-h-screen px-4 pt-4 pb-8">
      <div className="w-full max-w-2xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-7"
        >
          <p
            className="font-mono tracking-[0.20em] uppercase mb-2"
            style={{ fontSize: 'clamp(0.58rem, 1.8vw, 0.68rem)', color: isDay ? 'var(--accent-joy-deep)' : 'var(--accent-gold)' }}
          >
            INVOCATIONS
          </p>
          <h2
            className="font-display mb-1"
            style={{ fontSize: 'clamp(1.2rem, 4vw, 1.8rem)', color: 'var(--text-primary)' }}
          >
            الدُّعَاء
          </h2>
          <p className="font-body italic" style={{ fontSize: 'clamp(0.78rem, 2.2vw, 0.9rem)', color: 'var(--text-secondary)' }}>
            {filtered.length} doua{filtered.length > 1 ? 's' : ''} — Arabic · Latin · Français
          </p>
        </motion.div>

        {/* Filtres catégories */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.12 }}
          className="flex gap-2 overflow-x-auto pb-2 mb-6"
          style={{ scrollbarWidth: 'none' }}
        >
          {DUAA_CATEGORIES.map(cat => {
            const active = activeCat === cat.id
            const col    = CAT_COLORS[cat.id] || (isDay ? 'var(--accent-joy)' : 'var(--accent-gold)')
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className="flex-shrink-0 flex items-center gap-1.5 rounded-pill transition-all duration-200"
                style={{
                  padding:    '5px 12px',
                  background: active ? `${col}20` : 'var(--glass)',
                  border:     `1px solid ${active ? col + '60' : 'var(--glass-border)'}`,
                  color:      active ? col : 'var(--text-secondary)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <span style={{ fontSize: 13 }}>{cat.icon}</span>
                <span className="font-mono" style={{ fontSize: 'clamp(0.58rem, 1.6vw, 0.68rem)', letterSpacing: '0.08em' }}>
                  {cat.label}
                </span>
              </button>
            )
          })}
        </motion.div>

        {/* Cartes */}
        <AnimatePresence mode="popLayout">
          {filtered.map((d, i) => (
            <DuaaCard key={d.id} d={d} index={i} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
