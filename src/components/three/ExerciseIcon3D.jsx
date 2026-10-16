import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Environment } from '@react-three/drei'

function ExerciseModel({ type = 'default' }) {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.6
    }
  })

  const colors = {
    سینه: '#ef4444',
    پشت: '#22d3ee',
    پا: '#4ade80',
    سرشانه: '#fbbf24',
    بازو: '#c5f36b',
    شکم: '#a855f7',
    default: '#c5f36b',
  }
  const color = colors[type] || colors.default

  return (
    <group ref={groupRef}>
      <mesh castShadow>
        <icosahedronGeometry args={[0.7, 1]} />
        <meshStandardMaterial
          color={color}
          metalness={0.8}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={0.4}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1, 0.05, 16, 60]} />
        <meshStandardMaterial
          color={color}
          metalness={0.9}
          roughness={0.1}
          emissive={color}
          emissiveIntensity={0.6}
        />
      </mesh>

      <mesh rotation={[0, Math.PI / 3, Math.PI / 4]}>
        <torusGeometry args={[1.2, 0.03, 16, 60]} />
        <meshStandardMaterial
          color={color}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  )
}

export default function ExerciseIcon3D({ muscleGroup = 'default', size = 60 }) {
  return (
    <div
      className="exercise-icon-3d"
      style={{ width: size, height: size }}
    >
      <Canvas
        camera={{ position: [0, 0, 3], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} />
          <pointLight position={[-3, 2, 2]} intensity={0.5} color="#c5f36b" />
          <Environment preset="city" />
          <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
            <ExerciseModel type={muscleGroup} />
          </Float>
        </Suspense>
      </Canvas>
    </div>
  )
}