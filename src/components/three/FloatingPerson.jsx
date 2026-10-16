import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, ContactShadows, Environment } from '@react-three/drei'

function Person() {
  const groupRef = useRef()
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.5
    }
  })

  return (
    <group ref={groupRef}>
      <mesh position={[0, 1.6, 0]} castShadow>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial color="#c5f36b" metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.4, 0]} castShadow>
        <capsuleGeometry args={[0.45, 1.2, 8, 16]} />
        <meshStandardMaterial color="#a6e04a" metalness={0.3} roughness={0.5} />
      </mesh>
      <mesh position={[-0.7, 0.8, 0]} rotation={[0, 0, 0.3]} castShadow>
        <capsuleGeometry args={[0.15, 0.9, 4, 12]} />
        <meshStandardMaterial color="#c5f36b" metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[0.7, 0.8, 0]} rotation={[0, 0, -0.3]} castShadow>
        <capsuleGeometry args={[0.15, 0.9, 4, 12]} />
        <meshStandardMaterial color="#c5f36b" metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[-0.25, -0.7, 0]} castShadow>
        <capsuleGeometry args={[0.18, 1, 4, 12]} />
        <meshStandardMaterial color="#7a9a3a" metalness={0.3} roughness={0.5} />
      </mesh>
      <mesh position={[0.25, -0.7, 0]} castShadow>
        <capsuleGeometry args={[0.18, 1, 4, 12]} />
        <meshStandardMaterial color="#7a9a3a" metalness={0.3} roughness={0.5} />
      </mesh>
    </group>
  )
}

export default function FloatingPerson() {
  return (
    <div className="hero-3d-canvas">
      <Canvas shadows camera={{ position: [0, 0.5, 6], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
          <pointLight position={[-3, 2, 2]} intensity={0.5} color="#c5f36b" />
          <Environment preset="city" />
          <ContactShadows position={[0, -2, 0]} opacity={0.4} blur={2} />
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.8}>
            <Person />
          </Float>
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.8} />
      </Canvas>
    </div>
  )
}