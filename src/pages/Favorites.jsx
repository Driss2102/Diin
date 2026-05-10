import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Trash2 } from 'lucide-react'
import { TypeBadge, MoodBadge } from '../components/Common/Badge'
import Button from '../components/Common/Button'
import { useAppStore } from '../store/useAppStore'

export default function Favorites() {
  const favorites      = useAppStore(s => s.favorites)
  const removeFavorite = useAppStore(s => s.removeFavorite)
  const setPage        = useAppStore(s => s.setPage)
  const theme          = useAppStore(s => s.theme)
  const isDay          = theme === 'light'

  return (
    <div className="min-h-screen section-pad px-6">
      <div className="content-max w-full">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <p
            className="font-mono text-xs tracking-[0.22em] uppercase mb-3"
            style={{ color: isDay ? 'var(--accent-joy)' : 'var(--accent-gold)' }}
          >
            MES PERLES
          </p>
          <h2
            className="font-display mb-2"
            style={{ fontSize: 'var(--fs-h1)', color: 'var(--text-primary)' }}
          >
            Favoris
          </h2>
          <p className="font-body italic" style={{ color: 'var(--text-secondary)' }}>
            {favorites.length > 0
              ? `${favorites.length} perle${favorites.length > 1 ? 's' : ''} sauvegardée${favorites.length > 1 ? 's' : ''}`
              : 'Aucune perle sauvegardée pour le moment.'
            }
          </p>
        </motion.div>

        {/* Empty state */}
        {favorites.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 gap-8"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-7xl opacity-30"
            >
              🤲
            </motion.div>
            <p className="font-body italic text-center max-w-sm" style={{ color: 'var(--text-tertiary)' }}>
              Les versets qui touchent ton cœur apparaîtront ici.
            </p>
            <Button onClick={() => setPage('mood')}>
              Découvrir un verset
            </Button>
          </motion.div>
        )}

        {/* Favorite cards */}
        <AnimatePresence>
          {favorites.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0  }}
              exit={{    opacity: 0, x:  20, scale: 0.95 }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-card p-6 md:p-8 mb-4 group"
              style={{
                background:     'var(--glass)',
                backdropFilter: 'blur(24px)',
                border:         `1px solid ${item.mood?.color ? `${item.mood.color}30` : 'var(--glass-border)'}`,
                boxShadow:      item.mood?.color
                  ? `var(--shadow-card), 0 0 40px ${item.mood.color}15`
                  : 'var(--shadow-card)',
              }}
            >
              {/* Arabesque bg */}
              <div
                className="absolute inset-0 rounded-card pointer-events-none opacity-[0.04]"
                style={{
                  backgroundImage: 'url(/assets/arabesque-watermark.svg)',
                  backgroundSize: '40%',
                  backgroundPosition: 'center right',
                  backgroundRepeat: 'no-repeat',
                }}
              />

              {/* Top row */}
              <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <TypeBadge type={item.type} />
                  {item.mood && <MoodBadge mood={item.mood} />}
                </div>
                <button
                  onClick={() => removeFavorite(item.id)}
                  className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 rounded-full hover:scale-110"
                  style={{ color: '#E8A0B4', background: 'rgba(232,160,180,0.10)' }}
                  aria-label="Supprimer"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Arabic */}
              <p
                className="font-arabic text-center mb-4"
                style={{
                  fontSize:   'var(--fs-arabic-lg)',
                  lineHeight: 'var(--leading-arabic)',
                  color:      'var(--text-primary)',
                  direction:  'rtl',
                }}
              >
                {item.arabic}
              </p>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px" style={{ background: 'var(--glass-border)' }} />
                <Heart size={12} style={{ color: 'var(--accent-gold)' }} />
                <div className="flex-1 h-px" style={{ background: 'var(--glass-border)' }} />
              </div>

              {/* Translation */}
              <p
                className="font-body italic text-center mb-3"
                style={{ fontSize: 'var(--fs-body)', color: 'var(--text-secondary)' }}
              >
                « {item.translation} »
              </p>

              {/* Ref */}
              <p
                className="font-mono text-center"
                style={{ fontSize: 'var(--fs-mono)', color: item.mood?.color || 'var(--accent-gold)' }}
              >
                {item.ref}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
