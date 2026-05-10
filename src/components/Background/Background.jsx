import StarField from './StarField'
import Particles from './Particles'
import { useAppStore } from '../../store/useAppStore'

export default function Background() {
  const theme = useAppStore(s => s.theme)
  const isDay = theme === 'light'

  return (
    <>
      {/* Deep background gradient */}
      <div
        className="fixed inset-0 transition-all duration-700"
        style={{
          zIndex: -1,
          background: isDay
            ? 'linear-gradient(160deg, #FAF8F5 0%, #EBE6DA 50%, #F5F2ED 100%)'
            : 'radial-gradient(ellipse 80% 60% at 50% 0%, #0D1B4B 0%, #0A0A1A 60%, #050510 100%)',
        }}
      />

      {/* Three.js star field */}
      <StarField />

      {/* Gold / turquoise halo */}
      <div
        className="fixed bottom-0 left-0 right-0 pointer-events-none transition-all duration-700"
        style={{
          zIndex:   2,
          height:   '50vh',
          background: isDay
            ? 'radial-gradient(ellipse 60% 60% at 50% 100%, rgba(201,168,76,0.09) 0%, transparent 70%)'
            : 'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(201,168,76,0.15) 0%, transparent 70%)',
        }}
      />

      {/* Floating particles */}
      <Particles />
    </>
  )
}
