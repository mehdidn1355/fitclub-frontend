import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { coursesAPI } from '../api/endpoints'

function CourseDetails() {
  const { courseId } = useParams()
  const navigate = useNavigate()

  const [course, setCourse] = useState(null)
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const toFa = (n) => Number(n || 0).toLocaleString('fa-IR')

  // دریافت اطلاعات دوره + درس‌ها
  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true)
      setError(null)
      try {
        const [courseRes, lessonsRes] = await Promise.all([
          coursesAPI.get(courseId),
          coursesAPI.lessons(courseId),
        ])
        setCourse(courseRes.data)
        setLessons(lessonsRes.data)
      } catch (err) {
        console.error(err)
        setError('خطا در دریافت اطلاعات دوره')
      } finally {
        setLoading(false)
      }
    }
    fetchCourse()
  }, [courseId])

  if (loading) {
    return (
      <div className="courses-page">
        <main className="courses-main">
          <div className="loading-state">
            <div className="spinner" />
            <p>در حال بارگذاری دوره...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="courses-page">
        <main className="courses-main">
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <p>{error || 'دوره یافت نشد'}</p>
            <Link to="/courses" className="primary-button">
              بازگشت به دوره‌ها
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="courses-page">
      <main className="courses-main">
        <motion.div
          className="detail-wrapper"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Art */}
          <div className="course-detail-art">
            <div className="course-detail-hero">
              <span style={{ fontSize: '160px' }}>{course.icon}</span>
              {course.is_new && <span className="course-new-badge">جدید</span>}
              {course.is_bestseller && (
                <span className="course-best-badge">پرفروش</span>
              )}
            </div>

            <div className="course-detail-badges">
              <span>🎓 {toFa(course.lessons_count)} درس</span>
              <span>⏱ {course.duration}</span>
              <span>🏆 {course.level}</span>
            </div>
          </div>

          {/* Info */}
          <div className="detail-info">
            <span className="eyebrow">{course.category}</span>
            <h1>{course.title}</h1>

            <div className="detail-rating">
              ⭐ {course.rating}
              <span className="detail-reviews">
                ({toFa(course.students_count)} دانشجو)
              </span>
            </div>

            <p className="detail-desc">{course.description}</p>

            {/* Price */}
            <div className="course-price-box">
              {course.price_old && (
                <span className="course-price-old">
                  {toFa(course.price_old)} تومان
                </span>
              )}
              <strong className="course-price-big">
                {toFa(course.price)} تومان
              </strong>
              {course.price_old && (
                <span className="course-discount-badge">
                  ٪
                  {toFa(
                    Math.round(
                      ((course.price_old - course.price) / course.price_old) *
                        100
                    )
                  )}{' '}
                  تخفیف
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="detail-actions">
              <button
                className="primary-button"
                onClick={() => navigate(`/courses/${course.id}/player`)}
              >
                🎬 شروع دوره
              </button>
              <button className="secondary-button">🛒 افزودن به سبد</button>
            </div>

            {/* Features */}
            <div className="detail-features">
              <span>✅ دسترسی دائمی</span>
              <span>🎓 مدرک پایان دوره</span>
              <span>🔄 ضمانت بازگشت ۷ روزه</span>
              <span>💬 پشتیبانی آنلاین</span>
            </div>
          </div>
        </motion.div>

        {/* Lessons */}
        {lessons.length > 0 && (
          <motion.section
            className="lessons-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>محتوای دوره</h2>
            <p className="lessons-count">
              {toFa(lessons.length)} درس • {course.duration}
            </p>

            <div className="lessons-list">
              {lessons.map((lesson, i) => (
                <motion.div
                  key={lesson.id}
                  className={`lesson-item ${lesson.is_free ? 'free' : ''}`}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <div className="lesson-number">{toFa(i + 1)}</div>
                  <div className="lesson-info">
                    <strong>{lesson.title}</strong>
                    <span>⏱ {lesson.duration}</span>
                  </div>
                  <div className="lesson-status">
                    {lesson.is_free ? (
                      <span className="lesson-free-badge">
                        🎬 پیش‌نمایش رایگان
                      </span>
                    ) : (
                      <span className="lesson-lock">🔒</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </main>
    </div>
  )
}

export default CourseDetails