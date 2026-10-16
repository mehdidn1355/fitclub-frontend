import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, Environment } from '@react-three/drei'

function Globe() {
  const globeRef = useRef()
  const ringRef = useRef()

  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.3
      ringRef.current.rotation.x = Math.PI / 3 + Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
  })

  return (
    <group>
      <mesh ref={globeRef} castShadow>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial
          color="#2a3a1a"
          metalness={0.3}
          roughness={0.6}
          emissive="#c5f36b"
          emissiveIntensity={0.1}
        />
      </mesh>
      <mesh ref={ringRef} castShadow>
        <torusGeometry args={[2, 0.05, 16, 100]} />
        <meshStandardMaterial color="#c5f36b" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[2.2, 0.03, 16, 100]} />
        <meshStandardMaterial color="#c5f36b" metalness={0.9} roughness={0.1} opacity={0.5} transparent />
      </mesh>
    </group>
  )
}

export default function FloatingGlobe() {
  return (
    <div className="hero-3d-canvas">
      <Canvas shadows camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
          <pointLight position={[-3, 2, 2]} intensity={0.5} color="#c5f36b" />
          <Environment preset="city" />
          <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.5}>
            <Globe />
          </Float>
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  )
}