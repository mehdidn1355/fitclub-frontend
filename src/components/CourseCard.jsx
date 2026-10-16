import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function CourseCard({ course, index = 0 }) {
  const toFa = (n) => Number(n).toLocaleString('fa-IR')

  return (
    <motion.article
      className="course-card"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -8 }}
    >
      <div className="course-art">
        <span className="course-icon">{course.icon}</span>
        <span className="course-level">{course.level}</span>
        {course.is_new && (
          <span className="course-new-badge">جدید</span>
        )}
        {course.is_bestseller && (
          <span className="course-best-badge">پرفروش</span>
        )}
      </div>

      <div className="course-info">
        <span className="course-category">{course.category}</span>
        <h2>{course.title}</h2>
        <p>{course.description}</p>

        <div className="course-meta">
          <span>⏱ {course.duration}</span>
          <span>🎓 {toFa(course.lessons_count)} درس</span>
        </div>

        <div className="course-footer">
          <div className="course-price">
            {course.price_old && (
              <span className="course-price-old">
                {toFa(course.price_old)} تومان
              </span>
            )}
            <strong>{toFa(course.price)} تومان</strong>
          </div>

          <Link to={`/courses/${course.id}`} className="course-button">
            مشاهده دوره ←
          </Link>
        </div>

        {course.rating > 0 && (
          <div className="course-rating">
            <span>⭐ {course.rating}</span>
            <span className="course-students">
              {toFa(course.students_count)} دانشجو
            </span>
          </div>
        )}
      </div>
    </motion.article>
  )
}