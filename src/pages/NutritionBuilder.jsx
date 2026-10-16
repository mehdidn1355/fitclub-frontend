import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { nutritionAPI, plansAPI } from '../api/endpoints'

const mealTypes = ['صبحانه', 'میان‌وعده صبح', 'ناهار', 'میان‌وعده عصر', 'شام', 'قبل خواب']

const supplementPresets = [
  { name: 'پروتئین وی', dosage: '۲ اسکوپ', timing: 'بعد از تمرین', category: 'supplement', icon: '🥤' },
  { name: 'کراتین', dosage: '۵ گرم', timing: 'قبل از تمرین', category: 'supplement', icon: '⚡' },
  { name: 'BCAA', dosage: '۱۰ گرم', timing: 'حین تمرین', category: 'supplement', icon: '💧' },
  { name: 'مولتی ویتامین', dosage: '۱ قرص', timing: 'صبح ناشتا', category: 'vitamin', icon: '💊' },
  { name: 'ویتامین D3', dosage: '۱۰۰۰ IU', timing: 'همراه غذا', category: 'vitamin', icon: '☀️' },
  { name: 'امگا ۳', dosage: '۲ کپسول', timing: 'همراه ناهار', category: 'supplement', icon: '🐟' },
  { name: 'روی (Zinc)', dosage: '۲۵ میلی‌گرم', timing: 'شب', category: 'mineral', icon: '🛡' },
  { name: 'منیزیم', dosage: '۴۰۰ میلی‌گرم', timing: 'قبل خواب', category: 'mineral', icon: '🌙' },
]

const categoryLabels = {
  supplement: 'مکمل',
  vitamin: 'ویتامین',
  mineral: 'مینرال',
}

