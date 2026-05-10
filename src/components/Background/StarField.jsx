import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useAppStore } from '../../store/useAppStore'

export default function StarField() {
  const canvasRef = useRef(null)
  const theme = useAppStore(s => s.theme)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 1

    /* Stars */
    const count    = 1200
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    const sizes     = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 10
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5
      sizes[i] = Math.random() * 2.5 + 0.5
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('size',     new THREE.BufferAttribute(sizes, 1))

    const isDay  = theme === 'light'
    const color  = isDay ? new THREE.Color('#4ECDC4') : new THREE.Color('#F5F0E8')
    const alpha  = isDay ? 0.35 : 0.85

    const material = new THREE.PointsMaterial({
      color,
      size:        0.012,
      sizeAttenuation: true,
      transparent: true,
      opacity:     alpha,
    })

    const stars = new THREE.Points(geometry, material)
    scene.add(stars)

    /* Mouse parallax */
    let mouseX = 0, mouseY = 0
    const onMouse = (e) => {
      mouseX = (e.clientX / window.innerWidth  - 0.5) * 0.3
      mouseY = (e.clientY / window.innerHeight - 0.5) * 0.3
    }
    window.addEventListener('mousemove', onMouse, { passive: true })

    /* Resize */
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    /* Animate */
    let raf
    const animate = () => {
      raf = requestAnimationFrame(animate)
      stars.rotation.y += 0.0003
      stars.rotation.x += 0.0001
      camera.position.x += (mouseX - camera.position.x) * 0.03
      camera.position.y += (-mouseY - camera.position.y) * 0.03
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
    }
  }, [theme])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0, opacity: theme === 'light' ? 0.4 : 0.9 }}
    />
  )
}
