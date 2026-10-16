import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, ContactShadows, Environment } from '@react-three/drei'

function Dumbbell({ position = [0, 0, 0], scale = 1, color = '#c5f36b' }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <group ref={meshRef} position={position} scale={scale}>
      {/* میله وسط */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.15, 0.15, 3, 32]} />
        <meshStandardMaterial color="#333" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* وزنه چپ */}
      <mesh position={[-1.2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 0.6, 0.4, 32]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
      </mesh>
      <mesh position={[-1.5, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.2, 32]} />
        <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* وزنه راست */}
      <mesh position={[1.2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 0.6, 0.4, 32]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
      </mesh>
      <mesh position={[1.5, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.2, 32]} />
        <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* دسته‌ها */}
      <mesh position={[0.5, 0, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.6, 32]} />
        <meshStandardMaterial color="#555" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[-0.5, 0, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.6, 32]} />
        <meshStandardMaterial color="#555" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  )
}

export default function Dumbbell3D() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-3, 2, -2]} intensity={0.4} />
      <pointLight position={[0, 5, -5]} intensity={0.6} color="#c5f36b" />

      <Environment preset="city" />

      <ContactShadows
        position={[0, -2, 0]}
        opacity={0.4}
        blur={2}
        far={4}
      />

      <Float speed={1} rotationIntensity={0.15} floatIntensity={0.4}>
        <Dumbbell position={[0, 0, 0]} scale={0.9} color="#c5f36b" />
      </Float>
    </>
  )
}