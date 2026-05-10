import { motion } from 'framer-motion'
import { useMoodStore } from '../../store/useMoodStore'
import { useAppStore }  from '../../store/useAppStore'
import { MOODS }         from '../../data/moods'
import { useSoundEffect } from '../../hooks/useSoundEffect'

const container = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.055 } },
}

const item = {
  hidden: { opacity: 0, scale: 0.78, y: 14 },
  show:   {
    opacity: 1, scale: 1, y: 0,
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function MoodGrid({ onSelect }) {
  const selectedMood = useMoodStore(s => s.selectedMood)
  const selectMood   = useMoodStore(s => s.selectMood)
  const setPage      = useAppStore(s  => s.setPage)
  const { play }     = useSoundEffect()

  const handleSelect = (mood) => {
    play('select')
    selectMood(mood.id)
    setTimeout(() => { setPage('revelation'); onSelect?.() }, 380)
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-3 gap-2.5 w-full max-w-[480px] mx-auto px-1"
    >
      {MOODS.map((mood) => {
        const active = selectedMood?.id === mood.id

        return (
          <motion.button
            key={mood.id}
            variants={item}
            whileHover={{ scale: 1.07, y: -3, transition: { duration: 0.18 } }}
            whileTap={{   scale: 0.93 }}
            onClick={() => handleSelect(mood)}
            className="relative flex flex-col items-center justify-center gap-2 rounded-[18px] group transition-all duration-300"
            style={{
              /* Hauteur proportionnelle à la largeur */
              aspectRatio: '1 / 1.25',
              padding:     'clamp(8px, 2.5vw, 16px)',
              background:  active ? `${mood.color}20` : 'var(--glass)',
              border:      active ? `1px solid ${mood.color}65` : '1px solid var(--glass-border)',
              backdropFilter: 'blur(24px)',
              boxShadow:   active
                ? `0 0 28px ${mood.color}30, var(--shadow-card)`
                : 'var(--shadow-card)',
            }}
          >
            {/* Emoji */}
            <motion.span
              style={{ fontSize: 'clamp(1.5rem, 5.5vw, 2.1rem)', lineHeight: 1 }}
              animate={active ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.35 }}
              className="select-none"
            >
              {mood.emoji}
            </motion.span>

            {/* Label arabe — prioritaire */}
            <span
              className="font-arabic text-center leading-none w-full"
              style={{
                fontSize:     'clamp(1rem, 3.4vw, 1.2rem)',
                color:        active ? mood.color : 'var(--text-primary)',
                direction:    'rtl',
                overflow:     'hidden',
                textOverflow: 'ellipsis',
                whiteSpace:   'nowrap',
              }}
            >
              {mood.labelAr}
            </span>

            {/* Label français — discret */}
            <span
              className="font-body italic text-center leading-tight w-full"
              style={{
                fontSize:     'clamp(0.48rem, 1.5vw, 0.6rem)',
                color:        active ? `${mood.color}CC` : 'var(--text-tertiary)',
                overflow:     'hidden',
                textOverflow: 'ellipsis',
                whiteSpace:   'nowrap',
                marginTop:    '-3px',
              }}
            >
              {mood.label}
            </span>

            {/* Contour sélectionné */}
            {active && (
              <motion.div
                layoutId="mood-ring"
                className="absolute inset-0 rounded-[18px] pointer-events-none"
                style={{ border: `2px solid ${mood.color}` }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            )}

            {/* Aura hover */}
            <div
              className="absolute inset-0 rounded-[18px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{ background: `radial-gradient(circle at center, ${mood.color}12, transparent 70%)` }}
            />
          </motion.button>
        )
      })}
    </motion.div>
  )
}
