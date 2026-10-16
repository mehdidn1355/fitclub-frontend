import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { plansAPI, nutritionAPI } from '../api/endpoints'

const typeLabels = { online: 'آنلاین', in_person: 'حضوری' }
const locationLabels = { home: 'خانه', gym: 'باشگاه' }
const equipmentLabels = {
  none: 'بدون وسایل',
  basic: 'وسایل ساده',
  full: 'وسایل کامل',
}

function TrainerRequests() {
  const [requests, setRequests] = useState([])
  const [nutritionPlans, setNutritionPlans] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const toFa = (n) => Number(n || 0).toLocaleString('fa-IR')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const { data } = await plansAPI.incoming()
        setRequests(data)

        // برای هر درخواست، چک کن برنامه‌ی غذایی داره یا نه
        const nutritionMap = {}
        for (const req of data) {
          try {
            const res = await nutritionAPI.customer(req.customer_id)
            nutritionMap[req.customer_id] = res.data
          } catch (err) {
            nutritionMap[req.customer_id] = null
          }
        }
        setNutritionPlans(nutritionMap)
      } catch (err) {
        console.error(err)
        setError('خطا در دریافت درخواست‌ها')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="courses-page">
      <main className="courses-main">
        <div className="courses-intro">
          <span className="eyebrow">پنل مربی</span>
          <h1>
            درخواست‌های <span>دریافتی</span>
          </h1>
          <p>
            {loading
              ? 'در حال بارگذاری...'
              : `${toFa(requests.length)} درخواست`}
          </p>
        </div>

        {loading && (
          <div className="loading-state">
            <div className="spinner" />
            <p>در حال بارگذاری درخواست‌ها...</p>
          </div>
        )}

        {error && !loading && (
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && requests.length === 0 && (
          <div className="empty-cart">
            <div className="empty-cart-icon">📭</div>
            <h1>هنوز درخواستی نداری!</h1>
            <p>وقتی کاربری درخواست بده، اینجا نمایش داده می‌شه.</p>
          </div>
        )}

        {!loading && !error && requests.length > 0 && (
          <div className="requests-grid">
            {requests.map((req, i) => {
              const hasItems = req.items && req.items.length > 0
              const hasNutrition = !!nutritionPlans[req.customer_id]

              return (
                <motion.div
                  key={req.id}
                  className="request-card"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="request-header">
                    <span className="request-id">#{toFa(req.id)}</span>
                    <span
                      className={`request-status ${
                        hasItems ? 'ready' : 'pending'
                      }`}
                    >
                      {hasItems ? '✓ آماده' : '⏳ در انتظار'}
                    </span>
                  </div>

                  <h3 className="request-title">{req.title}</h3>
                  <p className="request-desc">
                    {req.description || 'بدون توضیحات'}
                  </p>

                  <div className="request-info">
                    <div className="request-info-item">
                      <span>🎯 نواحی بدن:</span>
                      <strong>
                        {req.body_focus?.split(',').join('، ') || '-'}
                      </strong>
                    </div>
                    <div className="request-info-item">
                      <span>🎥 نوع آموزش:</span>
                      <strong>{typeLabels[req.training_type]}</strong>
                    </div>
                    <div className="request-info-item">
                      <span>📍 محیط:</span>
                      <strong>{locationLabels[req.location]}</strong>
                    </div>
                    <div className="request-info-item">
                      <span>🛠 وسایل:</span>
                      <strong>{equipmentLabels[req.equipment]}</strong>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="request-badges">
                    <span
                      className={`mini-badge ${hasItems ? 'done' : 'pending'}`}
                    >
                      {hasItems ? '✓' : '⏳'} برنامه‌ی تمرینی
                    </span>
                    <span
                      className={`mini-badge ${
                        hasNutrition ? 'done' : 'pending'
                      }`}
                    >
                      {hasNutrition ? '✓' : '⏳'} برنامه‌ی غذایی
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="request-actions-stack">
                    {/* برنامه‌ی تمرینی */}
                    <Link
                      to={`/trainer/plan/${req.id}`}
                      className="primary-button request-action"
                    >
                      {hasItems ? '✏️ ویرایش برنامه‌ی تمرینی' : '💪 ساخت برنامه‌ی تمرینی'}
                    </Link>

                    {/* برنامه‌ی غذایی */}
                    <Link
                      to={`/trainer/nutrition/${req.id}`}
                      className="nutrition-button"
                    >
                      {hasNutrition
                        ? '✏️ ویرایش برنامه‌ی غذایی'
                        : '🍎 ساخت برنامه‌ی غذایی'}
                    </Link>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

export default TrainerRequests