import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, ContactShadows, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import Particles from './Particles'

function Crystal() {
  const groupRef = useRef()
  const innerRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.4
    }
    if (innerRef.current) {
      innerRef.current.rotation.y = -state.clock.elapsedTime * 0.8
      innerRef.current.rotation.x = state.clock.elapsedTime * 0.3
    }
  })

  return (
    <group ref={groupRef}>
      {/* کریستال اصلی (Octahedron) */}
      <mesh castShadow>
        <octahedronGeometry args={[1.3, 0]} />
        <meshStandardMaterial
          color="#c5f36b"
          metalness={0.9}
          roughness={0.05}
          emissive="#c5f36b"
          emissiveIntensity={0.4}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* کریستال داخلی */}
      <mesh ref={innerRef} scale={0.6}>
        <octahedronGeometry args={[1.3, 0]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.3}
          roughness={0.1}
          emissive="#c5f36b"
          emissiveIntensity={1.2}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* حلقه دور کریستال */}
      <mesh rotation={[Math.PI / 2.5, 0, 0]} castShadow>
        <torusGeometry args={[2, 0.04, 16, 100]} />
        <meshStandardMaterial
          color="#c5f36b"
          metalness={0.95}
          roughness={0.05}
          emissive="#c5f36b"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* ستاره‌های دور */}
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 2.4, 0.5, Math.sin(angle) * 2.4]}
            castShadow
          >
            <octahedronGeometry args={[0.12, 0]} />
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

export default function CinematicAdmin() {
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
          <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]} />
          <pointLight position={[-3, 2, 2]} intensity={0.8} color="#c5f36b" />
          <pointLight position={[3, -2, -2]} intensity={0.6} color="#a6e04a" />

          <Environment preset="city" />
          <ContactShadows position={[0, -2, 0]} opacity={0.5} blur={2.5} />

          <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.9}>
            <Crystal />
          </Float>

          <Particles count={280} color="#c5f36b" />

          <EffectComposer>
            <Bloom intensity={1.1} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur />
            <Vignette eskil={false} offset={0.1} darkness={0.7} />
          </EffectComposer>
        </Suspense>

        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.4} />
      </Canvas>
    </div>
  )
}