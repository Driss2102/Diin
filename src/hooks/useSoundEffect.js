/**
 * Synthetic sounds via Web Audio API — aucun fichier audio requis.
 * Lazy init pour respecter la politique autoplay des navigateurs.
 */
import { useCallback } from 'react'
import { useAppStore } from '../store/useAppStore'

let _ctx = null

function ctx() {
  if (!_ctx) {
    _ctx = new (window.AudioContext || window.webkitAudioContext)()
  }
  if (_ctx.state === 'suspended') _ctx.resume()
  return _ctx
}

/* ── Synthèses ────────────────────────────────────────── */

function playJarOpen() {
  const c = ctx()
  // Sweep ascendant doux → son d'ouverture
  const osc  = c.createOscillator()
  const gain = c.createGain()
  osc.type = 'sine'
  osc.connect(gain); gain.connect(c.destination)
  osc.frequency.setValueAtTime(180, c.currentTime)
  osc.frequency.exponentialRampToValueAtTime(900, c.currentTime + 0.5)
  gain.gain.setValueAtTime(0.22, c.currentTime)
  gain.gain.setValueAtTime(0.22, c.currentTime + 0.35)
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.7)
  osc.start(c.currentTime); osc.stop(c.currentTime + 0.7)

  // Harmonique légère
  const osc2  = c.createOscillator()
  const gain2 = c.createGain()
  osc2.type = 'triangle'
  osc2.connect(gain2); gain2.connect(c.destination)
  osc2.frequency.setValueAtTime(360, c.currentTime + 0.1)
  osc2.frequency.exponentialRampToValueAtTime(1800, c.currentTime + 0.55)
  gain2.gain.setValueAtTime(0.08, c.currentTime + 0.1)
  gain2.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.65)
  osc2.start(c.currentTime + 0.1); osc2.stop(c.currentTime + 0.65)
}

function playPaper() {
  const c = ctx()
  // Bruit blanc court filtré → froissement papier
  const frames = Math.floor(c.sampleRate * 0.18)
  const buf    = c.createBuffer(1, frames, c.sampleRate)
  const data   = buf.getChannelData(0)
  for (let i = 0; i < frames; i++) data[i] = (Math.random() * 2 - 1)

  const src    = c.createBufferSource()
  const filter = c.createBiquadFilter()
  const gain   = c.createGain()
  filter.type  = 'bandpass'; filter.frequency.value = 4000; filter.Q.value = 0.8
  src.buffer   = buf
  src.connect(filter); filter.connect(gain); gain.connect(c.destination)
  gain.gain.setValueAtTime(0.18, c.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.18)
  src.start()
}

function playSelect() {
  const c = ctx()
  // Click mélodique court
  const osc  = c.createOscillator()
  const gain = c.createGain()
  osc.type = 'triangle'
  osc.connect(gain); gain.connect(c.destination)
  osc.frequency.setValueAtTime(880, c.currentTime)
  osc.frequency.exponentialRampToValueAtTime(440, c.currentTime + 0.06)
  gain.gain.setValueAtTime(0.18, c.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.12)
  osc.start(c.currentTime); osc.stop(c.currentTime + 0.12)
}

function playFavorite() {
  const c = ctx()
  // Accord montant : tierce majeure
  ;[523.25, 659.26, 783.99, 1046.5].forEach((freq, i) => {
    const osc  = c.createOscillator()
    const gain = c.createGain()
    osc.type = 'sine'
    osc.connect(gain); gain.connect(c.destination)
    osc.frequency.value = freq
    const t = c.currentTime + i * 0.075
    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(0.13, t + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.55)
    osc.start(t); osc.stop(t + 0.6)
  })
}

/* ── Hook ─────────────────────────────────────────────── */

const SYNTHS = {
  jar_open: playJarOpen,
  paper:    playPaper,
  select:   playSelect,
  favorite: playFavorite,
}

export function useSoundEffect() {
  const soundEnabled = useAppStore(s => s.soundEnabled)

  const play = useCallback((key) => {
    if (!soundEnabled) return
    try { SYNTHS[key]?.() } catch (_) {}
  }, [soundEnabled])

  // Ambient: silence — peut être remplacé ultérieurement
  const startAmbient = useCallback(() => {}, [])
  const stopAmbient  = useCallback(() => {}, [])

  return { play, startAmbient, stopAmbient }
}
