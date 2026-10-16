import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, ContactShadows, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import Particles from './Particles'

function PlayButton() {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.15
    }
  })

  return (
    <group ref={groupRef}>
      {/* دایره اصلی */}
      <mesh castShadow>
        <torusGeometry args={[1.4, 0.15, 24, 64]} />
        <meshStandardMaterial
          color="#c5f36b"
          metalness={0.7}
          roughness={0.15}
          emissive="#c5f36b"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* مثلث پلی (وسط) */}
      <mesh position={[0.1, 0, 0.05]} rotation={[0, 0, -Math.PI / 2]} castShadow>
        <coneGeometry args={[0.55, 0.9, 3]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.3}
          roughness={0.3}
          emissive="#c5f36b"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* حلقه دوم */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[1.75, 0.04, 16, 100]} />
        <meshStandardMaterial
          color="#c5f36b"
          metalness={0.9}
          roughness={0.1}
          emissive="#c5f36b"
          emissiveIntensity={0.4}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* ذرات کوچک دور */}
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 2.2, 0, Math.sin(angle) * 2.2]}
            castShadow
          >
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial
              color="#c5f36b"
              emissive="#c5f36b"
              emissiveIntensity={1}
            />
          </mesh>
        )
      })}
    </group>
  )
}

export default function CinematicCourses() {
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

          <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.9}>
            <PlayButton />
          </Float>

          <Particles count={250} color="#c5f36b" />

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