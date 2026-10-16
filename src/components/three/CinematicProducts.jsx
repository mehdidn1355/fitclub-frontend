import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, ContactShadows, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import Particles from './Particles'

function Dumbbell() {
  return (
    <group>
      <mesh castShadow>
        <cylinderGeometry args={[0.1, 0.1, 2, 16]} />
        <meshStandardMaterial color="#333" metalness={0.95} roughness={0.05} />
      </mesh>
      <mesh position={[-0.8, 0, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 24]} />
        <meshStandardMaterial color="#c5f36b" metalness={0.5} roughness={0.3} emissive="#c5f36b" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0.8, 0, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 24]} />
        <meshStandardMaterial color="#c5f36b" metalness={0.5} roughness={0.3} emissive="#c5f36b" emissiveIntensity={0.2} />
      </mesh>
    </group>
  )
}

function Kettlebell() {
  return (
    <group>
      <mesh castShadow>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial color="#a6e04a" metalness={0.5} roughness={0.3} emissive="#a6e04a" emissiveIntensity={0.15} />
      </mesh>
      <mesh position={[0, 0.85, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.55, 0.35, 32]} />
        <meshStandardMaterial color="#a6e04a" metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.4, 0]} castShadow>
        <torusGeometry args={[0.55, 0.12, 16, 32]} />
        <meshStandardMaterial color="#222" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  )
}

function WaterBottle() {
  return (
    <group>
      <mesh castShadow>
        <cylinderGeometry args={[0.4, 0.4, 1.5, 32]} />
        <meshStandardMaterial color="#7a9a3a" metalness={0.3} roughness={0.2} emissive="#7a9a3a" emissiveIntensity={0.1} />
      </mesh>
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.3, 24]} />
        <meshStandardMaterial color="#333" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  )
}

function RotatingGroup() {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.35
    }
  })

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
        <group position={[0, 0, 2.5]}><Dumbbell /></group>
      </Float>
      <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.8}>
        <group position={[-2.2, 0, -1.5]}><Kettlebell /></group>
      </Float>
      <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.8}>
        <group position={[2.2, 0, -1.5]}><WaterBottle /></group>
      </Float>
    </group>
  )
}

export default function CinematicProducts() {
  return (
    <div className="hero-3d-canvas">
      <Canvas
        shadows
        camera={{ position: [0, 2.5, 8], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 5, 5]} intensity={1.3} castShadow shadow-mapSize={[1024, 1024]} />
          <pointLight position={[-3, 2, 2]} intensity={0.6} color="#c5f36b" />
          <pointLight position={[3, 2, -2]} intensity={0.6} color="#a6e04a" />

          <Environment preset="city" />
          <ContactShadows position={[0, -2, 0]} opacity={0.5} blur={2.5} />

          <RotatingGroup />
          <Particles count={250} color="#c5f36b" />

          <EffectComposer>
            <Bloom intensity={0.7} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur />
            <Vignette eskil={false} offset={0.1} darkness={0.65} />
          </EffectComposer>
        </Suspense>

        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} />
      </Canvas>
    </div>
  )
}