import { motion } from 'framer-motion'
import { useAppStore } from '../../store/useAppStore'

const PARTICLE_COUNT = 24

export default function Particles() {
  const theme = useAppStore(s => s.theme)
  const isDay = theme === 'light'

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {Array.from({ length: PARTICLE_COUNT }, (_, i) => {
        const left    = Math.random() * 100
        const delay   = -(Math.random() * 18)
        const dur     = 14 + Math.random() * 10
        const size    = 2 + Math.random() * 3
        const opacity = 0.3 + Math.random() * 0.5

        return (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              left:   `${left}%`,
              bottom: '-10px',
              width:  size,
              height: size,
              background: isDay
                ? `rgba(78,205,196,${opacity})`
                : `rgba(201,168,76,${opacity})`,
              boxShadow: isDay
                ? `0 0 ${size * 3}px rgba(78,205,196,0.6)`
                : `0 0 ${size * 3}px rgba(201,168,76,0.6)`,
            }}
            animate={{
              y:       [0, -(window.innerHeight + 40)],
              opacity: [0, opacity, opacity * 0.8, 0],
              scale:   [0.5, 1, 0.8, 0.3],
            }}
            transition={{
              duration:   dur,
              delay,
              repeat:     Infinity,
              ease:       'linear',
              repeatType: 'loop',
            }}
          />
        )
      })}
    </div>
  )
}
