import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { plansAPI } from '../api/endpoints'
import { useAuth } from '../context/AuthContext'

const steps = ['مشخصات بدنی', 'هدف و سطح', 'تجهیزات']

function WorkoutGenerator() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    gender: 'male',
    age: 25,
    height: 175,
    current_weight: 75,
    target_weight: 70,
    goal: 'muscle',
    level: 'beginner',
    days_per_week: 3,
    equipment: 'none',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // بررسی احراز هویت بعد از رندر شدن کامپوننت
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  // اگر کاربر لاگین نبود، چیزی رندر نکن
  if (!isAuthenticated) return null

  const handleNext = () => setStep((s) => Math.min(s + 1, steps.length - 1))
  const handlePrev = () => setStep((s) => Math.max(s - 1, 0))

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await plansAPI.generate(form)
      // هدایت به صفحه نمایش برنامه
      navigate(`/plans/${data.id}`)
    } catch (err) {
      console.error("Error generating plan:", err)
      setError(err.response?.data?.detail || 'خطا در ساخت برنامه. لطفاً دوباره تلاش کنید.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="wizard-page">
      <div className="wizard-container">
        <div className="wizard-progress">
          <div className="wizard-progress-bar">
            <motion.div className="wizard-progress-fill" animate={{ width: `${((step + 1) / steps.length) * 100}%` }} />
          </div>
          <span>مرحله {step + 1} از {steps.length}</span>
        </div>

        <AnimatePresence mode="wait">
          {/* مرحله ۱: مشخصات بدنی */}
          {step === 0 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <span className="eyebrow">قدم اول</span>
              <h2>مشخصات بدنی شما</h2>
              <div className="wizard-form">
                <div className="wizard-form-row">
                  <div className="wizard-form-group">
                    <label>جنسیت</label>
                    <div className="wizard-radio-row">
                      <button type="button" className={`wizard-radio ${form.gender === 'male' ? 'active' : ''}`} onClick={() => setForm({...form, gender: 'male'})}>👨 آقا</button>
                      <button type="button" className={`wizard-radio ${form.gender === 'female' ? 'active' : ''}`} onClick={() => setForm({...form, gender: 'female'})}>👩 خانم</button>
                    </div>
                  </div>
                  <div className="wizard-form-group">
                    <label>سن</label>
                    <input type="number" value={form.age} onChange={(e) => setForm({...form, age: +e.target.value})} />
                  </div>
                </div>
                <div className="wizard-form-row">
                  <div className="wizard-form-group">
                    <label>قد (سانتی‌متر)</label>
                    <input type="number" value={form.height} onChange={(e) => setForm({...form, height: +e.target.value})} />
                  </div>
                  <div className="wizard-form-group">
                    <label>وزن فعلی (کیلوگرم)</label>
                    <input type="number" value={form.current_weight} onChange={(e) => setForm({...form, current_weight: +e.target.value})} />
                  </div>
                </div>
                <div className="wizard-form-group">
                  <label>وزن هدف (کیلوگرم)</label>
                  <input type="number" value={form.target_weight} onChange={(e) => setForm({...form, target_weight: +e.target.value})} />
                </div>
              </div>
            </motion.div>
          )}

          {/* مرحله ۲: هدف و سطح */}
          {step === 1 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <span className="eyebrow">قدم دوم</span>
              <h2>هدف و سطح شما</h2>
              <div className="wizard-options">
                {[
                  { v: 'muscle', l: 'افزایش حجم', i: '💪' },
                  { v: 'weight_loss', l: 'کاهش وزن', i: '🔥' },
                  { v: 'strength', l: 'افزایش قدرت', i: '🏋️' },
                  { v: 'fitness', l: 'تناسب اندام', i: '🏃' },
                ].map((g) => (
                  <button type="button" key={g.v} className={`wizard-option ${form.goal === g.v ? 'active' : ''}`} onClick={() => setForm({...form, goal: g.v})}>
                    <div className="wizard-option-icon">{g.i}</div>
                    <strong>{g.l}</strong>
                  </button>
                ))}
              </div>
              <h3 style={{marginTop: '20px'}}>سطح تمرینی</h3>
              <div className="wizard-chips">
                {[
                  { v: 'beginner', l: 'مبتدی' },
                  { v: 'intermediate', l: 'متوسط' },
                  { v: 'advanced', l: 'پیشرفته' },
                ].map((l) => (
                  <button type="button" key={l.v} className={`wizard-chip ${form.level === l.v ? 'active' : ''}`} onClick={() => setForm({...form, level: l.v})}>{l.l}</button>
                ))}
              </div>
              <h3 style={{marginTop: '20px'}}>تعداد روزهای تمرین در هفته</h3>
              <div className="wizard-chips">
                {[2, 3, 4, 5].map((d) => (
                  <button type="button" key={d} className={`wizard-chip ${form.days_per_week === d ? 'active' : ''}`} onClick={() => setForm({...form, days_per_week: d})}>{d} روز</button>
                ))}
              </div>
            </motion.div>
          )}

          {/* مرحله ۳: تجهیزات */}
          {step === 2 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <span className="eyebrow">قدم سوم</span>
              <h2>تجهیزات در دسترس</h2>
              <div className="wizard-options">
                {[
                  { v: 'none', l: 'بدون وسیله', i: '🚫', desc: 'فقط با وزن بدن' },
                  { v: 'basic', l: 'وسایل ساده', i: '💪', desc: 'دمبل، کش، ...' },
                  { v: 'full', l: 'وسایل کامل', i: '🏋️', desc: 'دستگاه‌های باشگاه' },
                ].map((eq) => (
                  <button type="button" key={eq.v} className={`wizard-option ${form.equipment === eq.v ? 'active' : ''}`} onClick={() => setForm({...form, equipment: eq.v})}>
                    <div className="wizard-option-icon">{eq.i}</div>
                    <strong>{eq.l}</strong>
                    <span>{eq.desc}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && <div className="auth-error" style={{marginTop: '20px'}}>⚠️ {error}</div>}

        <div className="wizard-actions">
          {step > 0 && <button type="button" className="secondary-button" onClick={handlePrev} disabled={loading}>← قبلی</button>}
          {step < steps.length - 1 ? (
            <button type="button" className="primary-button" onClick={handleNext}>بعدی →</button>
          ) : (
            <button type="button" className="primary-button" onClick={handleSubmit} disabled={loading}>
              {loading ? 'در حال ساخت...' : '🚀 برنامه‌ی من رو بساز'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default WorkoutGenerator