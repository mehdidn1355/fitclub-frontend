import { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import Particles from './Particles'

// ============================================
// آدمک سه‌بعدی با انیمیشن بر اساس نوع حرکت
// ============================================

function StickFigure({ animationKey = 'default' }) {
  const leftArmRef = useRef()
  const rightArmRef = useRef()
  const leftForearmRef = useRef()
  const rightForearmRef = useRef()
  const leftLegRef = useRef()
  const rightLegRef = useRef()
  const leftShinRef = useRef()
  const rightShinRef = useRef()
  const bodyRef = useRef()
  const headRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime

    // ریست
    const resetAll = () => {
      ;[leftArmRef, rightArmRef, leftForearmRef, rightForearmRef].forEach((r) => {
        if (r.current) {
          r.current.rotation.set(0, 0, 0)
        }
      })
      ;[leftLegRef, rightLegRef, leftShinRef, rightShinRef].forEach((r) => {
        if (r.current) {
          r.current.rotation.set(0, 0, 0)
        }
      })
      if (bodyRef.current) {
        bodyRef.current.position.y = 0
        bodyRef.current.rotation.set(0, 0, 0)
      }
    }

    resetAll()

    // انیمیشن‌ها بر اساس نوع حرکت
    if (animationKey === 'bicep_curl' || animationKey === 'hammer_curl') {
      // جلو بازو: آرنج خم و باز
      if (leftArmRef.current) leftArmRef.current.rotation.x = 0.2
      if (rightArmRef.current) rightArmRef.current.rotation.x = 0.2
      if (leftForearmRef.current)
        leftForearmRef.current.rotation.x = Math.sin(t * 2) * 1.2
      if (rightForearmRef.current)
        rightForearmRef.current.rotation.x = Math.sin(t * 2 + 0.3) * 1.2
    } else if (
      animationKey === 'bench_press' ||
      animationKey === 'incline_press' ||
      animationKey === 'push_up'
    ) {
      // پرس سینه: آرنج‌ها بالا و پایین
      if (animationKey === 'push_up') {
        if (bodyRef.current) {
          bodyRef.current.rotation.z = -Math.PI / 2.2
          bodyRef.current.position.y = -0.5 + Math.sin(t * 2) * 0.25
        }
      } else {
        if (bodyRef.current) bodyRef.current.rotation.z = -Math.PI / 2
        const bend = 1.2 + Math.sin(t * 2) * 0.8
        if (leftArmRef.current) leftArmRef.current.rotation.x = -0.3
        if (rightArmRef.current) rightArmRef.current.rotation.x = -0.3
        if (leftForearmRef.current) leftForearmRef.current.rotation.x = -bend
        if (rightForearmRef.current) rightForearmRef.current.rotation.x = -bend
      }
    } else if (animationKey === 'squat') {
      // اسکات
      const bend = Math.abs(Math.sin(t * 1.5))
      if (bodyRef.current) bodyRef.current.position.y = -bend * 0.5
      if (leftLegRef.current) leftLegRef.current.rotation.x = bend * 0.8
      if (rightLegRef.current) rightLegRef.current.rotation.x = bend * 0.8
      if (leftShinRef.current) leftShinRef.current.rotation.x = -bend * 1.2
      if (rightShinRef.current) rightShinRef.current.rotation.x = -bend * 1.2
    } else if (animationKey === 'pull_up') {
      // بارفیکس
      if (bodyRef.current) bodyRef.current.position.y = Math.sin(t * 1.5) * 0.5
      if (leftArmRef.current) {
        leftArmRef.current.rotation.z = 0.4
        leftArmRef.current.rotation.x = -Math.PI / 2.3
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.z = -0.4
        rightArmRef.current.rotation.x = -Math.PI / 2.3
      }
    } else if (animationKey === 'plank') {
      // پلانک
      if (bodyRef.current) {
        bodyRef.current.rotation.z = -Math.PI / 2.2
        bodyRef.current.position.y = -0.3
      }
    } else if (animationKey === 'crunch' || animationKey === 'leg_raise') {
      // کرانچ
      if (bodyRef.current) {
        bodyRef.current.rotation.x = -Math.sin(t * 1.5) * 0.4
      }
      if (leftLegRef.current) leftLegRef.current.rotation.x = -Math.PI / 4
      if (rightLegRef.current) rightLegRef.current.rotation.x = -Math.PI / 4
    } else if (
      animationKey === 'lateral_raise' ||
      animationKey === 'front_raise' ||
      animationKey === 'chest_fly'
    ) {
      // نشر
      const open = Math.abs(Math.sin(t * 1.5)) * 0.9
      if (leftArmRef.current) leftArmRef.current.rotation.z = -open
      if (rightArmRef.current) rightArmRef.current.rotation.z = open
    } else if (animationKey === 'shoulder_press') {
      // پرس سرشانه
      if (leftArmRef.current) {
        leftArmRef.current.rotation.z = 0.3
        leftArmRef.current.rotation.x = -Math.PI / 2 + Math.sin(t * 2) * 0.6
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.z = -0.3
        rightArmRef.current.rotation.x = -Math.PI / 2 + Math.sin(t * 2 + 0.2) * 0.6
      }
    } else if (animationKey === 'barbell_row' || animationKey === 'cable_row') {
      // زیربغل
      if (bodyRef.current) {
        bodyRef.current.rotation.x = Math.PI / 6 + Math.sin(t * 2) * 0.15
      }
      if (leftArmRef.current)
        leftArmRef.current.rotation.x = -0.5 + Math.sin(t * 2) * 0.5
      if (rightArmRef.current)
        rightArmRef.current.rotation.x = -0.5 + Math.sin(t * 2 + 0.2) * 0.5
    } else if (animationKey === 'leg_press') {
      // پرس پا
      if (bodyRef.current) bodyRef.current.rotation.x = Math.PI / 3
      if (leftLegRef.current) leftLegRef.current.rotation.x = Math.PI / 4
      if (rightLegRef.current) rightLegRef.current.rotation.x = Math.PI / 4
      const push = Math.sin(t * 2) * 0.4
      if (leftShinRef.current) leftShinRef.current.rotation.x = push
      if (rightShinRef.current) rightShinRef.current.rotation.x = push
    } else if (animationKey === 'leg_extension' || animationKey === 'leg_curl') {
      // جلو پا / پشت پا
      if (bodyRef.current) bodyRef.current.rotation.x = Math.PI / 3
      const bend = Math.sin(t * 2) * 0.9
      if (leftLegRef.current) leftLegRef.current.rotation.x = -Math.PI / 3
      if (rightLegRef.current) rightLegRef.current.rotation.x = -Math.PI / 3
      if (leftShinRef.current) leftShinRef.current.rotation.x = bend
      if (rightShinRef.current) rightShinRef.current.rotation.x = bend
    } else if (animationKey === 'calf_raise') {
      // ساق پا
      if (bodyRef.current)
        bodyRef.current.position.y = Math.abs(Math.sin(t * 2.5)) * 0.2
    } else if (animationKey === 'tricep_pushdown') {
      // پشت بازو
      if (leftArmRef.current) leftArmRef.current.rotation.x = -0.3
      if (rightArmRef.current) rightArmRef.current.rotation.x = -0.3
      const push = Math.sin(t * 2.5) * 0.6
      if (leftForearmRef.current) leftForearmRef.current.rotation.x = push
      if (rightForearmRef.current) rightForearmRef.current.rotation.x = push
    } else {
      // پیش‌فرض: چرخش
      if (bodyRef.current) bodyRef.current.rotation.y = t * 0.5
    }
  })

  return (
    <group ref={bodyRef} position={[0, 0, 0]}>
      {/* سر */}
      <mesh ref={headRef} position={[0, 1.7, 0]} castShadow>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshStandardMaterial
          color="#c5f36b"
          metalness={0.4}
          roughness={0.4}
          emissive="#c5f36b"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* بدن */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <capsuleGeometry args={[0.28, 1, 8, 16]} />
        <meshStandardMaterial
          color="#a6e04a"
          metalness={0.3}
          roughness={0.5}
          emissive="#a6e04a"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* بازوی چپ بالا */}
      <group ref={leftArmRef} position={[-0.45, 1.1, 0]}>
        <mesh position={[0, -0.35, 0]} castShadow>
          <capsuleGeometry args={[0.1, 0.55, 4, 12]} />
          <meshStandardMaterial color="#c5f36b" metalness={0.4} roughness={0.4} />
        </mesh>

        {/* ساعد چپ */}
        <group ref={leftForearmRef} position={[0, -0.75, 0]}>
          <mesh position={[0, -0.35, 0]} castShadow>
            <capsuleGeometry args={[0.09, 0.55, 4, 12]} />
            <meshStandardMaterial color="#c5f36b" metalness={0.4} roughness={0.4} />
          </mesh>
        </group>
      </group>

      {/* بازوی راست بالا */}
      <group ref={rightArmRef} position={[0.45, 1.1, 0]}>
        <mesh position={[0, -0.35, 0]} castShadow>
          <capsuleGeometry args={[0.1, 0.55, 4, 12]} />
          <meshStandardMaterial color="#c5f36b" metalness={0.4} roughness={0.4} />
        </mesh>

        {/* ساعد راست */}
        <group ref={rightForearmRef} position={[0, -0.75, 0]}>
          <mesh position={[0, -0.35, 0]} castShadow>
            <capsuleGeometry args={[0.09, 0.55, 4, 12]} />
            <meshStandardMaterial color="#c5f36b" metalness={0.4} roughness={0.4} />
          </mesh>
        </group>
      </group>

      {/* پای چپ */}
      <group ref={leftLegRef} position={[-0.16, -0.1, 0]}>
        <mesh position={[0, -0.45, 0]} castShadow>
          <capsuleGeometry args={[0.13, 0.7, 4, 12]} />
          <meshStandardMaterial color="#7a9a3a" metalness={0.3} roughness={0.5} />
        </mesh>

        {/* ساق چپ */}
        <group ref={leftShinRef} position={[0, -0.9, 0]}>
          <mesh position={[0, -0.4, 0]} castShadow>
            <capsuleGeometry args={[0.11, 0.7, 4, 12]} />
            <meshStandardMaterial color="#7a9a3a" metalness={0.3} roughness={0.5} />
          </mesh>
        </group>
      </group>

      {/* پای راست */}
      <group ref={rightLegRef} position={[0.16, -0.1, 0]}>
        <mesh position={[0, -0.45, 0]} castShadow>
          <capsuleGeometry args={[0.13, 0.7, 4, 12]} />
          <meshStandardMaterial color="#7a9a3a" metalness={0.3} roughness={0.5} />
        </mesh>

        {/* ساق راست */}
        <group ref={rightShinRef} position={[0, -0.9, 0]}>
          <mesh position={[0, -0.4, 0]} castShadow>
            <capsuleGeometry args={[0.11, 0.7, 4, 12]} />
            <meshStandardMaterial color="#7a9a3a" metalness={0.3} roughness={0.5} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

