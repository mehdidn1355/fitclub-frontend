import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import CinematicTrainerPanel from '../components/three/CinematicTrainerPanel'

const stats = [
  { label: 'شاگردان فعال', value: '۲۴', icon: '👥', color: '#c5f36b' },
  { label: 'رزرو این هفته', value: '۱۸', icon: '📅', color: '#4ade80' },
  { label: 'برنامه‌های فعال', value: '۳۲', icon: '📋', color: '#fbbf24' },
  { label: 'درآمد این ماه', value: '۲۴.۵M', icon: '💰', color: '#22d3ee' },
]

const quickActions = [
  {
    icon: '📥',
    title: 'درخواست‌های دریافتی',
    desc: 'درخواست‌های شاگردان برای برنامه‌ی اختصاصی',
    link: '/trainer/requests',
    color: '#22d3ee',
  },
  {
    icon: '👥',
    title: 'شاگردان من',
    desc: 'لیست شاگردان و پیشرفت آن‌ها',
    link: '/trainer/students',
    color: '#4ade80',
  },
  {
    icon: '📅',
    title: 'زمان‌های آزاد',
    desc: 'مدیریت زمان‌های قابل رزرو',
    link: '/trainer/schedule',
    color: '#fbbf24',
  },
  {
    icon: '🎓',
    title: 'دوره‌های من',
    desc: 'مدیریت دوره‌های آموزشی',
    link: '/trainer/courses',
    color: '#c5f36b',
  },
]

const recentBookings = [
  { name: 'محمد احمدی', time: 'امروز ۱۴:۳۰', type: 'تمرین بدنسازی', avatar: '💪' },
  { name: 'سارا رضایی', time: 'امروز ۱۶:۰۰', type: 'یوگا', avatar: '🧘' },
  { name: 'رضا کریمی', time: 'فردا ۱۰:۰۰', type: 'کراس‌فیت', avatar: '🔥' },
  { name: 'مریم احمدی', time: 'فردا ۱۵:۳۰', type: 'مشاوره تغذیه', avatar: '🥗' },
]

function TrainerPanel() {
  return (
    <div className="courses-page">
      {/* ===== Hero با 3D ===== */}
      <section className="hero-section">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="hero-badge">👨‍🏫 پنل مربی</span>
          <h1>
            سلام، <span>مربی</span> عزیز 👋
          </h1>
          <p>
            امروز ۱۸ رزرو داری. بیا با هم یه نگاه به برنامه‌ی امروزت بندازیم.
          </p>
          <div className="hero-actions">
            <Link to="/trainer/students" className="primary-button">
              مشاهده شاگردان
            </Link>
            <Link to="/trainer/workout/new" className="secondary-button">
              برنامه‌ی جدید +
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <CinematicTrainerPanel />
        </motion.div>
      </section>

      {/* ===== Stats ===== */}
      <section className="courses-main">
        <div className="stats-grid">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="stat-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="stat-icon" style={{ color: stat.color }}>
                {stat.icon}
              </div>
              <div className="stat-value" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* ===== Quick Actions ===== */}
        <div className="panel-section">
          <h2 className="panel-title">
            <span className="title-bar" />
            دسترسی سریع
          </h2>

          <div className="quick-actions-grid">
            {quickActions.map((action, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link to={action.link} className="quick-action-card">
                  <div className="quick-action-icon" style={{ color: action.color }}>
                    {action.icon}
                  </div>
                  <div className="quick-action-content">
                    <h3>{action.title}</h3>
                    <p>{action.desc}</p>
                  </div>
                  <div className="quick-action-arrow">←</div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ===== Recent Bookings ===== */}
        <div className="panel-section">
          <div className="panel-title-row">
            <h2 className="panel-title">
              <span className="title-bar" />
              رزروهای اخیر
            </h2>
            <Link to="/trainer/schedule" className="view-all-link">
              مشاهده همه ←
            </Link>
          </div>

          <div className="bookings-list">
            {recentBookings.map((booking, i) => (
              <motion.div
                key={i}
                className="booking-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <div className="booking-avatar">{booking.avatar}</div>
                <div className="booking-info">
                  <strong>{booking.name}</strong>
                  <span>{booking.type}</span>
                </div>
                <div className="booking-time">
                  <span>⏰ {booking.time}</span>
                </div>
                <button className="booking-action">تایید</button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default TrainerPanel