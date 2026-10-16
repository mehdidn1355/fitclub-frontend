import { motion } from 'framer-motion'

const trainersData = [
  { id: 1, name: 'علی رضایی', specialty: 'بدنسازی', students: 24, rating: 4.9, status: 'active', avatar: '💪' },
  { id: 2, name: 'سارا محمدی', specialty: 'یوگا', students: 18, rating: 4.8, status: 'active', avatar: '🧘' },
  { id: 3, name: 'رضا کریمی', specialty: 'کراس‌فیت', students: 32, rating: 4.7, status: 'active', avatar: '🔥' },
  { id: 4, name: 'مریم احمدی', specialty: 'تغذیه', students: 12, rating: 5.0, status: 'active', avatar: '🥗' },
  { id: 5, name: 'حسین نوری', specialty: 'بدنسازی', students: 40, rating: 4.9, status: 'pending', avatar: '🏋️' },
  { id: 6, name: 'زهرا صادقی', specialty: 'کاهش وزن', students: 15, rating: 4.8, status: 'active', avatar: '⚖️' },
]

function AdminTrainers() {
  return (
    <div className="courses-page">
      <main className="courses-main">
        <div className="courses-intro">
          <span className="eyebrow">پنل مدیریت</span>
          <h1>
            مدیریت <span>مربیان</span>
          </h1>
          <p>{trainersData.length.toLocaleString('fa-IR')} مربی</p>
        </div>

        <div className="my-courses-actions">
          <button className="primary-button">+ افزودن مربی جدید</button>
        </div>

        <div className="students-grid">
          {trainersData.map((trainer, i) => (
            <motion.div
              key={trainer.id}
              className="student-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -8 }}
            >
              <div className="student-header">
                <div className="student-avatar">{trainer.avatar}</div>
                <div>
                  <h3>{trainer.name}</h3>
                  <span className="student-level">{trainer.specialty}</span>
                </div>
              </div>

              <div className="student-footer" style={{ borderTop: 'none', paddingTop: 0 }}>
                <div className="student-stat">👥 {trainer.students} شاگرد</div>
                <div className="student-stat">⭐ {trainer.rating}</div>
              </div>

              <div className={`member-status ${trainer.status === 'active' ? 'active' : 'pending'}`} style={{ display: 'block', textAlign: 'center', marginBottom: '15px' }}>
                {trainer.status === 'active' ? '✓ فعال' : '⏳ در انتظار'}
              </div>

              <div className="student-actions">
                <button className="student-btn primary">ویرایش</button>
                <button className="student-btn">مشاهده</button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default AdminTrainers