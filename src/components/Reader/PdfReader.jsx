import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import PdfViewer from './PdfViewer'

export default function PdfReader({ book, onClose }) {
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

        <div style={{ width: 36 }} />
      </div>

      {/* ── Barre couleur ────────────────────────────────── */}
      <div className="shrink-0" style={{ height: 2, background: `${book.color}30` }}>
        <div style={{ width: '100%', height: '100%', background: book.color, opacity: 0.6 }} />
      </div>

      {/* ── Viewer PDF.js — fonctionne iOS + Android + Desktop ── */}
      <PdfViewer src={book.file} color={book.color} />
    </motion.div>
  )
}
