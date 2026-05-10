import { useEffect, useRef } from 'react'

export function useParallax(strength = 0.02) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onMove = (e) => {
      const cx = window.innerWidth  / 2
      const cy = window.innerHeight / 2
      const dx = (e.clientX - cx) * strength
      const dy = (e.clientY - cy) * strength
      el.style.transform = `translate(${dx}px, ${dy}px)`
    }

    /* Gyroscope on mobile */
    const onOrientation = (e) => {
      const dx = (e.gamma || 0) * strength * 2
      const dy = (e.beta  || 0) * strength * 2
      if (el) el.style.transform = `translate(${dx}px, ${dy}px)`
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('deviceorientation', onOrientation, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('deviceorientation', onOrientation)
    }
  }, [strength])

  return ref
}
