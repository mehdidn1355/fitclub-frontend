import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, ContactShadows, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import Particles from './Particles'

function Dumbbell({ position = [0, 0, 0], scale = 1, color = '#c5f36b' }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.004
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.12
      meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.3) * 0.08
    }
  })

  return (
    <group ref={meshRef} position={position} scale={scale}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.15, 0.15, 3, 32]} />
        <meshStandardMaterial color="#333" metalness={0.95} roughness={0.05} />
      </mesh>

      <mesh position={[-1.2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 0.6, 0.4, 32]} />
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.3} emissive={color} emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[-1.5, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.2, 32]} />
        <meshStandardMaterial color="#222" metalness={0.9} roughness={0.1} />
      </mesh>

      <mesh position={[1.2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 0.6, 0.4, 32]} />
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.3} emissive={color} emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[1.5, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.2, 32]} />
        <meshStandardMaterial color="#222" metalness={0.9} roughness={0.1} />
      </mesh>

      <mesh position={[0.5, 0, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.6, 32]} />
        <meshStandardMaterial color="#555" metalness={0.7} roughness={0.2} />
      </mesh>
      <mesh position={[-0.5, 0, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.6, 32]} />
        <meshStandardMaterial color="#555" metalness={0.7} roughness={0.2} />
      </mesh>
    </group>
  )
}

export default function CinematicHero() {
  return (
    <div className="hero-3d-canvas">
      <Canvas
        shadows
        camera={{ position: [0, 0.5, 8], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.25} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={1.5}
            castShadow
            shadow-mapSize={[1024, 1024]}
            color="#ffffff"
          />
          <pointLight position={[-3, 2, -2]} intensity={0.6} color="#c5f36b" />
          <pointLight position={[0, 5, -5]} intensity={0.8} color="#c5f36b" />
          <spotLight position={[0, 8, 0]} angle={0.5} intensity={1} color="#c5f36b" penumbra={1} />

          <Environment preset="city" />

          <ContactShadows position={[0, -2, 0]} opacity={0.5} blur={2.5} far={4} color="#000000" />

          <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.9}>
            <Dumbbell position={[0, 0, 0]} scale={1.1} color="#c5f36b" />
          </Float>

          <Particles count={200} color="#c5f36b" />

          <EffectComposer>
            <Bloom intensity={0.8} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur />
            <Vignette eskil={false} offset={0.1} darkness={0.7} />
          </EffectComposer>
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.6}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  )
}