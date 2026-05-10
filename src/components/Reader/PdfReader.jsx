import { useState } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'

export default function PdfReader({ book, onClose }) {
  const [loaded, setLoaded] = useState(false)

  /* URL avec paramètres pour masquer la toolbar du navigateur */
  const src = `${book.file}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0  }}
      exit={{    opacity: 0, y: 40  }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[200] flex flex-col"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* ── Barre de titre ───────────────────────────────── */}
      <div
        className="flex items-center justify-between px-3 shrink-0"
        style={{
          height:               56,
          background:           'var(--glass)',
          backdropFilter:       'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom:         `1px solid ${book.color}40`,
        }}
      >
        {/* Fermer */}
        <button
          onClick={onClose}
          className="w-9 h-9 flex items-center justify-center rounded-full transition-all hover:scale-110 active:scale-90"
          style={{
            color:      'var(--text-secondary)',
            background: 'var(--glass)',
            border:     '1px solid var(--glass-border)',
          }}
        >
          <X size={17} />
        </button>

        {/* Titre */}
        <p
          className="font-arabic flex-1 text-center px-2"
          style={{
            fontSize:  'clamp(1rem, 3.5vw, 1.3rem)',
            color:     book.color,
            direction: 'rtl',
          }}
        >
          {book.titleAr}
        </p>

        {/* Spacer symétrique */}
        <div style={{ width: 36 }} />
      </div>

      {/* ── Barre de progression couleur ─────────────────── */}
      <div
        className="shrink-0"
        style={{ height: 2, background: `${book.color}30` }}
      >
        <div style={{ width: '100%', height: '100%', background: book.color, opacity: 0.6 }} />
      </div>

      {/* ── Indicateur de chargement ─────────────────────── */}
      {!loaded && (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 pointer-events-none"
          style={{ top: 58, background: 'var(--bg-primary)' }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            style={{ fontSize: 40, color: book.color }}
          >
            ☪
          </motion.div>
          <p
            className="font-body italic"
            style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)' }}
          >
            Chargement du livre…
          </p>
        </div>
      )}

      {/* ── Lecteur PDF natif ─────────────────────────────── */}
      <iframe
        src={src}
        title={book.titleAr}
        onLoad={() => setLoaded(true)}
        style={{
          flex:    1,
          border:  'none',
          width:   '100%',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.4s ease',
          background: 'var(--bg-tertiary)',
        }}
      />
    </motion.div>
  )
}