function NutritionBuilder() {
  const { planId } = useParams()
  const navigate = useNavigate()

  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({
    title: 'برنامه‌ی غذایی اختصاصی',
    description: '',
    daily_calories: 2500,
    protein_grams: 180,
    carbs_grams: 250,
    fat_grams: 70,
    water_liters: 3,
    notes: '',
  })

  const [meals, setMeals] = useState([
    { meal_type: 'صبحانه', time: '08:00', foods: '', calories: 500, notes: '', order: 1 },
  ])

  const [supplements, setSupplements] = useState([])

  const toFa = (n) => Number(n || 0).toLocaleString('fa-IR')

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const { data } = await plansAPI.get(planId)
        setPlan(data)
        setForm((prev) => ({
          ...prev,
          title: `برنامه‌ی غذایی — ${data.title}`,
          description: data.description || '',
        }))
      } catch (err) {
        console.error(err)
        setError('خطا در دریافت اطلاعات')
      } finally {
        setLoading(false)
      }
    }
    fetchPlan()
  }, [planId])

  // ============ Meal Actions ============
  const addMeal = (type) => {
    setMeals([
      ...meals,
      {
        meal_type: type || 'میان‌وعده',
        time: '',
        foods: '',
        calories: 0,
        notes: '',
        order: meals.length + 1,
      },
    ])
  }

  const removeMeal = (index) => {
    setMeals(meals.filter((_, i) => i !== index))
  }

  const updateMeal = (index, field, value) => {
    setMeals(
      meals.map((m, i) => (i === index ? { ...m, [field]: value } : m))
    )
  }

  // ============ Supplement Actions ============
  const addSupplement = (preset) => {
    if (preset) {
      setSupplements([
        ...supplements,
        { ...preset, notes: '', related_product_ids: '', order: supplements.length + 1 },
      ])
    } else {
      setSupplements([
        ...supplements,
        {
          name: '',
          dosage: '',
          timing: '',
          category: 'supplement',
          icon: '🥤',
          notes: '',
          related_product_ids: '',
          order: supplements.length + 1,
        },
      ])
    }
  }

  const removeSupplement = (index) => {
    setSupplements(supplements.filter((_, i) => i !== index))
  }

  const updateSupplement = (index, field, value) => {
    setSupplements(
      supplements.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    )
  }

  // ============ Save ============
  const handleSave = async () => {
    if (!plan?.customer_id) {
      setError('اطلاعات مشتری یافت نشد')
      return
    }

    if (meals.some((m) => !m.foods.trim())) {
      setError('همه‌ی وعده‌ها باید محتوا داشته باشن')
      return
    }

    setSaving(true)
    setError(null)

    try {
      const payload = {
        customer_id: plan.customer_id,
        title: form.title,
        description: form.description,
        daily_calories: parseInt(form.daily_calories) || 2000,
        protein_grams: parseInt(form.protein_grams) || 150,
        carbs_grams: parseInt(form.carbs_grams) || 200,
        fat_grams: parseInt(form.fat_grams) || 70,
        water_liters: parseFloat(form.water_liters) || 2.5,
        notes: form.notes,
        meals: meals.map((m, i) => ({
          meal_type: m.meal_type,
          time: m.time || null,
          foods: m.foods,
          calories: parseInt(m.calories) || 0,
          notes: m.notes || null,
          order: i + 1,
        })),
        supplements: supplements.map((s, i) => ({
          name: s.name,
          dosage: s.dosage,
          timing: s.timing,
          category: s.category,
          icon: s.icon,
          notes: s.notes || null,
          related_product_ids: s.related_product_ids || '',
          order: i + 1,
        })),
      }

      await nutritionAPI.create(payload)
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
            <h1>برنامه‌ی غذایی ذخیره شد! 🎉</h1>
            <p>شاگرد شما حالا می‌تونه برنامه‌ی غذایی رو ببینه.</p>
            <Link to="/trainer/requests" className="primary-button">
              بازگشت
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
            🍎 برنامه‌ی <span>غذایی</span> + مکمل
          </h1>
          <p>برای: {plan?.title}</p>
        </div>

        {/* Calorie Targets */}
        <div className="nutrition-targets">
          <div className="nutrition-target-card">
            <span>🔥 کالری روزانه</span>
            <input
              type="number"
              value={form.daily_calories}
              onChange={(e) => setForm({ ...form, daily_calories: e.target.value })}
            />
            <span className="unit">کالری</span>
          </div>
          <div className="nutrition-target-card">
            <span>🥩 پروتئین</span>
            <input
              type="number"
              value={form.protein_grams}
              onChange={(e) => setForm({ ...form, protein_grams: e.target.value })}
            />
            <span className="unit">گرم</span>
          </div>
          <div className="nutrition-target-card">
            <span>🍚 کربوهیدرات</span>
            <input
              type="number"
              value={form.carbs_grams}
              onChange={(e) => setForm({ ...form, carbs_grams: e.target.value })}
            />
            <span className="unit">گرم</span>
          </div>
          <div className="nutrition-target-card">
            <span>🥑 چربی</span>
            <input
              type="number"
              value={form.fat_grams}
              onChange={(e) => setForm({ ...form, fat_grams: e.target.value })}
            />
            <span className="unit">گرم</span>
          </div>
          <div className="nutrition-target-card">
            <span>💧 آب</span>
            <input
              type="number"
              step="0.5"
              value={form.water_liters}
              onChange={(e) => setForm({ ...form, water_liters: e.target.value })}
            />
            <span className="unit">لیتر</span>
          </div>
        </div>

        {/* Meals Section */}
        <div className="panel-section">
          <h2 className="panel-title">
            <span className="title-bar" />
            🍽 وعده‌های غذایی
          </h2>

          <div className="meal-type-buttons">
            {mealTypes.map((type) => (
              <button
                key={type}
                className="meal-type-btn"
                onClick={() => addMeal(type)}
              >
                + {type}
              </button>
            ))}
          </div>

          <div className="meals-list">
            <AnimatePresence>
              {meals.map((meal, i) => (
                <motion.div
                  key={i}
                  className="meal-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                >
                  <div className="meal-header">
                    <span className="meal-icon">🍽</span>
                    <select
                      value={meal.meal_type}
                      onChange={(e) => updateMeal(i, 'meal_type', e.target.value)}
                      className="meal-type-select"
                    >
                      {mealTypes.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="ساعت (مثلاً 08:00)"
                      value={meal.time}
                      onChange={(e) => updateMeal(i, 'time', e.target.value)}
                      className="meal-time-input"
                    />
                    <input
                      type="number"
                      placeholder="کالری"
                      value={meal.calories}
                      onChange={(e) => updateMeal(i, 'calories', e.target.value)}
                      className="meal-cal-input"
                    />
                    <button
                      className="exercise-remove"
                      onClick={() => removeMeal(i)}
                    >
                      ✕
                    </button>
                  </div>

                  <textarea
                    placeholder="محتویات وعده (مثلاً: ۳ عدد تخم‌مرغ + نان سبوس‌دار + پنیر)"
                    value={meal.foods}
                    onChange={(e) => updateMeal(i, 'foods', e.target.value)}
                    rows={2}
                    className="meal-foods-input"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Supplements Section */}
        <div className="panel-section">
          <h2 className="panel-title">
            <span className="title-bar" />
            💊 مکمل‌ها و ویتامین‌ها
          </h2>

          <div className="supplement-presets">
            <span className="presets-label">افزودن سریع:</span>
            <div className="presets-list">
              {supplementPresets.map((preset) => (
                <button
                  key={preset.name}
                  className="preset-chip"
                  onClick={() => addSupplement(preset)}
                >
                  {preset.icon} + {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div className="supplements-list">
            <AnimatePresence>
              {supplements.map((supp, i) => (
                <motion.div
                  key={i}
                  className="supplement-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                >
                  <div className="supplement-row">
                    <span className="supplement-icon">{supp.icon}</span>
                    <select
                      value={supp.category}
                      onChange={(e) => updateSupplement(i, 'category', e.target.value)}
                      className="supplement-category"
                    >
                      {Object.entries(categoryLabels).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="نام"
                      value={supp.name}
                      onChange={(e) => updateSupplement(i, 'name', e.target.value)}
                      className="supplement-name"
                    />
                    <input
                      type="text"
                      placeholder="دوز (مثلاً ۲ اسکوپ)"
                      value={supp.dosage}
                      onChange={(e) => updateSupplement(i, 'dosage', e.target.value)}
                      className="supplement-dosage"
                    />
                    <input
                      type="text"
                      placeholder="زمان مصرف"
                      value={supp.timing}
                      onChange={(e) => updateSupplement(i, 'timing', e.target.value)}
                      className="supplement-timing"
                    />
                    <button
                      className="exercise-remove"
                      onClick={() => removeSupplement(i)}
                    >
                      ✕
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <button
            className="add-supplement-btn"
            onClick={() => addSupplement()}
          >
            + افزودن مکمل دستی
          </button>
        </div>

        {/* Notes */}
        <div className="panel-section">
          <h2 className="panel-title">
            <span className="title-bar" />
            📝 یادداشت‌های مربی
          </h2>
          <textarea
            placeholder="نکات مهم درباره‌ی تغذیه (مثلاً: قبل از تمرین ۲ ساعت فاصله باشه)"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={4}
            className="builder-notes-textarea"
          />
        </div>

        {error && <div className="auth-error">⚠️ {error}</div>}

        <div className="builder-actions">
          <button
            className="primary-button"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'در حال ذخیره...' : '💾 ذخیره برنامه‌ی غذایی'}
          </button>
          <Link to="/trainer/requests" className="secondary-button">
            انصراف
          </Link>
        </div>
      </main>
    </div>
  )
}

export default NutritionBuilder