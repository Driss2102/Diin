import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

export default function Card({
  children,
  className,
  glow,
  moodColor,
  animated  = false,
  delay     = 0,
  onClick,
  ...props
}) {
  const glowStyle = moodColor
    ? `0 0 80px ${moodColor}25`
    : glow
    ? 'var(--glow-gold)'
    : 'none'

  return (
    <motion.div
      initial={animated ? { opacity: 0, y: 24 } : false}
      animate={animated ? { opacity: 1, y: 0  } : false}
      transition={animated ? { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] } : undefined}
      whileHover={onClick ? { scale: 1.02, y: -3 } : undefined}
      whileTap={onClick   ? { scale: 0.98 }         : undefined}
      onClick={onClick}
      className={cn('glass-card', onClick && 'cursor-pointer', className)}
      style={{
        boxShadow: `var(--shadow-card), ${glowStyle}`,
        borderColor: moodColor ? `${moodColor}40` : undefined,
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
