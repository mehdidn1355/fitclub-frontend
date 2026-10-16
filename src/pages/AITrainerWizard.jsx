import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { exercisesAPI, usersAPI, plansAPI } from '../api/endpoints'
import { useAuth } from '../context/AuthContext'

const trainingTypes = [
  { value: 'online', label: 'آنلاین', icon: '🎥', desc: 'آموزش از راه دور' },
  { value: 'in_person', label: 'حضوری', icon: '🏋️', desc: 'آموزش در باشگاه' },
]

const locations = [
  { value: 'home', label: 'خانه', icon: '🏠', desc: 'تمرین در منزل' },
  { value: 'gym', label: 'باشگاه', icon: '🏢', desc: 'تمرین در باشگاه' },
]

const equipments = [
  { value: 'none', label: 'بدون وسایل', icon: '🚫', desc: 'فقط با وزن بدن' },
  { value: 'basic', label: 'وسایل ساده', icon: '💪', desc: 'دمبل، کش، ...' },
  { value: 'full', label: 'وسایل کامل', icon: '🏋️', desc: 'دستگاه‌های حرفه‌ای' },
]

const musicOptions = [
  { value: 'workout_hits', label: 'ورک‌اوت هیتس', icon: '🔥' },
  { value: 'chill', label: 'آرام', icon: '🌊' },
  { value: 'hiphop', label: 'هیپ هاپ', icon: '🎤' },
  { value: 'rock', label: 'راک', icon: '🎸' },
  { value: 'electronic', label: 'الکترونیک', icon: '🎧' },
  { value: 'traditional', label: 'سنتی', icon: '🎵' },
]

