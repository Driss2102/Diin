/**
 * MandalaDrawing — SVG islamique qui se trace trait par trait
 * Chaque dhikr a sa propre géométrie (n-fold symmetry) :
 *   subhanallah    → 6 pétales (hexagonal)
 *   alhamdulillah  → 8 pétales (octagonal)
 *   allahuakbar    → 4 pétales (carré/diamant)
 *   lailaha        → 5 pétales (pentagramme)
 *   astaghfirullah → 3 pétales (triangulaire)
 */
import { motion, AnimatePresence } from 'framer-motion'

/* ─── Rayons ─────────────────────────────────────────── */
const R = { r1: 14, r2: 34, r3: 56, r4: 72, r5: 82 }

/* ─── Config par dhikr ───────────────────────────────── */
const CONFIGS = {
  subhanallah:    { n: 6, petalOff: 0,  starOff: 0,    pw: 10 },
  alhamdulillah:  { n: 8, petalOff: 0,  starOff: 22.5, pw: 7  },
  allahuakbar:    { n: 4, petalOff: 45, starOff: 45,   pw: 13 },
  lailaha:        { n: 5, petalOff: 0,  starOff: 0,    pw: 11 },
  astaghfirullah: { n: 3, petalOff: 30, starOff: 0,    pw: 16 },
  custom:         { n: 6, petalOff: 0,  starOff: 0,    pw: 10 },
}

/* ─── Helpers géométriques ───────────────────────────── */

/** N points réguliers à rayon r, démarrant à deg0 */
function polyPoints(n, r, deg0 = -90) {
  return Array.from({ length: n }, (_, k) => {
    const a = ((deg0 + k * 360 / n) * Math.PI) / 180
    return [+(r * Math.cos(a)).toFixed(2), +(r * Math.sin(a)).toFixed(2)]
  })
}

/** Chemin fermé reliant les indices donnés */
function polyPath(pts, ids) {
  const p = ids.map(i => pts[i])
  return 'M ' + p.map(([x, y]) => `${x} ${y}`).join(' L ') + ' Z'
}

/** Étoile adaptée au n-fold */
function starPaths(n, r, off = 0) {
  const pts = polyPoints(n, r, -90 + off)
  if (n === 3) return [polyPath(pts, [0, 1, 2])]
  if (n === 4) return [polyPath(pts, [0, 1, 2, 3])]
  if (n === 5) return [polyPath(pts, [0, 2, 4, 1, 3])]      // pentagramme
  if (n === 6) return [polyPath(pts, [0, 2, 4]), polyPath(pts, [1, 3, 5])] // hexagramme
  if (n === 8) return [polyPath(pts, [0, 2, 4, 6]), polyPath(pts, [1, 3, 5, 7])] // octagramme
  return [polyPath(pts, Array.from({ length: n }, (_, i) => i))]
}

/** N angles de rotation pour les pétales */
function nAngles(n, off = 0) {
  return Array.from({ length: n }, (_, k) => off + k * 360 / n)
}

/** Pétale pointant vers le haut, de r1 à r2, largeur pw */
const petal = (r1, r2, pw) =>
  `M 0 ${-r1} Q ${-pw} ${-(r1 + r2) / 2} 0 ${-r2} Q ${pw} ${-(r1 + r2) / 2} 0 ${-r1} Z`

/* ─── Éléments animés ────────────────────────────────── */

function ACircle({ r, visible, delay = 0, dur = 1.5, stroke, sw = 1.4 }) {
  return (
    <motion.circle
      cx={0} cy={0} r={r}
      fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={visible ? { pathLength: 1, opacity: 1 } : {}}
      transition={{ duration: dur, delay, ease: [0.22, 1, 0.36, 1] }}
    />
  )
}

function APath({ d, visible, delay = 0, dur = 1.2, stroke, sw = 1.4, fill = 'none' }) {
  return (
    <motion.path
      d={d} fill={fill} stroke={stroke} strokeWidth={sw}
      strokeLinecap="round" strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={visible ? { pathLength: 1, opacity: 1 } : {}}
      transition={{ duration: dur, delay, ease: [0.22, 1, 0.36, 1] }}
    />
  )
}

function Ripple({ pulse, color }) {
  return (
    <AnimatePresence>
      <motion.circle
        key={pulse} cx={0} cy={0} r={8}
        fill="none" stroke={color} strokeWidth={1.5}
        initial={{ scale: 0.5, opacity: 0.9 }}
        animate={{ scale: 9, opacity: 0 }}
        exit={{}}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      />
    </AnimatePresence>
  )
}

