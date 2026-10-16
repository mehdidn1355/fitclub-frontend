import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, ContactShadows, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import Particles from './Particles'

function Trophy() {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.4
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      {/* کاپ */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.7, 0.5, 1.2, 32]} />
        <meshStandardMaterial
          color="#c5f36b"
          metalness={0.9}
          roughness={0.15}
          emissive="#c5f36b"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* لبه‌ی کاپ */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <torusGeometry args={[0.7, 0.08, 16, 32]} />
        <meshStandardMaterial color="#a6e04a" metalness={0.95} roughness={0.05} />
      </mesh>

      {/* دسته‌ها */}
      <mesh position={[-0.75, 0.3, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow>
        <torusGeometry args={[0.3, 0.08, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#c5f36b" metalness={0.9} roughness={0.15} />
      </mesh>
      <mesh position={[0.75, 0.3, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
        <torusGeometry args={[0.3, 0.08, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#c5f36b" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* ستون */}
      <mesh position={[0, -0.6, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.3, 0.6, 32]} />
        <meshStandardMaterial color="#7a9a3a" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* پایه */}
      <mesh position={[0, -1.05, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.55, 0.25, 32]} />
        <meshStandardMaterial color="#333" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* ستاره بالای کاپ */}
      {[...Array(5)].map((_, i) => {
        const angle = (i / 5) * Math.PI * 2
        const radius = 1.8
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * radius, 0.3, Math.sin(angle) * radius]}
            castShadow
          >
            <octahedronGeometry args={[0.15, 0]} />
            <meshStandardMaterial
              color="#c5f36b"
              emissive="#c5f36b"
              emissiveIntensity={1.5}
            />
          </mesh>
        )
      })}
    </group>
  )
}

export default function CinematicTrainerPanel() {
  return (
    <div className="hero-3d-canvas">
      <Canvas
        shadows
        camera={{ position: [0, 0.5, 7], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={1.4}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <pointLight position={[-3, 2, 2]} intensity={0.7} color="#c5f36b" />
          <pointLight position={[3, -2, -2]} intensity={0.5} color="#a6e04a" />

          <Environment preset="city" />
          <ContactShadows position={[0, -2, 0]} opacity={0.5} blur={2.5} />

          <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
            <Trophy />
          </Float>

          <Particles count={220} color="#c5f36b" />

          <EffectComposer>
            <Bloom intensity={0.9} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur />
            <Vignette eskil={false} offset={0.1} darkness={0.7} />
          </EffectComposer>
        </Suspense>

        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  )
}