import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export default function Modal({ open, onClose, children, title }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{    opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100]"
            style={{ background: 'var(--overlay-scrim)', backdropFilter: 'blur(8px)' }}
          />
          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{    opacity: 0, scale: 0.92, y: 30 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[101] max-w-xl mx-auto p-8"
            style={{
              background:     'var(--glass-strong)',
              backdropFilter: 'blur(40px)',
              border:         '1px solid var(--glass-border)',
              borderRadius:   32,
              boxShadow:      'var(--shadow-card), var(--glow-gold)',
            }}
          >
            <div className="flex items-center justify-between mb-6">
              {title && (
                <h2 className="font-display text-lg" style={{ color: 'var(--accent-gold)' }}>
                  {title}
                </h2>
              )}
              <button
                onClick={onClose}
                className="ml-auto p-2 rounded-full transition-all hover:scale-110"
                style={{ color: 'var(--text-secondary)', background: 'var(--glass)' }}
              >
                <X size={16} />
              </button>
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
