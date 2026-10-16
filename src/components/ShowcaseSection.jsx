import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Float, ContactShadows, Environment } from '@react-three/drei'

function Kettlebell() {
  return (
    <group>
      <mesh castShadow>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#c5f36b" metalness={0.4} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.2, 0]} castShadow>
        <torusGeometry args={[0.5, 0.15, 16, 32]} />
        <meshStandardMaterial color="#333" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  )
}

export default function ShowcaseSection() {
  return (
    <section className="showcase-section">
      <div className="showcase-copy">
        <span className="eyebrow">محصولات ما</span>
        <h2>
          تجهیزات <span>حرفه‌ای</span> برای تمرین
        </h2>
        <p>از دمبل و کتل‌بل تا تجهیزات پیشرفته — همه در FitClub.</p>
        <a href="#" className="primary-button">
          مشاهده فروشگاه
        </a>
      </div>

      <div className="three-d-showcase">
        <Canvas shadows camera={{ position: [0, 1, 6], fov: 45 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
            <Environment preset="warehouse" />
            <ContactShadows position={[0, -1.5, 0]} opacity={0.4} blur={2} />
            <Float speed={2} floatIntensity={1}>
              <Kettlebell />
            </Float>
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
          </Suspense>
        </Canvas>
        <div className="three-d-hint">🖱 برای چرخش، درگ کن</div>
      </div>
    </section>
  )
}