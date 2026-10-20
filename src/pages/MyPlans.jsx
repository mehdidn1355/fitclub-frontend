import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { plansAPI, nutritionAPI } from '../api/endpoints'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import ExerciseAnimator3D from '../components/three/ExerciseAnimator3D'

const playlistData = {
  workout_hits: { name: 'ورک‌اوت هیتس', icon: '🔥', color: '#ef4444' },
  chill: { name: 'آرام', icon: '🌊', color: '#22d3ee' },
  hiphop: { name: 'هیپ هاپ', icon: '🎤', color: '#fbbf24' },
  rock: { name: 'راک', icon: '🎸', color: '#a855f7' },
  electronic: { name: 'الکترونیک', icon: '🎧', color: '#22c55e' },
  traditional: { name: 'سنتی', icon: '🎵', color: '#f97316' },
}

const locationLabels = { home: 'خانه', gym: 'باشگاه' }
const typeLabels = { online: 'آنلاین', in_person: 'حضوری' }
const equipmentLabels = {
  none: 'بدون وسیله',
  basic: 'وسایل ساده',
  full: 'وسایل کامل',
}

const categoryLabels = {
  supplement: 'مکمل',
  vitamin: 'ویتامین',
  mineral: 'مینرال',
}

function MyPlans() {
  const { planId } = useParams()
  const { user } = useAuth()
  const { addItem } = useCart()

  const [plans, setPlans] = useState([])
  const [activePlan, setActivePlan] = useState(null)
  const [nutrition, setNutrition] = useState(null)
  const [suggestedProducts, setSuggestedProducts] = useState([])
  const [activeExercise, setActiveExercise] = useState(null)
  const [activeTab, setActiveTab] = useState('workout')
  const [loading, setLoading] = useState(true)
  const [addedIds, setAddedIds] = useState([])

  const toFa = (n) => Number(n || 0).toLocaleString('fa-IR')

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true)
      try {
        const { data } = await plansAPI.my()
        setPlans(data)

        if (planId) {
          const found = data.find((p) => p.id === parseInt(planId))
          if (found) setActivePlan(found)
        } else if (data.length > 0) {
          setActivePlan(data[0])
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchPlans()
  }, [planId])

  useEffect(() => {
    const fetchNutrition = async () => {
      if (!activePlan) return
      try {
        const { data } = await nutritionAPI.my()
        if (data.customer_id === activePlan.customer_id) {
          setNutrition(data)
        }
      } catch (err) {
        setNutrition(null)
      }
    }

    const fetchSuggested = async () => {
      if (!activePlan) return
      try {
        const { data } = await plansAPI.suggestedProducts(activePlan.id)
        setSuggestedProducts(data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchNutrition()
    fetchSuggested()
  }, [activePlan])

  const handleAddProduct = (product) => {
    addItem(
      {
        id: product.id,
        title: product.title,
        price: toFa(product.price),
        priceRaw: product.price,
        icon: product.icon,
        category: product.category,
      },
      1
    )
    setAddedIds((prev) => [...prev, product.id])
    setTimeout(() => {
      setAddedIds((prev) => prev.filter((id) => id !== product.id))
    }, 1500)
  }

  if (loading) {
    return (
      <div className="courses-page">
        <main className="courses-main">
          <div className="loading-state">
            <div className="spinner" />
            <p>در حال بارگذاری برنامه‌ها...</p>
          </div>
        </main>
      </div>
    )
  }

  if (plans.length === 0) {
    return (
      <div className="courses-page">
        <main className="courses-main">
          <div className="empty-cart">
            <div className="empty-cart-icon">🎯</div>
            <h1>هنوز برنامه‌ای نداری!</h1>
            <p>با ساخت درخواست، اولین برنامه‌ت رو بگیر.</p>
            <div className="empty-cart-actions">
              <Link to="/ai-trainer" className="primary-button">
                🤖 درخواست از مربی
              </Link>
              <Link to="/generate-workout" className="secondary-button">
                🎯 ساخت برنامه رایگان
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const playlist = activePlan
    ? playlistData[activePlan.music_playlist] || playlistData.workout_hits
    : null

  return (
    <div className="courses-page">
      <main className="courses-main">
        <div className="courses-intro">
          <span className="eyebrow">برنامه‌های من</span>
          <h1>
            برنامه‌های <span>اختصاصی</span>
          </h1>
          <p>{toFa(plans.length)} برنامه موجود</p>
        </div>

        <div className="plans-tabs">
          {plans.map((plan) => (
            <button
              key={plan.id}
              className={`plan-tab ${activePlan?.id === plan.id ? 'active' : ''}`}
              onClick={() => setActivePlan(plan)}
            >
              <span className="plan-tab-id">#{toFa(plan.id)}</span>
              <strong>{plan.title}</strong>
              <span className="plan-tab-status">
                {plan.items?.length > 0 ? '✓ آماده' : '⏳ در انتظار'}
              </span>
            </button>
          ))}
        </div>

        {activePlan && (
          <motion.div
            className="plan-detail"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="plan-info-grid">
              <div className="plan-info-card">
                <span className="plan-info-icon">🎯</span>
                <div>
                  <span>نواحی بدن</span>
                  <strong>{activePlan.body_focus?.split(',').join('، ') || '-'}</strong>
                </div>
              </div>
              <div className="plan-info-card">
                <span className="plan-info-icon">
                  {typeLabels[activePlan.training_type] === 'آنلاین' ? '🎥' : '🏋️'}
                </span>
                <div>
                  <span>نوع آموزش</span>
                  <strong>{typeLabels[activePlan.training_type] || '-'}</strong>
                </div>
              </div>
              <div className="plan-info-card">
                <span className="plan-info-icon">📍</span>
                <div>
                  <span>محیط</span>
                  <strong>{locationLabels[activePlan.location] || '-'}</strong>
                </div>
              </div>
              <div className="plan-info-card">
                <span className="plan-info-icon">🛠</span>
                <div>
                  <span>وسایل</span>
                  <strong>{equipmentLabels[activePlan.equipment] || '-'}</strong>
                </div>
              </div>
            </div>

            {playlist && (
              <div
                className="music-player-card"
                style={{ '--music-color': playlist.color }}
              >
                <div className="music-player-icon">{playlist.icon}</div>
                <div className="music-player-info">
                  <span>پلی‌لیست تمرین</span>
                  <strong>{playlist.name}</strong>
                </div>
                <button className="music-player-play">▶</button>
              </div>
            )}

            <div className="content-tabs">
              <button
                className={`content-tab ${activeTab === 'workout' ? 'active' : ''}`}
                onClick={() => setActiveTab('workout')}
              >
                💪 برنامه‌ی تمرینی
                {activePlan.items?.length > 0 && (
                  <span className="tab-badge">{toFa(activePlan.items.length)}</span>
                )}
              </button>
              <button
                className={`content-tab ${activeTab === 'nutrition' ? 'active' : ''}`}
                onClick={() => setActiveTab('nutrition')}
              >
                🍎 برنامه‌ی غذایی
                {nutrition && (
                  <span className="tab-badge">
                    {toFa(nutrition.meals?.length + nutrition.supplements?.length)}
                  </span>
                )}
              </button>
            </div>

            {activeTab === 'workout' && (
              <div className="plan-exercises">
                {activePlan.items?.length === 0 ? (
                  <div className="error-state">
                    <div className="error-icon">⏳</div>
                    <p>مربی در حال آماده‌سازی برنامه‌ی تمرینی شماست.</p>
                  </div>
                ) : (
                  <div className="exercises-list">
                    {activePlan.items.map((item, i) => (
                      <motion.div
                        key={item.id}
                        className="exercise-row"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                      >
                        <div className="exercise-row-num">{toFa(i + 1)}</div>
                        <div className="exercise-row-icon">
                          {item.exercise?.icon || '🏋️'}
                        </div>
                        <div className="exercise-row-info">
                          <strong>{item.exercise?.name || 'حرکت'}</strong>
                          <span>
                            {item.day} • {toFa(item.sets)} ست × {toFa(item.reps)} تکرار
                          </span>
                          {item.exercise?.equipment_needed &&
                            item.exercise.equipment_needed !== 'none' && (
                              <span className="exercise-equipment">
                                🛠{' '}
                                {equipmentLabels[item.exercise.equipment_needed] ||
                                  item.exercise.equipment_needed}
                              </span>
                            )}
                        </div>
                        <button
                          className="exercise-row-play"
                          onClick={() => setActiveExercise(item)}
                          title="مشاهده‌ی آموزش سه‌بعدی"
                        >
                          🎬
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'nutrition' && (
              <div className="plan-nutrition">
                {!nutrition ? (
                  <div className="error-state">
                    <div className="error-icon">🍎</div>
                    <p>مربی در حال آماده‌سازی برنامه‌ی غذایی شماست.</p>
                  </div>
                ) : (
                  <>
                    <div className="nutrition-stats-grid">
                      <div className="nutrition-stat">
                        <span>🔥</span>
                        <strong>{toFa(nutrition.daily_calories)}</strong>
                        <span>کالری</span>
                      </div>
                      <div className="nutrition-stat">
                        <span>🥩</span>
                        <strong>{toFa(nutrition.protein_grams)}</strong>
                        <span>پروتئین</span>
                      </div>
                      <div className="nutrition-stat">
                        <span>🍚</span>
                        <strong>{toFa(nutrition.carbs_grams)}</strong>
                        <span>کربوهیدرات</span>
                      </div>
                      <div className="nutrition-stat">
                        <span>🥑</span>
                        <strong>{toFa(nutrition.fat_grams)}</strong>
                        <span>چربی</span>
                      </div>
                      <div className="nutrition-stat">
                        <span>💧</span>
                        <strong>{toFa(nutrition.water_liters)}</strong>
                        <span>لیتر آب</span>
                      </div>
                    </div>

                    <div className="nutrition-section">
                      <h3 className="nutrition-section-title">
                        <span className="title-bar" />
                        🍽 وعده‌های غذایی
                      </h3>
                      <div className="meals-grid">
                        {nutrition.meals?.map((meal, i) => (
                          <motion.div
                            key={meal.id}
                            className="meal-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: i * 0.06 }}
                          >
                            <div className="meal-card-header">
                              <span className="meal-card-type">🍽 {meal.meal_type}</span>
                              {meal.time && (
                                <span className="meal-card-time">⏰ {meal.time}</span>
                              )}
                            </div>
                            <p className="meal-card-foods">{meal.foods}</p>
                            {meal.calories > 0 && (
                              <span className="meal-card-cal">
                                🔥 {toFa(meal.calories)} کالری
                              </span>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {nutrition.supplements?.length > 0 && (
                      <div className="nutrition-section">
                        <h3 className="nutrition-section-title">
                          <span className="title-bar" />
                          💊 مکمل‌ها و ویتامین‌ها
                        </h3>
                        <div className="supplements-grid">
                          {nutrition.supplements.map((supp, i) => (
                            <motion.div
                              key={supp.id}
                              className="supplement-card"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: i * 0.06 }}
                            >
                              <div className="supplement-card-icon">{supp.icon}</div>
                              <div className="supplement-card-info">
                                <div className="supplement-card-category">
                                  {categoryLabels[supp.category] || 'مکمل'}
                                </div>
                                <strong>{supp.name}</strong>
                                <span className="supplement-card-dosage">
                                  {supp.dosage} • {supp.timing}
                                </span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {nutrition.notes && (
                      <div className="nutrition-section">
                        <h3 className="nutrition-section-title">
                          <span className="title-bar" />
                          📝 یادداشت مربی
                        </h3>
                        <div className="nutrition-notes">{nutrition.notes}</div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {suggestedProducts.length > 0 && (
              <div className="plan-products">
                <h2 className="panel-title">
                  <span className="title-bar" />
                  🛒 محصولات پیشنهادی برای این برنامه
                </h2>
                <p className="plan-products-hint">
                  این محصولات به برنامه‌ی شما کمک می‌کنند
                </p>

                <div className="suggested-products-grid">
                  {suggestedProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      className="suggested-product-card"
                      whileHover={{ y: -5 }}
                    >
                      <div className="suggested-product-icon">{product.icon}</div>
                      <div className="suggested-product-info">
                        <strong>{product.title}</strong>
                        <span>{product.category}</span>
                        <div className="suggested-product-price">
                          {toFa(product.price)} تومان
                        </div>
                      </div>
                      <button
                        className={`add-to-cart-btn ${
                          addedIds.includes(product.id) ? 'added' : ''
                        }`}
                        onClick={() => handleAddProduct(product)}
                      >
                        {addedIds.includes(product.id) ? '✓ اضافه شد' : '🛒 افزودن'}
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </main>

      {activeExercise && (
        <ExerciseAnimator3D
          animationKey={activeExercise.exercise?.animation_key || 'default'}
          exerciseName={activeExercise.exercise?.name || 'حرکت'}
          onClose={() => setActiveExercise(null)}
        />
      )}
    </div>
  )
}

export default MyPlans