import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function TrainerDetail() {
  const { trainerId } = useParams()

  return (
    <div className="courses-page">
      <main className="courses-main">
        <motion.div
          className="detail-wrapper"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="detail-art">
            <span style={{ fontSize: '120px' }}>💪</span>
          </div>

          <div className="detail-info">
            <span className="eyebrow">مربی حرفه‌ای</span>
            <h1>مربی #{trainerId}</h1>
            <div className="detail-rating">⭐ ۴.۹ (۸۹ نظر)</div>
            <p className="detail-desc">
              با بیش از ۱۰ سال تجربه در زمینه‌ی بدنسازی و فیتنس، آماده‌ی
              کمک به شما برای رسیدن به اهداف ورزشی‌تان هستم.
            </p>

            <div className="detail-tags">
              <span>🏋️ بدنسازی</span>
              <span>💪 فیتنس</span>
              <span>🥗 تغذیه</span>
            </div>

            <div className="detail-actions">
              <button className="primary-button">رزرو نوبت 📅</button>
              <Link to="/trainers" className="secondary-button">بازگشت</Link>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

export default TrainerDetail