
import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, OrbitControls } from '@react-three/drei'

function Dumbbell() {
  const groupRef = useRef(null)

  // چرخش آرام دمبل در حالت عادی
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25
      groupRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 1.2) * 0.12
    }
  })

  return (
    <group
  ref={groupRef}
  rotation={[0.5, 0, -0.35]}
  scale={1.25}
>
      {/* میله مرکزی دمبل */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.09, 0.09, 1.7, 32]} />
        <meshStandardMaterial
          color="#c5c5c5"
          metalness={0.9}
          roughness={0.25}
        />
      </mesh>

      {/* وزنه سمت چپ */}
      <mesh position={[-0.85, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.58, 0.58, 0.25, 48]} />
        <meshStandardMaterial
          color="#242820"
          metalness={0.65}
          roughness={0.3}
        />
      </mesh>

      {/* حلقه سبز روی وزنه چپ */}
      <mesh position={[-1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.43, 0.43, 0.035, 48]} />
        <meshStandardMaterial
          color="#c5f36b"
          metalness={0.5}
          roughness={0.25}
          emissive="#536c27"
          emissiveIntensity={0.35}
        />
      </mesh>

      {/* وزنه سمت راست */}
      <mesh position={[0.85, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.58, 0.58, 0.25, 48]} />
        <meshStandardMaterial
          color="#242820"
          metalness={0.65}
          roughness={0.3}
        />
      </mesh>

      {/* حلقه سبز روی وزنه راست */}
      <mesh position={[1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.43, 0.43, 0.035, 48]} />
        <meshStandardMaterial
          color="#c5f36b"
          metalness={0.5}
          roughness={0.25}
          emissive="#536c27"
          emissiveIntensity={0.35}
        />
      </mesh>
    </group>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={1.4} />

      <directionalLight
        position={[4, 5, 5]}
        intensity={3}
      />

      <pointLight
        position={[-4, 1, -3]}
        color="#c5f36b"
        intensity={35}
      />

      <Dumbbell />

      <ContactShadows
        position={[0, -1.15, 0]}
        opacity={0.45}
        scale={5}
        blur={2}
      />
    </>
  )
}

export default function ThreeDShowcase() {
  return (
    <div className="three-d-showcase">
      <Canvas
        camera={{ position: [4, 3, 4.5], fov: 35 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#171a13']} />

        <Suspense fallback={null}>
          <Scene />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={3}
          maxDistance={8}
          autoRotate={false}
          minPolarAngle={0.4}
          maxPolarAngle={2.5}
        />
      </Canvas>

      <div className="three-d-hint">
        با ماوس یا لمس، دمبل را بچرخان
      </div>
    </div>
  )
}
