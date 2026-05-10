import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import { useAppStore } from '../../store/useAppStore'

export default function FloatingJar({ onClick, size = 280 }) {
  const mountRef = useRef(null)
  const theme    = useAppStore(s => s.theme)
  const isDay    = theme === 'light'

  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    /* Scene */
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(size, size * 1.2)
    renderer.setClearColor(0x000000, 0)
    el.appendChild(renderer.domElement)

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, size / (size * 1.2), 0.1, 100)
    camera.position.z = 3.5

    /* Jar body — rounded cylinder */
    const jarGeo  = new THREE.CylinderGeometry(0.6, 0.5, 1.4, 32, 1, true)
    const jarMat  = new THREE.MeshPhysicalMaterial({
      color:        isDay ? 0x7EDDD7 : 0xC9A84C,
      emissive:     isDay ? 0x4ECDC4 : 0xC9A84C,
      emissiveIntensity: 0.08,
      transparent:  true,
      opacity:      0.22,
      roughness:    0.05,
      metalness:    0.1,
      transmission: 0.85,
      ior:          1.45,
      thickness:    0.5,
      side:         THREE.DoubleSide,
    })
    const jar = new THREE.Mesh(jarGeo, jarMat)
    scene.add(jar)

    /* Jar bottom */
    const bottomGeo = new THREE.CircleGeometry(0.5, 32)
    const bottom    = new THREE.Mesh(bottomGeo, jarMat)
    bottom.rotation.x = -Math.PI / 2
    bottom.position.y = -0.7
    scene.add(bottom)

    /* Lid */
    const lidGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.15, 32)
    const lidMat = new THREE.MeshStandardMaterial({
      color:     isDay ? 0x4ECDC4 : 0xC9A84C,
      emissive:  isDay ? 0x4ECDC4 : 0xFFD700,
      emissiveIntensity: 0.15,
      metalness: 0.7,
      roughness: 0.2,
    })
    const lid = new THREE.Mesh(lidGeo, lidMat)
    lid.position.y = 0.78
    scene.add(lid)

    /* Glowing sphere inside */
    const glowGeo = new THREE.SphereGeometry(0.22, 16, 16)
    const glowMat = new THREE.MeshBasicMaterial({
      color:       isDay ? 0x7EDDD7 : 0xFFD700,
      transparent: true,
      opacity:     0.7,
    })
    const glow = new THREE.Mesh(glowGeo, glowMat)
    glow.position.y = -0.1
    scene.add(glow)

    /* Floating paper strips inside */
    for (let i = 0; i < 5; i++) {
      const pGeo = new THREE.PlaneGeometry(0.3, 0.15)
      const pMat = new THREE.MeshBasicMaterial({
        color:       0xF5F0E8,
        transparent: true,
        opacity:     0.6,
        side:        THREE.DoubleSide,
      })
      const paper = new THREE.Mesh(pGeo, pMat)
      paper.position.set(
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.8,
        (Math.random() - 0.5) * 0.3
      )
      paper.rotation.z = Math.random() * Math.PI
      scene.add(paper)
    }

    /* Rim glow (PointLight inside) */
    const pointLight = new THREE.PointLight(
      isDay ? 0x4ECDC4 : 0xFFD700,
      2.5,
      3
    )
    pointLight.position.set(0, 0, 0)
    scene.add(pointLight)

    const ambLight = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambLight)

    const dirLight = new THREE.DirectionalLight(0xffffff, 1)
    dirLight.position.set(2, 3, 4)
    scene.add(dirLight)

    /* Animate */
    let t   = 0
    let raf
    const animate = () => {
      raf = requestAnimationFrame(animate)
      t += 0.01
      jar.rotation.y = t * 0.3
      lid.rotation.y = t * 0.3
      jar.position.y = Math.sin(t * 0.8) * 0.08
      lid.position.y = 0.78 + Math.sin(t * 0.8) * 0.08
      glow.scale.setScalar(0.9 + Math.sin(t * 2) * 0.12)
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(raf)
      renderer.dispose()
      el.removeChild(renderer.domElement)
    }
  }, [size, theme, isDay])

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.06 }}
      whileTap={{   scale: 0.94 }}
      className="relative flex items-center justify-center cursor-pointer"
      style={{ width: size, height: size * 1.2 }}
      aria-label="Ouvrir le bocal"
    >
      {/* Outer glow halo */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          boxShadow: isDay
            ? '0 0 80px rgba(78,205,196,0.35), 0 0 160px rgba(78,205,196,0.15)'
            : '0 0 80px rgba(201,168,76,0.30), 0 0 160px rgba(255,215,0,0.10)',
        }}
      />
      {/* Three.js canvas mount */}
      <div ref={mountRef} className="pointer-events-none" />
    </motion.button>
  )
}
