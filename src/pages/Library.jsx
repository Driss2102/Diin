import { motion } from 'framer-motion'
import { BookOpen } from 'lucide-react'
import { BOOKS } from '../data/books'
import { useLibraryStore } from '../store/useLibraryStore'

export default function Library() {
  const openBook_set = useLibraryStore(s => s.openBook_set)

  return (
    <>
      <div className="min-h-screen px-4 pt-4 pb-6">

        {/* ── Titre ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 w-full"
        >
          <p
            className="font-mono tracking-[0.20em] uppercase mb-1"
            style={{ fontSize: 'clamp(0.58rem, 1.8vw, 0.68rem)', color: 'var(--accent-gold)' }}
          >
            BIBLIOTHÈQUE
          </p>
          <h2
            className="font-display"
            style={{ fontSize: 'clamp(1.2rem, 4vw, 1.8rem)', color: 'var(--text-primary)' }}
          >
            Livres Islamiques
          </h2>
          <p
            className="font-body italic mt-1"
            style={{ fontSize: 'clamp(0.75rem, 2.2vw, 0.88rem)', color: 'var(--text-tertiary)' }}
          >
            Lis et médite à ton rythme
          </p>
        </motion.div>

        {/* ── Cartes livres ── */}
        <div className="flex flex-col gap-5 max-w-lg mx-auto">
          {BOOKS.map((book, i) => (
            <motion.button
              key={book.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => openBook_set(book)}
              className="w-full text-left rounded-card overflow-hidden transition-all duration-200 hover:scale-[1.015] active:scale-[0.985]"
              style={{
                background:     'var(--glass)',
                border:         `1px solid ${book.color}45`,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow:      `0 8px 32px ${book.color}10`,
              }}
            >
              {/* Bandeau couverture */}
              <div
                className="w-full flex flex-col items-center justify-center py-10 relative overflow-hidden"
                style={{
                  background:   `linear-gradient(145deg, ${book.color}18 0%, ${book.color}38 100%)`,
                  borderBottom: `1px solid ${book.color}30`,
                  minHeight:    160,
                }}
              >
                {/* Motif arabesque en filigrane */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage:    'url(/assets/arabesque-watermark.svg)',
                    backgroundSize:     '45%',
                    backgroundPosition: 'center',
                    backgroundRepeat:   'no-repeat',
                    opacity:            0.06,
                  }}
                />
                {/* Titre arabe */}
                <p
                  className="font-arabic relative z-10 text-center px-4"
                  style={{
                    fontSize:  'clamp(1.5rem, 5vw, 2.2rem)',
                    color:     book.color,
                    direction: 'rtl',
                    lineHeight: 1.6,
                    textShadow: `0 2px 12px ${book.color}40`,
                  }}
                >
                  {book.titleAr}
                </p>
              </div>

              {/* Infos + bouton lire */}
              <div className="px-4 py-3 flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p
                    className="font-body italic truncate"
                    style={{ fontSize: 'clamp(0.82rem, 2.5vw, 0.95rem)', color: 'var(--text-primary)' }}
                  >
                    {book.titleFr}
                  </p>
                  <p
                    className="font-mono mt-0.5 truncate"
                    style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', letterSpacing: '0.06em' }}
                  >
                    {book.description}
                  </p>
                </div>

                {/* Icône lire */}
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-pill shrink-0"
                  style={{
                    background: `${book.color}20`,
                    border:     `1px solid ${book.color}50`,
                    color:       book.color,
                  }}
                >
                  <BookOpen size={13} />
                  <span className="font-mono" style={{ fontSize: '0.6rem' }}>Lire</span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Citation bas de page */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center font-arabic mt-8"
          style={{
            fontSize:  'clamp(1rem, 3vw, 1.3rem)',
            color:     'var(--accent-gold)',
            opacity:   0.5,
            direction: 'rtl',
          }}
        >
          اقْرَأْ بِاسْمِ رَبِّكَ
        </motion.p>
      </div>

    </>
  )
}
