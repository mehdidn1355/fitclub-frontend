import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import CinematicAdmin from '../components/three/CinematicAdmin'
import StatsCard from '../components/admin/StatsCard'
import RevenueChart from '../components/admin/RevenueChart'
import RecentActivity from '../components/admin/RecentActivity'
import { adminAPI } from '../api/endpoints'

const managementCards = [
  { icon: '👥', title: 'اعضا', desc: 'مدیریت اعضای باشگاه', link: '/admin/members', color: '#c5f36b' },
  { icon: '👨‍🏫', title: 'مربیان', desc: 'مدیریت تیم مربیان', link: '/admin/trainers', color: '#4ade80' },
  { icon: '🛒', title: 'سفارش‌ها', desc: 'مدیریت سفارش‌های فروشگاه', link: '/admin/orders', color: '#fbbf24' },
  { icon: '📊', title: 'گزارش‌ها', desc: 'مشاهده‌ی گزارش‌های تحلیلی', link: '/admin/reports', color: '#22d3ee' },
]

function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const toFa = (n) => Number(n || 0).toLocaleString('fa-IR')

  const formatBigNumber = (n) => {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
    return toFa(n)
  }

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data } = await adminAPI.stats()
        setStats(data)
      } catch (err) {
        console.error(err)
        setError('خطا در دریافت آمار. لطفاً مطمئن شو ادمین هستی.')
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  // داده‌های نمایشی
  const statsCards = stats
    ? [
        {
          icon: '👥',
          label: 'اعضای فعال',
          value: toFa(stats.total_members),
          change: 12,
          color: '#c5f36b',
        },
        {
          icon: '💰',
          label: 'درآمد کل',
          value: formatBigNumber(stats.total_revenue),
          change: 18,
          color: '#4ade80',
        },
        {
          icon: '🛒',
          label: 'سفارش‌ها',
          value: toFa(stats.total_orders),
          change: -3,
          color: '#fbbf24',
        },
        {
          icon: '📅',
          label: 'رزروها',
          value: toFa(stats.total_bookings),
          change: 8,
          color: '#22d3ee',
        },
      ]
    : [
        { icon: '👥', label: 'اعضای فعال', value: '...', color: '#c5f36b' },
        { icon: '💰', label: 'درآمد کل', value: '...', color: '#4ade80' },
        { icon: '🛒', label: 'سفارش‌ها', value: '...', color: '#fbbf24' },
        { icon: '📅', label: 'رزروها', value: '...', color: '#22d3ee' },
      ]

  return (
    <div className="courses-page">
      {/* Hero */}
      <section className="hero-section">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="hero-badge">👑 پنل مدیریت</span>
          <h1>
            داشبورد <span>مدیریت</span> FitClub
          </h1>
          <p>
            همه‌چیز درباره‌ی باشگاه، اعضا، فروش و رزروها — در یک نگاه.
          </p>
          <div className="hero-actions">
            <Link to="/admin/reports" className="primary-button">
              گزارش‌های تحلیلی
            </Link>
            <Link to="/admin/members" className="secondary-button">
              مدیریت اعضا
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <CinematicAdmin />
        </motion.div>
      </section>

      {/* Main */}
      <section className="courses-main">
        {loading && (
          <div className="loading-state">
            <div className="spinner" />
            <p>در حال بارگذاری آمار...</p>
          </div>
        )}

        {error && !loading && (
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Stats */}
            <div className="admin-stats-grid">
              {statsCards.map((stat, i) => (
                <StatsCard key={i} {...stat} index={i} />
              ))}
            </div>

            {/* Chart + Activity */}
            <div className="admin-dashboard-grid">
              <motion.div
                className="admin-panel"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="admin-panel-header">
                  <h3>
                    <span className="title-bar" />
                    نمودار درآمد ۶ ماه اخیر
                  </h3>
                  <div className="chart-total">
                    <span>مجموع:</span>
                    <strong>{toFa(stats?.total_revenue || 0)} تومان</strong>
                  </div>
                </div>
                <RevenueChart />
              </motion.div>

              <motion.div
                className="admin-panel"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div className="admin-panel-header">
                  <h3>
                    <span className="title-bar" />
                    فعالیت‌های اخیر
                  </h3>
                  <Link to="/admin/orders" className="view-all-link">
                    مشاهده همه ←
                  </Link>
                </div>
                <RecentActivity />
              </motion.div>
            </div>

            {/* Management Cards */}
            <div className="panel-section">
              <h2 className="panel-title">
                <span className="title-bar" />
                مدیریت
              </h2>

              <div className="admin-management-grid">
                {managementCards.map((card, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <Link to={card.link} className="admin-management-card">
                      <div
                        className="admin-management-icon"
                        style={{ color: card.color }}
                      >
                        {card.icon}
                      </div>
                      <div className="admin-management-content">
                        <h3>{card.title}</h3>
                        <p>{card.desc}</p>
                      </div>
                      <div className="quick-action-arrow">←</div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  )
}

export default AdminDashboard