// ============================================
// Modal با Canvas سه‌بعدی
// ============================================

export default function ExerciseAnimator3D({
  animationKey = 'default',
  exerciseName = '',
  onClose,
}) {
  const [autoRotate, setAutoRotate] = useState(true)

  // بستن با ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  return (
    <div className="animator-modal-overlay" onClick={onClose}>
      <div className="animator-modal" onClick={(e) => e.stopPropagation()}>
        <div className="animator-header">
          <div>
            <span className="eyebrow">🎬 آموزش سه‌بعدی</span>
            <h3>{exerciseName}</h3>
          </div>
          <button className="animator-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="animator-canvas">
          <Canvas
            shadows
            camera={{ position: [0, 0.3, 4.5], fov: 50 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true }}
          >
            <Suspense fallback={null}>
              <ambientLight intensity={0.4} />
              <directionalLight
                position={[5, 5, 5]}
                intensity={1.5}
                castShadow
                shadow-mapSize={[1024, 1024]}
              />
              <pointLight position={[-3, 2, 2]} intensity={0.6} color="#c5f36b" />
              <pointLight position={[3, -2, -2]} intensity={0.4} color="#a6e04a" />

              <Environment preset="city" />
              <ContactShadows
                position={[0, -1.8, 0]}
                opacity={0.5}
                blur={2.5}
              />

              <StickFigure animationKey={animationKey} />

              <Particles count={80} color="#c5f36b" />

              <EffectComposer>
                <Bloom
                  intensity={0.7}
                  luminanceThreshold={0.2}
                  luminanceSmoothing={0.9}
                  mipmapBlur
                />
                <Vignette eskil={false} offset={0.1} darkness={0.7} />
              </EffectComposer>
            </Suspense>

            <OrbitControls
              enableZoom={true}
              enablePan={false}
              autoRotate={autoRotate}
              autoRotateSpeed={0.8}
              maxPolarAngle={Math.PI / 1.8}
              minPolarAngle={Math.PI / 4}
            />
          </Canvas>
        </div>

        <div className="animator-controls">
          <button
            className={`animator-toggle ${autoRotate ? 'active' : ''}`}
            onClick={() => setAutoRotate(!autoRotate)}
          >
            {autoRotate ? '🔄 چرخش خودکار: روشن' : '⏸ چرخش خودکار: خاموش'}
          </button>
          <span className="animator-hint">
            🖱 با ماوس بچرخون • اسکرول = زوم • ESC = بستن
          </span>
        </div>
      </div>
    </div>
  )
}