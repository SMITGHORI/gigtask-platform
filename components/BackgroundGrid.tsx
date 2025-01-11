'use client'

import { useRef, useEffect } from 'react'
import * as THREE from 'three'

export default function BackgroundGrid() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })

    renderer.setSize(window.innerWidth, window.innerHeight)
    containerRef.current.appendChild(renderer.domElement)

    const geometry = new THREE.BufferGeometry()
    const material = new THREE.LineBasicMaterial({ color: 0xa3b18a, transparent: true, opacity: 0.3 })

    const gridSize = 20
    const gridStep = 2
    const positions = []

    for (let i = -gridSize; i <= gridSize; i += gridStep) {
      positions.push(-gridSize, 0, i, gridSize, 0, i)
      positions.push(i, 0, -gridSize, i, 0, gridSize)
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    const grid = new THREE.LineSegments(geometry, material)
    scene.add(grid)

    camera.position.z = 15
    camera.position.y = 5
    camera.lookAt(0, 0, 0)

    function animate() {
      requestAnimationFrame(animate)
      grid.rotation.y += 0.001
      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      containerRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={containerRef} className="fixed inset-0 -z-10" />
}

