import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Particles({ count = 220 }) {
  const ref = useRef()
  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6
      speeds[i] = 0.08 + Math.random() * 0.22
    }
    return { positions, speeds }
  }, [count])

  useFrame((state, dt) => {
    const geo = ref.current.geometry
    const arr = geo.attributes.position.array
    const t = state.clock.elapsedTime
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += speeds[i] * dt
      arr[i * 3] += Math.sin(t * 0.4 + i) * 0.0015
      if (arr[i * 3 + 1] > 5) arr[i * 3 + 1] = -5
    }
    geo.attributes.position.needsUpdate = true
    ref.current.rotation.y = state.pointer.x * 0.08
    ref.current.rotation.x = -state.pointer.y * 0.05
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#f9962a"
        size={0.035}
        sizeAttenuation
        transparent
        opacity={0.55}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export default function Embers() {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null
  return (
    <div className="pointer-events-none fixed inset-0 z-[5]" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 6], fov: 55 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: false }}>
        <Particles />
      </Canvas>
    </div>
  )
}
