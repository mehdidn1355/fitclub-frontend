import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, ContactShadows, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import Particles from './Particles'

function Lock() {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.6
    }
  })

  return (
    <group ref={groupRef}>
      <mesh castShadow>
        <boxGeometry args={[1.5, 1.5, 0.5]} />
        <meshStandardMaterial color="#c5f36b" metalness={0.8} roughness={0.15} emissive="#c5f36b" emissiveIntensity={0.25} />
      </mesh>

      <mesh position={[0, 1.1, 0]} castShadow>
        <torusGeometry args={[0.6, 0.12, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#333" metalness={0.95} roughness={0.05} />
      </mesh>

      <mesh position={[0, 0, 0.3]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.3, 16]} />
        <meshStandardMaterial color="#10110f" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0, -0.25, 0.3]} castShadow>
        <boxGeometry args={[0.1, 0.3, 0.3]} />
        <meshStandardMaterial color="#10110f" metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  )
}

export default function CinematicLock() {
  return (
    <div className="hero-3d-canvas">
      <Canvas
        shadows
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 5, 5]} intensity={1.4} castShadow />
          <pointLight position={[-3, 2, 2]} intensity={0.7} color="#c5f36b" />
          <pointLight position={[3, -2, -2]} intensity={0.4} color="#a6e04a" />

          <Environment preset="city" />
          <ContactShadows position={[0, -2, 0]} opacity={0.5} blur={2.5} />

          <Float speed={1.8} rotationIntensity={0.4} floatIntensity={1}>
            <Lock />
          </Float>

          <Particles count={180} color="#c5f36b" />

          <EffectComposer>
            <Bloom intensity={0.9} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur />
            <Vignette eskil={false} offset={0.1} darkness={0.7} />
          </EffectComposer>
        </Suspense>

        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  )
}