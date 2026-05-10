import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Share2, RefreshCw } from 'lucide-react'
import { TypeBadge, MoodBadge } from '../components/Common/Badge'
import Button from '../components/Common/Button'
import { useMoodStore }   from '../store/useMoodStore'
import { useAppStore }    from '../store/useAppStore'
import { useSoundEffect } from '../hooks/useSoundEffect'
import { getRandomVerse } from '../data/verses'

export default function Revelation() {
  /* ── Stores ─────────────────────────────────── */
  const selectedMood   = useMoodStore(s => s.selectedMood)
  const currentVerse   = useMoodStore(s => s.currentVerse)
  const setPage        = useAppStore(s => s.setPage)
  const addFavorite    = useAppStore(s => s.addFavorite)
  const removeFavorite = useAppStore(s => s.removeFavorite)
  const isFavorite     = useAppStore(s => s.isFavorite)
  const theme          = useAppStore(s => s.theme)

  /* ── Son ──────────────────────────────────────── */
  const { play } = useSoundEffect()

  /* ── Verset local ─────────────────────────────────────────
     localVerse override pour "Un autre". Quand le mood change
     (nouveau choix), on le remet à null pour afficher le
     currentVerse frais du store (maintenant persisté).          ── */
  const [localVerse, setLocalVerse] = useState(null)

  useEffect(() => {
    // Nouveau mood sélectionné → oublie l'override local
    setLocalVerse(null)
  }, [selectedMood?.id])

  const verse = localVerse || currentVerse   // toujours frais

  const isDay     = theme === 'light'
  const moodColor = selectedMood?.color || 'var(--accent-gold)'
  const favorited = verse ? isFavorite(verse.id) : false

  /* ── Actions ─────────────────────────────────── */
  const handleNewVerse = useCallback(() => {
    play('paper')
    setLocalVerse(null)
    // petit delay pour l'animation exit
    setTimeout(() => {
      setLocalVerse(getRandomVerse(selectedMood?.id))
    }, 300)
  }, [play, selectedMood])

  const handleFavorite = useCallback(() => {
    if (!verse) return
    play('favorite')
    favorited ? removeFavorite(verse.id) : addFavorite({ ...verse, mood: selectedMood })
  }, [verse, favorited, play, addFavorite, removeFavorite, selectedMood])

  const handleShare = useCallback(() => {
    if (!verse) return
    const text = `${verse.arabic}\n\n« ${verse.translation} »\n\n${verse.ref}\n\nقلبي — Mon Cœur`
    navigator.share?.({ text }) ?? navigator.clipboard?.writeText(text)
  }, [verse])

  /* ── Fallback : pas encore de mood sélectionné ── */
  if (!selectedMood || !verse) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <motion.span
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ fontSize: 64 }}
          >
            🤲
          </motion.span>
          <p
            className="font-body italic"
            style={{ color: 'var(--text-secondary)', fontSize: 'clamp(1rem, 3vw, 1.2rem)' }}
          >
            Choisis d'abord ton mood pour recevoir un verset.
          </p>
          <Button onClick={() => setPage('mood')}>Choisir mon mood</Button>
        </motion.div>
      </div>
    )
  }

  /* ── Page principale ─────────────────────────── */
  return (
    <div className="min-h-screen flex flex-col items-center px-4 pt-4 pb-6">
      <div className="w-full max-w-lg">

        {/* Badge mood */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-6"
        >
          <MoodBadge mood={selectedMood} />
        </motion.div>

        {/* Carte verset */}
        <AnimatePresence mode="wait">
          <motion.div
            key={verse.id}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{    opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="relative rounded-card overflow-hidden"
              style={{
                padding:        'clamp(1.4rem, 5vw, 2.5rem)',
                background:     'var(--glass)',
                backdropFilter: 'blur(28px)',
                WebkitBackdropFilter: 'blur(28px)',
                border:         `1px solid ${moodColor}35`,
                boxShadow:      `var(--shadow-card), 0 0 60px ${moodColor}18`,
              }}
            >
              {/* Arabesque watermark */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage:    'url(/assets/arabesque-watermark.svg)',
                  backgroundSize:     '55%',
                  backgroundPosition: 'center',
                  backgroundRepeat:   'no-repeat',
                  opacity:            0.05,
                }}
              />

              {/* Badge type */}
              <div className="flex justify-center mb-5">
                <TypeBadge type={verse.type} />
              </div>

              {/* Arabe */}
              <p
                className="font-arabic text-center mb-5"
                style={{
                  fontSize:  'clamp(1.2rem, 4.5vw, 1.9rem)',
                  lineHeight: 2.4,
                  color:     'var(--text-primary)',
                  direction: 'rtl',
                  wordBreak: 'keep-all',
                }}
              >
                {verse.arabic}
              </p>

              {/* Séparateur */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px" style={{ background: 'var(--glass-border)' }} />
                <span style={{ color: 'var(--accent-gold)', fontSize: 11 }}>✦</span>
                <div className="flex-1 h-px" style={{ background: 'var(--glass-border)' }} />
              </div>

              {/* Traduction */}
              <p
                className="font-body italic text-center mb-4"
                style={{
                  fontSize:  'clamp(0.92rem, 3vw, 1.18rem)',
                  lineHeight: 1.65,
                  color:     'var(--text-primary)',
                }}
              >
                « {verse.translation} »
              </p>

              {/* Référence */}
              <p
                className="font-mono text-center"
                style={{ fontSize: 'clamp(0.62rem, 1.8vw, 0.76rem)', color: moodColor }}
              >
                {verse.ref}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Barre d'actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-2 mt-6"
        >
          <ActionBtn
            onClick={handleFavorite}
            active={favorited}
            activeColor="#E8A0B4"
            icon={<Heart size={14} fill={favorited ? '#E8A0B4' : 'none'} />}
            label="Sauvegarder"
          />
          <ActionBtn
            onClick={handleShare}
            icon={<Share2 size={14} />}
            label="Partager"
          />
          <ActionBtn
            onClick={handleNewVerse}
            icon={<RefreshCw size={14} />}
            label="Un autre"
            accent={isDay ? 'var(--accent-joy)' : 'var(--accent-gold)'}
          />
        </motion.div>

        {/* Message du jour */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center font-body italic mt-6 px-4"
          style={{ fontSize: 'clamp(0.72rem, 2.2vw, 0.86rem)', color: 'var(--text-tertiary)' }}
        >
          Allah voit chaque effort silencieux de ton cœur.
        </motion.p>
      </div>
    </div>
  )
}

/* ── Bouton action réutilisable ───────────────────── */
function ActionBtn({ onClick, icon, label, active, activeColor, accent }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-pill transition-all duration-200 hover:scale-105 active:scale-95"
      style={{
        padding:    '7px 13px',
        background: active ? `${activeColor}20` : 'var(--glass)',
        border:     `1px solid ${active ? activeColor + '55' : accent ? accent + '44' : 'var(--glass-border)'}`,
        color:      active ? activeColor : accent || 'var(--text-secondary)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {icon}
      <span className="font-mono" style={{ fontSize: 'clamp(0.56rem, 1.7vw, 0.68rem)' }}>
        {label}
      </span>
    </button>
  )
}
