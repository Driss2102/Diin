import { motion } from 'framer-motion'
import MoodGrid from '../components/MoodSelector/MoodGrid'
import { useAppStore } from '../store/useAppStore'

export default function MoodSelector() {
  const theme = useAppStore(s => s.theme)
  const isDay = theme === 'light'

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4 pb-8 pt-4">

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-8 w-full"
      >
        <p
          className="font-mono tracking-[0.20em] uppercase mb-3"
          style={{
            fontSize: 'clamp(0.6rem, 2vw, 0.72rem)',
            color: isDay ? 'var(--accent-joy-deep)' : 'var(--accent-gold)',
          }}
        >
          MOOD DU JOUR
        </p>
        <h2
          className="font-display mb-2 leading-tight"
          style={{
            fontSize: 'clamp(1.3rem, 5vw, 2rem)',
            color: 'var(--text-primary)',
          }}
        >
          Comment te sens-tu&nbsp;?
        </h2>
        <p
          className="font-body italic"
          style={{
            fontSize: 'clamp(0.85rem, 2.5vw, 1rem)',
            color: 'var(--text-secondary)',
          }}
        >
          Choisis l'émotion de ton cœur.
        </p>
      </motion.div>

      {/* Mood grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="w-full"
      >
        <MoodGrid />
      </motion.div>

      {/* Quote bas */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-8 font-body italic text-center px-4"
        style={{
          fontSize: 'clamp(0.78rem, 2.2vw, 0.9rem)',
          color: 'var(--text-tertiary)',
          maxWidth: 280,
        }}
      >
        « Allah voit chaque effort silencieux de ton cœur. »
      </motion.p>
    </div>
  )
}
