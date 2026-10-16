import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import CinematicTrainer from '../components/three/CinematicTrainer'
import { usersAPI } from '../api/endpoints'

function Trainers() {
  const [trainers, setTrainers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const toFa = (n) => Number(n || 0).toLocaleString('fa-IR')

  useEffect(() => {
    const fetchTrainers = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data } = await usersAPI.trainers()
        setTrainers(data)
      } catch (err) {
        console.error(err)
        setError('خطا در دریافت مربیان')
      } finally {
        setLoading(false)
      }
    }
    fetchTrainers()
  }, [])

  return (
    <div className="courses-page">
      {/* Hero 3D */}
      <section className="hero-section">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="hero-badge">👨‍🏫 تیم حرفه‌ای</span>
          <h1>
            مربیان <span>FitClub</span>
          </h1>
          <p>
            با بهترین مربیان ایران تمرین کن و به اهدافت برس.
          </p>
          <div className="hero-actions">
            <a href="#trainers-list" className="primary-button">
              مشاهده مربیان
            </a>
          </div>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <CinematicTrainer />
        </motion.div>
      </section>

      {/* List */}
      <section className="courses-main" id="trainers-list">
        <div className="courses-intro">
          <span className="eyebrow">تیم ما</span>
          <h1>
            همه‌ی <span>مربیان</span>
          </h1>
          <p>
            {loading
              ? 'در حال بارگذاری...'
              : `${toFa(trainers.length)} مربی`}
          </p>
        </div>

        {loading && (
          <div className="loading-state">
            <div className="spinner" />
            <p>در حال بارگذاری مربیان...</p>
          </div>
        )}

        {error && !loading && (
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="course-grid">
            {trainers.length === 0 ? (
              <p className="courses-empty">مربی‌ای یافت نشد.</p>
            ) : (
              trainers.map((trainer, i) => (
                <motion.article
                  key={trainer.id}
                  className="course-card"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  whileHover={{ y: -8 }}
                >
                  <div className="course-art">
                    <span className="course-icon">{trainer.avatar}</span>
                    {trainer.rating > 0 && (
                      <span className="course-level">
                        ⭐ {toFa(trainer.rating)}
                      </span>
                    )}
                  </div>
                  <div className="course-info">
                    <span className="course-category">
                      {trainer.specialty || 'مربی'}
                    </span>
                    <h2>{trainer.full_name}</h2>
                    <p>{trainer.bio || 'مربی حرفه‌ای FitClub.'}</p>
                    <div className="course-meta">
                      <span>
                        🎯 {toFa(trainer.sessions_count)} جلسه
                      </span>
                      <strong>⭐ {toFa(trainer.rating)}</strong>
                    </div>
                    <Link
                      to={`/trainers/${trainer.id}`}
                      className="course-button"
                    >
                      مشاهده پروفایل
                    </Link>
                  </div>
                </motion.article>
              ))
            )}
          </div>
        )}
      </section>
    </div>
  )
}

export default Trainers