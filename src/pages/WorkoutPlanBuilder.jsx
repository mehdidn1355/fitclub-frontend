import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { exercisesAPI, plansAPI } from '../api/endpoints'
import ExerciseIcon3D from '../components/three/ExerciseIcon3D'
import ExerciseAnimator3D from '../components/three/ExerciseAnimator3D'

const days = ['روز ۱', 'روز ۲', 'روز ۳', 'روز ۴', 'روز ۵', 'روز ۶', 'روز ۷']

const equipmentLabels = {
  none: 'بدون وسیله',
  basic: 'وسایل ساده',
  full: 'وسایل کامل',
}

function WorkoutPlanBuilder() {
  const { planId } = useParams()
  const navigate = useNavigate()

  const [plan, setPlan] = useState(null)
  const [exercises, setExercises] = useState([])
  const [bodyParts, setBodyParts] = useState([])
  const [activeBodyPart, setActiveBodyPart] = useState('همه')
  const [selectedDay, setSelectedDay] = useState('روز ۱')
  const [items, setItems] = useState([])
  const [activeExercise, setActiveExercise] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const toFa = (n) => Number(n || 0).toLocaleString('fa-IR')

  // دریافت اطلاعات
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [planRes, exRes, partsRes] = await Promise.all([
          plansAPI.get(planId),
          exercisesAPI.list(),
          exercisesAPI.bodyParts(),
        ])
        setPlan(planRes.data)
        setExercises(exRes.data)
        setBodyParts(['همه', ...partsRes.data])

        if (planRes.data.items && planRes.data.items.length > 0) {
          setItems(
            planRes.data.items.map((it) => ({
              exercise_id: it.exercise_id,
              exercise_name: it.exercise?.name || 'حرکت',
              exercise_icon: it.exercise?.icon || '🏋️',
              animation_key: it.exercise?.animation_key || 'default',
              muscle_group: it.exercise?.muscle_group || 'default',
              equipment_needed: it.exercise?.equipment_needed || 'none',
              day: it.day,
              order: it.order,
              sets: it.sets,
              reps: it.reps,
              weight: it.weight,
              rest_seconds: it.rest_seconds,
              notes: it.notes || '',
            }))
          )
        }
      } catch (err) {
        console.error(err)
        setError('خطا در دریافت اطلاعات')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [planId])

  // فیلترها
  const filteredExercises =
    activeBodyPart === 'همه'
      ? exercises
      : exercises.filter((e) => e.muscle_group === activeBodyPart)

  const currentDayItems = items
    .filter((it) => it.day === selectedDay)
    .sort((a, b) => a.order - b.order)

  // عملیات
  const addExercise = (exercise) => {
    const nextOrder = currentDayItems.length + 1
    setItems([
      ...items,
      {
        exercise_id: exercise.id,
        exercise_name: exercise.name,
        exercise_icon: exercise.icon,
        animation_key: exercise.animation_key,
        muscle_group: exercise.muscle_group,
        equipment_needed: exercise.equipment_needed || 'none',
        day: selectedDay,
        order: nextOrder,
        sets: exercise.default_sets || 3,
        reps: exercise.default_reps || 12,
        weight: 0,
        rest_seconds: exercise.rest_seconds || 60,
        notes: '',
      },
    ])
  }

  const removeItem = (index) => {
    const itemToRemove = currentDayItems[index]
    const filtered = items.filter((it) => it !== itemToRemove)

    const dayItems = filtered
      .filter((x) => x.day === selectedDay)
      .sort((a, b) => a.order - b.order)

    const reordered = filtered.map((it) => {
      if (it.day === selectedDay) {
        const newOrder = dayItems.findIndex((x) => x === it) + 1
        return { ...it, order: newOrder }
      }
      return it
    })

    setItems(reordered)
  }

  const updateItem = (index, field, value) => {
    const item = currentDayItems[index]
    setItems(
      items.map((it) => (it === item ? { ...it, [field]: value } : it))
    )
  }

  const handleSave = async () => {
    if (items.length === 0) {
      setError('حداقل یک حرکت اضافه کن')
      return
    }

    setSaving(true)
    setError(null)

    try {
      const itemsPayload = items.map((it) => ({
        exercise_id: it.exercise_id,
        day: it.day,
        order: it.order,
        sets: parseInt(it.sets) || 3,
        reps: parseInt(it.reps) || 12,
        weight: parseFloat(it.weight) || 0,
        rest_seconds: parseInt(it.rest_seconds) || 60,
        notes: it.notes || null,
      }))

      await plansAPI.updateItems(planId, itemsPayload)
      setSuccess(true)
      setTimeout(() => navigate('/trainer/requests'), 1500)
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.detail || 'خطا در ذخیره')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="courses-page">
        <main className="courses-main">
          <div className="loading-state">
            <div className="spinner" />
            <p>در حال بارگذاری...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="courses-page">
        <main className="courses-main">
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <p>برنامه یافت نشد</p>
            <Link to="/trainer/requests" className="primary-button">
              بازگشت
            </Link>
          </div>
        </main>
      </div>
    )
  }

  if (success) {
    return (
      <div className="courses-page">
        <main className="courses-main">
          <motion.div
            className="order-success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: 'spring' }}
          >
            <motion.div
              className="success-icon"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              ✅
            </motion.div>
            <h1>برنامه با موفقیت ذخیره شد! 🎉</h1>
            <p>حالا شاگرد شما می‌تونه برنامه رو ببینه.</p>
            <Link to="/trainer/requests" className="primary-button">
              بازگشت به درخواست‌ها
            </Link>
          </motion.div>
        </main>
      </div>
    )
  }

  return (
    <div className="courses-page">
      <main className="courses-main">
        <div className="courses-intro">
          <Link to="/trainer/requests" className="view-all-link">
            ← بازگشت به درخواست‌ها
          </Link>
          <h1 style={{ marginTop: '15px' }}>
            ساخت برنامه <span>#{toFa(plan.id)}</span>
          </h1>
          <p>
            🎯 {plan.body_focus?.split(',').join('، ')} | 👤 {plan.title}
          </p>
        </div>

        <div className="builder-layout">
          {/* Sidebar */}
          <div className="builder-sidebar">
            <h3>روزهای تمرین</h3>
            {days.map((day) => {
              const count = items.filter((it) => it.day === day).length
              return (
                <button
                  key={day}
                  className={`builder-day ${selectedDay === day ? 'active' : ''}`}
                  onClick={() => setSelectedDay(day)}
                >
                  <span>{day}</span>
                  <span className="day-count">{toFa(count)}</span>
                </button>
              )
            })}

            <div className="builder-summary" style={{ marginTop: '20px' }}>
              📊 مجموع: {toFa(items.length)} حرکت
            </div>
          </div>

          {/* Main */}
          <div className="builder-main">
            <h3>{selectedDay}</h3>

            <div className="muscle-groups">
              {bodyParts.map((part) => (
                <button
                  key={part}
                  className={`muscle-btn ${activeBodyPart === part ? 'active' : ''}`}
                  onClick={() => setActiveBodyPart(part)}
                >
                  {part}
                </button>
              ))}
            </div>

            <div className="exercise-suggestions">
              <span className="suggestions-label">
                حرکات پیشنهادی (کلیک کن تا اضافه شه):
              </span>
              <div className="suggestions-list">
                {filteredExercises.length === 0 ? (
                  <p style={{ color: '#6b6f63', fontSize: '13px' }}>
                    حرکتی برای این ناحیه وجود نداره
                  </p>
                ) : (
                  filteredExercises.map((ex) => (
                    <button
                      key={ex.id}
                      className="suggestion-chip"
                      onClick={() => addExercise(ex)}
                    >
                      {ex.icon} + {ex.name}
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="builder-exercises">
              <AnimatePresence>
                {currentDayItems.length === 0 ? (
                  <p className="empty-exercises">
                    هنوز حرکتی اضافه نکردی. از بالا انتخاب کن.
                  </p>
                ) : (
                  currentDayItems.map((item, i) => (
                    <motion.div
                      key={`${item.exercise_id}-${item.day}-${i}`}
                      className="builder-exercise"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div
                        className="exercise-3d-wrapper"
                        onClick={() => setActiveExercise(item)}
                        title="مشاهده‌ی آموزش سه‌بعدی"
                      >
                        <ExerciseIcon3D
                          muscleGroup={item.muscle_group}
                          size={56}
                        />
                        <span className="exercise-3d-overlay">🎬</span>
                      </div>

                      <span className="exercise-num">{toFa(i + 1)}</span>

                      <div className="exercise-info-block">
                        <strong className="exercise-name">
                          {item.exercise_icon} {item.exercise_name}
                        </strong>
                        {item.equipment_needed && item.equipment_needed !== 'none' && (
                          <span className="exercise-equipment">
                            🛠 {equipmentLabels[item.equipment_needed] || item.equipment_needed}
                          </span>
                        )}
                      </div>

                      <div className="exercise-field">
                        <label>ست</label>
                        <input
                          type="number"
                          value={item.sets}
                          onChange={(e) => updateItem(i, 'sets', e.target.value)}
                          min="1"
                        />
                      </div>

                      <div className="exercise-field">
                        <label>تکرار</label>
                        <input
                          type="number"
                          value={item.reps}
                          onChange={(e) => updateItem(i, 'reps', e.target.value)}
                          min="1"
                        />
                      </div>

                      <div className="exercise-field">
                        <label>وزن</label>
                        <input
                          type="number"
                          value={item.weight}
                          onChange={(e) => updateItem(i, 'weight', e.target.value)}
                          min="0"
                        />
                      </div>

                      <div className="exercise-field">
                        <label>استراحت</label>
                        <input
                          type="number"
                          value={item.rest_seconds}
                          onChange={(e) => updateItem(i, 'rest_seconds', e.target.value)}
                          min="0"
                        />
                      </div>

                      <button
                        className="exercise-remove"
                        onClick={() => removeItem(i)}
                        title="حذف"
                      >
                        ✕
                      </button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {error && <div className="auth-error">⚠️ {error}</div>}

            <div className="builder-actions">
              <button
                className="primary-button"
                onClick={handleSave}
                disabled={saving || items.length === 0}
              >
                {saving ? 'در حال ذخیره...' : '💾 ذخیره برنامه'}
              </button>
              <Link to="/trainer/requests" className="secondary-button">
                انصراف
              </Link>
            </div>
          </div>
        </div>
      </main>

      {activeExercise && (
        <ExerciseAnimator3D
          animationKey={activeExercise.animation_key || 'default'}
          exerciseName={activeExercise.exercise_name}
          onClose={() => setActiveExercise(null)}
        />
      )}
    </div>
  )
}

export default WorkoutPlanBuilder