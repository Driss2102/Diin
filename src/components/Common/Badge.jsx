import { cn } from '../../utils/cn'

const TYPE_COLORS = {
  "PAROLE D'ALLAH": { bg: 'rgba(201,168,76,0.15)', border: 'rgba(201,168,76,0.40)', color: '#C9A84C' },
  "INVOCATION":     { bg: 'rgba(78,205,196,0.15)', border: 'rgba(78,205,196,0.40)', color: '#4ECDC4' },
  "SAGESSE":        { bg: 'rgba(165,105,189,0.15)', border: 'rgba(165,105,189,0.40)', color: '#A569BD' },
}

export function TypeBadge({ type, className }) {
  const style = TYPE_COLORS[type] || TYPE_COLORS["PAROLE D'ALLAH"]
  return (
    <span
      className={cn('inline-block font-mono tracking-[0.14em] uppercase rounded-pill whitespace-nowrap', className)}
      style={{
        fontSize:     'clamp(0.58rem, 1.8vw, 0.68rem)',
        padding:      '3px 10px',
        background:   style.bg,
        border:       `1px solid ${style.border}`,
        color:        style.color,
      }}
    >
      {type}
    </span>
  )
}

export function StreakBadge({ days = 1, className }) {
  return (
    <div
      className={cn('inline-flex items-center gap-2 rounded-pill', className)}
      style={{
        padding:    '5px 14px',
        background: 'rgba(255,215,0,0.12)',
        border:     '1px solid rgba(255,215,0,0.30)',
        boxShadow:  '0 0 20px rgba(255,215,0,0.12)',
      }}
    >
      <span style={{ fontSize: 14, lineHeight: 1 }}>🔥</span>
      <span
        className="font-mono tracking-[0.14em] uppercase"
        style={{ fontSize: 'clamp(0.6rem, 1.8vw, 0.7rem)', color: '#FFD700' }}
      >
        Jour {days}
      </span>
    </div>
  )
}

export function MoodBadge({ mood, className }) {
  if (!mood) return null
  return (
    <span
      className={cn('inline-flex items-center gap-1.5 rounded-pill font-mono', className)}
      style={{
        fontSize:   'clamp(0.58rem, 1.8vw, 0.68rem)',
        padding:    '3px 10px',
        background: `${mood.color}22`,
        border:     `1px solid ${mood.color}55`,
        color:      mood.color,
        maxWidth:   160,
        overflow:   'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
    >
      <span>{mood.emoji}</span>
      {mood.label}
    </span>
  )
}
