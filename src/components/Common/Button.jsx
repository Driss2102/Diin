import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

export default function Button({
  children,
  variant   = 'primary',
  size      = 'md',
  onClick,
  disabled,
  className,
  ...props
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-display rounded-pill cursor-pointer select-none transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed'

  const sizes = {
    sm: 'px-5 py-2 text-xs tracking-[0.12em]',
    md: 'px-8 py-3 text-sm tracking-[0.10em]',
    lg: 'px-10 py-4 text-base tracking-[0.08em]',
  }

  const variants = {
    primary: '',
    ghost:   '',
    joy:     '',
  }

  const styles = {
    primary: {
      background:  'var(--accent-gold)',
      color:       'var(--text-on-gold)',
      border:      '1px solid var(--accent-gold)',
      boxShadow:   'var(--glow-gold-sm)',
    },
    ghost: {
      background:  'var(--glass)',
      color:       'var(--text-primary)',
      border:      '1px solid var(--glass-border)',
      backdropFilter: 'blur(12px)',
    },
    joy: {
      background:  'var(--accent-joy)',
      color:       'var(--text-on-joy)',
      border:      '1px solid var(--accent-joy)',
      boxShadow:   'var(--glow-joy)',
    },
  }

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.04, y: disabled ? 0 : -2 }}
      whileTap={{   scale: disabled ? 1 : 0.97 }}
      transition={{ duration: 0.15 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(base, sizes[size], variants[variant], className)}
      style={styles[variant]}
      {...props}
    >
      {children}
    </motion.button>
  )
}
