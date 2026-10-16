import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import Particles from './Particles'

function Globe() {
  const globeRef = useRef()
  const ring1Ref = useRef()
  const ring2Ref = useRef()

  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y = state.clock.elapsedTime * 0.25
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = state.clock.elapsedTime * 0.35
      ring1Ref.current.rotation.x = Math.PI / 3 + Math.sin(state.clock.elapsedTime * 0.2) * 0.15
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = state.clock.elapsedTime * 0.25
      ring2Ref.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.3) * 0.3
    }
  })

  return (
    <group scale={0.85}>
      <mesh ref={globeRef} castShadow>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial
          color="#2a3a1a"
          metalness={0.4}
          roughness={0.5}
          emissive="#c5f36b"
          emissiveIntensity={0.3}
        />
      </mesh>

      <mesh ref={ring1Ref} castShadow>
        <torusGeometry args={[2, 0.05, 16, 100]} />
        <meshStandardMaterial color="#c5f36b" metalness={0.95} roughness={0.05} emissive="#c5f36b" emissiveIntensity={0.5} />
      </mesh>

      <mesh ref={ring2Ref} castShadow>
        <torusGeometry args={[2.2, 0.03, 16, 100]} />
        <meshStandardMaterial color="#c5f36b" metalness={0.95} roughness={0.05} emissive="#c5f36b" emissiveIntensity={0.4} transparent opacity={0.7} />
      </mesh>
    </group>
  )
}

export default function CinematicGlobe() {
  return (
    <div className="hero-3d-canvas">
      <Canvas
        shadows
        camera={{ position: [0, 0, 6.5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 5, 5]} intensity={1.3} castShadow />
          <pointLight position={[-3, 2, 2]} intensity={0.7} color="#c5f36b" />
          <pointLight position={[3, -2, 2]} intensity={0.5} color="#a6e04a" />

          <Environment preset="city" />

          <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.6}>
            <Globe />
          </Float>

          <Particles count={220} color="#c5f36b" />

          <EffectComposer>
            <Bloom intensity={0.8} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur />
            <Vignette eskil={false} offset={0.1} darkness={0.7} />
          </EffectComposer>
        </Suspense>

        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  )
}