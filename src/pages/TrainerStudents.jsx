import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const students = [
  { id: 1, name: 'محمد احمدی', goal: 'افزایش حجم', progress: 75, sessions: 24, avatar: '💪', level: 'حرفه‌ای', nextSession: 'امروز ۱۴:۳۰' },
  { id: 2, name: 'سارا رضایی', goal: 'کاهش وزن', progress: 60, sessions: 18, avatar: '🧘', level: 'متوسط', nextSession: 'امروز ۱۶:۰۰' },
  { id: 3, name: 'رضا کریمی', goal: 'قدرت و استقامت', progress: 85, sessions: 32, avatar: '🔥', level: 'حرفه‌ای', nextSession: 'فردا ۱۰:۰۰' },
  { id: 4, name: 'مریم احمدی', goal: 'تناسب اندام', progress: 45, sessions: 12, avatar: '🥗', level: 'مبتدی', nextSession: 'فردا ۱۵:۳۰' },
  { id: 5, name: 'حسین نوری', goal: 'افزایش حجم', progress: 90, sessions: 40, avatar: '🏋️', level: 'حرفه‌ای', nextSession: 'پس‌فردا ۰۹:۰۰' },
  { id: 6, name: 'زهرا صادقی', goal: 'کاهش وزن', progress: 55, sessions: 15, avatar: '⚖️', level: 'متوسط', nextSession: 'پس‌فردا ۱۱:۰۰' },
]

function TrainerStudents() {
  return (
    <div className="courses-page">
      <main className="courses-main">
        <div className="courses-intro">
          <span className="eyebrow">پنل مربی</span>
          <h1>
            شاگردان <span>من</span>
          </h1>
          <p>{students.length.toLocaleString('fa-IR')} شاگرد فعال</p>
        </div>

        <div className="students-grid">
          {students.map((student, i) => (
            <motion.div
              key={student.id}
              className="student-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -8 }}
            >
              <div className="student-header">
                <div className="student-avatar">{student.avatar}</div>
                <div>
                  <h3>{student.name}</h3>
                  <span className="student-level">{student.level}</span>
                </div>
              </div>

              <div className="student-goal">
                <span>🎯 هدف:</span>
                <strong>{student.goal}</strong>
              </div>

              <div className="student-progress">
                <div className="progress-info">
                  <span>پیشرفت</span>
                  <strong>{student.progress.toLocaleString('fa-IR')}٪</strong>
                </div>
                <div className="progress-bar">
                  <motion.div
                    className="progress-fill"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${student.progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 + i * 0.08 }}
                  />
                </div>
              </div>

              <div className="student-footer">
                <div className="student-stat">
                  <span>📅 {student.sessions} جلسه</span>
                </div>
                <div className="student-stat">
                  <span>⏰ {student.nextSession}</span>
                </div>
              </div>

              <div className="student-actions">
                <button className="student-btn primary">مشاهده پروفایل</button>
                <button className="student-btn">برنامه‌ی تمرینی</button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default TrainerStudents