function AITrainerWizard() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()

  const [step, setStep] = useState(1)
  const [bodyParts, setBodyParts] = useState([])
  const [trainers, setTrainers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({
    training_type: 'online',
    body_focus: [],
    trainer_id: null,
    age: '',
    weight: '',
    height: '',
    gender: 'male',
    goal: 'fitness',
    location: 'home',
    equipment: 'none',
    music: 'workout_hits',
  })

  useEffect(() => {
    if (!isAuthenticated) navigate('/login')
  }, [isAuthenticated, navigate])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [partsRes, trainersRes] = await Promise.all([
          exercisesAPI.bodyParts(),
          usersAPI.trainers(),
        ])
        setBodyParts(partsRes.data)
        setTrainers(trainersRes.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchData()
  }, [])

  const toggleBodyPart = (part) => {
    setForm((prev) => ({
      ...prev,
      body_focus: prev.body_focus.includes(part)
        ? prev.body_focus.filter((p) => p !== part)
        : [...prev.body_focus, part],
    }))
  }

  const nextStep = () => {
    setError(null)
    if (step === 2 && form.body_focus.length === 0) {
      setError('حداقل یک ناحیه بدن رو انتخاب کن')
      return
    }
    if (step === 3 && !form.trainer_id) {
      setError('یک مربی انتخاب کن')
      return
    }
    if (step === 4 && (!form.age || !form.weight)) {
      setError('سن و وزن رو وارد کن')
      return
    }
    setStep(step + 1)
  }

  const prevStep = () => setStep(step - 1)

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      const planData = {
        trainer_id: form.trainer_id,
        title: `برنامه‌ی ${form.body_focus.join(' و ')}`,
        description: `برنامه‌ی اختصاصی برای ${form.body_focus.join('، ')} — سن: ${form.age}، وزن: ${form.weight}`,
        training_type: form.training_type,
        location: form.location,
        equipment: form.equipment,
        music_playlist: form.music,
        body_focus: form.body_focus.join(','),
      }

      const { data } = await plansAPI.request(planData)
      navigate(`/plans/${data.id}`)
    } catch (err) {
      console.error('Request error:', err)
      console.error('Response:', err.response?.data)
      setError(
        err.response?.data?.detail ||
          JSON.stringify(err.response?.data) ||
          'خطا در ثبت درخواست'
      )
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) return null

  const toFa = (n) => Number(n || 0).toLocaleString('fa-IR')

  return (
    <div className="wizard-page">
      <div className="wizard-container">
        <div className="wizard-progress">
          <div className="wizard-progress-bar">
            <motion.div
              className="wizard-progress-fill"
              animate={{ width: `${(step / 6) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <span>مرحله {toFa(step)} از ۶</span>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              className="wizard-step"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <span className="eyebrow">قدم اول</span>
              <h2>چه نوع آموزشی می‌خوای؟</h2>
              <p>مربی مورد نظرت رو انتخاب کن</p>

              <div className="wizard-options">
                {trainingTypes.map((t) => (
                  <button
                    key={t.value}
                    className={`wizard-option ${
                      form.training_type === t.value ? 'active' : ''
                    }`}
                    onClick={() =>
                      setForm({ ...form, training_type: t.value })
                    }
                  >
                    <div className="wizard-option-icon">{t.icon}</div>
                    <strong>{t.label}</strong>
                    <span>{t.desc}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              className="wizard-step"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <span className="eyebrow">قدم دوم</span>
              <h2>کدوم نواحی بدن رو می‌خوای تقویت کنی؟</h2>
              <p>می‌تونی چند تا انتخاب کنی</p>

              <div className="wizard-chips">
                {bodyParts.map((part) => (
                  <button
                    key={part}
                    className={`wizard-chip ${
                      form.body_focus.includes(part) ? 'active' : ''
                    }`}
                    onClick={() => toggleBodyPart(part)}
                  >
                    {form.body_focus.includes(part) ? '✓ ' : '+ '}
                    {part}
                  </button>
                ))}
              </div>

              {form.body_focus.length > 0 && (
                <p className="wizard-hint">
                  انتخاب‌شده: {form.body_focus.join('، ')}
                </p>
              )}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              className="wizard-step"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <span className="eyebrow">قدم سوم</span>
              <h2>مربی خودت رو انتخاب کن</h2>
              <p>از بین بهترین مربیان FitClub</p>

              <div className="wizard-trainers">
                {trainers.map((trainer) => (
                  <button
                    key={trainer.id}
                    className={`wizard-trainer ${
                      form.trainer_id === trainer.id ? 'active' : ''
                    }`}
                    onClick={() =>
                      setForm({ ...form, trainer_id: trainer.id })
                    }
                  >
                    <div className="wizard-trainer-avatar">
                      {trainer.avatar}
                    </div>
                    <div>
                      <strong>{trainer.full_name}</strong>
                      <span>{trainer.specialty || 'مربی'}</span>
                      <div className="wizard-trainer-meta">
                        ⭐ {toFa(trainer.rating)} • 🎯{' '}
                        {toFa(trainer.sessions_count)} جلسه
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              className="wizard-step"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <span className="eyebrow">قدم چهارم</span>
              <h2>مشخصات فردی</h2>
              <p>برای برنامه‌ی دقیق‌تر</p>

              <div className="wizard-form">
                <div className="wizard-form-row">
                  <div className="wizard-form-group">
                    <label>سن</label>
                    <input
                      type="number"
                      value={form.age}
                      onChange={(e) =>
                        setForm({ ...form, age: e.target.value })
                      }
                      placeholder="مثلاً ۲۵"
                      min="12"
                      max="80"
                    />
                  </div>

                  <div className="wizard-form-group">
                    <label>وزن (کیلوگرم)</label>
                    <input
                      type="number"
                      value={form.weight}
                      onChange={(e) =>
                        setForm({ ...form, weight: e.target.value })
                      }
                      placeholder="مثلاً ۷۵"
                      min="30"
                      max="200"
                    />
                  </div>
                </div>

                <div className="wizard-form-group">
                  <label>جنسیت</label>
                  <div className="wizard-radio-row">
                    {[
                      { v: 'male', l: 'آقا', i: '👨' },
                      { v: 'female', l: 'خانم', i: '👩' },
                    ].map((g) => (
                      <button
                        key={g.v}
                        type="button"
                        className={`wizard-radio ${
                          form.gender === g.v ? 'active' : ''
                        }`}
                        onClick={() =>
                          setForm({ ...form, gender: g.v })
                        }
                      >
                        {g.i} {g.l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              className="wizard-step"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <span className="eyebrow">قدم پنجم</span>
              <h2>کجا تمرین می‌کنی؟</h2>

              <div className="wizard-options">
                {locations.map((l) => (
                  <button
                    key={l.value}
                    className={`wizard-option ${
                      form.location === l.value ? 'active' : ''
                    }`}
                    onClick={() =>
                      setForm({ ...form, location: l.value })
                    }
                  >
                    <div className="wizard-option-icon">{l.icon}</div>
                    <strong>{l.label}</strong>
                    <span>{l.desc}</span>
                  </button>
                ))}
              </div>

              <h3 style={{ marginTop: '30px' }}>چه وسایلی داری؟</h3>

              <div className="wizard-options">
                {equipments.map((eq) => (
                  <button
                    key={eq.value}
                    className={`wizard-option ${
                      form.equipment === eq.value ? 'active' : ''
                    }`}
                    onClick={() =>
                      setForm({ ...form, equipment: eq.value })
                    }
                  >
                    <div className="wizard-option-icon">{eq.icon}</div>
                    <strong>{eq.label}</strong>
                    <span>{eq.desc}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 6 && (
            <motion.div
              key="step6"
              className="wizard-step"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <span className="eyebrow">قدم آخر</span>
              <h2>موسیقی تمرینت رو انتخاب کن</h2>
              <p>هنگام تمرین، این پلی‌لیست پخش می‌شه</p>

              <div className="wizard-music-grid">
                {musicOptions.map((m) => (
                  <button
                    key={m.value}
                    className={`wizard-music ${
                      form.music === m.value ? 'active' : ''
                    }`}
                    onClick={() => setForm({ ...form, music: m.value })}
                  >
                    <span className="wizard-music-icon">{m.icon}</span>
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>

              <div className="wizard-summary">
                <h3>خلاصه‌ی درخواست</h3>
                <div className="wizard-summary-grid">
                  <div>
                    <span>نوع آموزش:</span>
                    <strong>
                      {trainingTypes.find(
                        (t) => t.value === form.training_type
                      )?.label}
                    </strong>
                  </div>
                  <div>
                    <span>نواحی بدن:</span>
                    <strong>{form.body_focus.join('، ')}</strong>
                  </div>
                  <div>
                    <span>مربی:</span>
                    <strong>
                      {trainers.find((t) => t.id === form.trainer_id)
                        ?.full_name || '-'}
                    </strong>
                  </div>
                  <div>
                    <span>سن / وزن:</span>
                    <strong>
                      {toFa(form.age)} / {toFa(form.weight)}
                    </strong>
                  </div>
                  <div>
                    <span>محیط:</span>
                    <strong>
                      {locations.find((l) => l.value === form.location)
                        ?.label}
                    </strong>
                  </div>
                  <div>
                    <span>موسیقی:</span>
                    <strong>
                      {musicOptions.find((m) => m.value === form.music)
                        ?.label}
                    </strong>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div className="auth-error" style={{ marginTop: '20px' }}>
            ⚠️ {error}
          </div>
        )}

        <div className="wizard-actions">
          {step > 1 && (
            <button className="secondary-button" onClick={prevStep}>
              ← قبلی
            </button>
          )}
          {step < 6 ? (
            <button className="primary-button" onClick={nextStep}>
              بعدی →
            </button>
          ) : (
            <button
              className="primary-button"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'در حال ثبت...' : 'ثبت درخواست ✓'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default AITrainerWizard