/* ─── MANDALA PRINCIPAL ──────────────────────────────── */
export default function MandalaDrawing({
  count = 0,
  color = '#C9A84C',
  pulse = 0,
  size  = 300,
  variant = 'subhanallah',
}) {
  const c   = count
  const cfg = CONFIGS[variant] || CONFIGS.subhanallah
  const { n, petalOff, starOff, pw } = cfg

  const pct      = Math.min(c, 100) / 100
  const sw       = 1 + pct * 1.0
  const fo       = Math.round((0.06 + pct * 0.14) * 255).toString(16).padStart(2, '0')
  const fill     = `${color}${fo}`
  const glow     = c >= 100

  /* Pétales */
  const p_inner  = petal(R.r1, R.r2, pw)
  const p_center = petal(0, R.r1, pw * 0.5)
  const p_outer  = petal(R.r2, R.r3, pw * 0.9)

  /* Angles */
  const mainA   = nAngles(n, petalOff)
  const halfA   = nAngles(n, petalOff + 360 / (2 * n))

  /* Étoile adaptée */
  const sPaths  = starPaths(n, R.r2, starOff)

  /* Points décoratifs (2×n) */
  const dotPts  = polyPoints(n * 2, R.r4, petalOff - 90)

  return (
    <svg
      viewBox="-92 -92 184 184"
      width={size}
      height={size}
      style={{ overflow: 'visible', cursor: 'pointer' }}
    >
      <defs>
        {glow && (
          <filter id="mand-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
      </defs>

      <g filter={glow ? 'url(#mand-glow)' : undefined}>

        {/* ── Point central ── */}
        <motion.circle
          cx={0} cy={0} r={c >= 1 ? 4.5 : 0} fill={color}
          initial={false}
          animate={{ r: c >= 1 ? 4.5 : 0, opacity: c >= 1 ? 1 : 0, scale: c >= 1 ? [1, 1.3, 1] : 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* ── Anneau intérieur ── */}
        <ACircle r={R.r1} visible={c >= 3}  delay={0}   dur={1.4} stroke={color} sw={sw} />

        {/* ── N pétales intérieures ── */}
        {mainA.map((angle, i) => (
          <g key={`mi-${angle}`} transform={`rotate(${angle})`}>
            <APath d={p_inner} visible={c >= 8}  delay={i * 0.08} stroke={color} fill={fill} sw={sw * 0.85} />
          </g>
        ))}

        {/* ── Anneau intermédiaire ── */}
        <ACircle r={R.r2} visible={c >= 15} delay={0.1} dur={1.6} stroke={color} sw={sw} />

        {/* ── N mini-pétales centraux (décalage) ── */}
        {halfA.map((angle, i) => (
          <g key={`mc-${angle}`} transform={`rotate(${angle})`}>
            <APath d={p_center} visible={c >= 25} delay={i * 0.07} stroke={color} fill={fill} sw={sw * 0.7} />
          </g>
        ))}

        {/* ── N pétales extérieures (décalage) ── */}
        {halfA.map((angle, i) => (
          <g key={`mo-${angle}`} transform={`rotate(${angle})`}>
            <APath d={p_outer} visible={c >= 33} delay={i * 0.1}  stroke={color} fill={fill} sw={sw * 0.9} />
          </g>
        ))}

        {/* ── Anneau extérieur ── */}
        <ACircle r={R.r3} visible={c >= 50} delay={0.2} dur={1.7} stroke={color} sw={sw} />

        {/* ── Étoile n-fold ── */}
        {sPaths.map((d, i) => (
          <APath key={`star-${i}`} d={d} visible={c >= 65} delay={i * 0.35} stroke={color} fill={`${color}12`} sw={sw * 0.75} />
        ))}

        {/* ── Anneau lointain + dots ── */}
        <ACircle r={R.r4} visible={c >= 80} delay={0.1} dur={1.5} stroke={color} sw={sw * 0.7} />
        {dotPts.map(([x, y], i) => (
          <motion.circle
            key={`dot-${i}`} cx={x} cy={y} r={2.2} fill={color}
            initial={{ scale: 0, opacity: 0 }}
            animate={c >= 80 ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.35, delay: 0.2 + i * 0.04 }}
          />
        ))}

        {/* ── Anneau de bord ── */}
        <ACircle r={R.r5} visible={c >= 95} delay={0.1} dur={1.4} stroke={color} sw={sw * 0.55} />

        {/* ── Éclat complet à 100 ── */}
        {glow && (
          <motion.circle
            cx={0} cy={0} r={R.r5 + 6}
            fill="none" stroke={color} strokeWidth={2.5}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: [0, 0.9, 0.5], scale: 1 }}
            transition={{ duration: 1.2, times: [0, 0.25, 1] }}
          />
        )}

        {/* ── Ripple au tap ── */}
        <Ripple pulse={pulse} color={color} />

      </g>
      {/* Pas de compteur à l'intérieur du dessin */}
    </svg>
  )
}
