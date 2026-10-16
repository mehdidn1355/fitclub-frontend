import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { adminAPI } from '../api/endpoints'
import LineChart from '../components/charts/LineChart'
import BarChart from '../components/charts/BarChart'
import DonutChart from '../components/charts/DonutChart'

const categoryLabels = {
  bronze: 'برنزی',
  silver: 'نقره‌ای',
  gold: 'طلایی',
}

const statusLabels = {
  pending: 'در انتظار',
  shipped: 'ارسال شده',
  delivered: 'تحویل شده',
  cancelled: 'لغو شده',
}

const statusColors = {
  pending: '#fbbf24',
  shipped: '#22d3ee',
  delivered: '#4ade80',
  cancelled: '#ef4444',
}

const planColors = {
  bronze: '#ea580c',
  silver: '#d1d5db',
  gold: '#fbbf24',
}

function AdminReports() {
  const [stats, setStats] = useState(null)
  const [revenueData, setRevenueData] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [topTrainers, setTopTrainers] = useState([])
  const [customerStats, setCustomerStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const toFa = (n) => Number(n || 0).toLocaleString('fa-IR')

  const formatBigNumber = (n) => {
    if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'B'
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
    return toFa(n)
  }

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      setError(null)
      try {
        const [statsRes, revenueRes, productsRes, trainersRes, customerRes] =
          await Promise.all([
            adminAPI.stats(),
            adminAPI.revenueChart(),
            adminAPI.topProducts(5),
            adminAPI.topTrainers(),
            adminAPI.customerStats(),
          ])

        setStats(statsRes.data)
        setRevenueData(revenueRes.data)
        setTopProducts(productsRes.data)
        setTopTrainers(trainersRes.data)
        setCustomerStats(customerRes.data)
      } catch (err) {
        console.error(err)
        setError('خطا در دریافت گزارش‌ها')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  if (loading) {
    return (
      <div className="courses-page">
        <main className="courses-main">
          <div className="loading-state">
            <div className="spinner" />
            <p>در حال بارگذاری گزارش‌ها...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="courses-page">
        <main className="courses-main">
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <p>{error}</p>
          </div>
        </main>
      </div>
    )
  }

  // آماده‌سازی داده‌های نمودار
  const revenueChartData = revenueData.map((r) => ({
    label: r.label,
    value: r.revenue,
  }))

  const ordersChartData = revenueData.map((r) => ({
    label: r.label,
    value: r.orders,
  }))

  const planDonutData = customerStats
    ? Object.entries(customerStats.plan_distribution).map(([key, value]) => ({
        label: categoryLabels[key] || key,
        value: value,
        color: planColors[key] || '#c5f36b',
      }))
    : []

  const statusDonutData = customerStats
    ? Object.entries(customerStats.order_statuses)
        .filter(([_, v]) => v > 0)
        .map(([key, value]) => ({
          label: statusLabels[key] || key,
          value: value,
          color: statusColors[key] || '#c5f36b',
        }))
    : []

  return (
    <div className="courses-page">
      <main className="courses-main">
        {/* Header */}
        <div className="courses-intro">
          <span className="eyebrow">پنل مدیریت</span>
          <h1>
            گزارش‌های <span>تحلیلی</span>
          </h1>
          <p>مروری بر عملکرد باشگاه</p>
        </div>

        {/* KPI Cards */}
        <div className="admin-stats-grid">
          <motion.div
            className="admin-stat-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="admin-stat-top">
              <div className="admin-stat-icon" style={{ color: '#c5f36b' }}>
                💰
              </div>
            </div>
            <div className="admin-stat-value" style={{ color: '#c5f36b' }}>
              {formatBigNumber(stats.total_revenue)}
            </div>
            <div className="admin-stat-label">درآمد کل</div>
            <div className="admin-stat-unit">تومان</div>
            <div
              className="admin-stat-glow"
              style={{ background: '#c5f36b' }}
            />
          </motion.div>

          <motion.div
            className="admin-stat-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="admin-stat-top">
              <div className="admin-stat-icon" style={{ color: '#4ade80' }}>
                🛒
              </div>
            </div>
            <div className="admin-stat-value" style={{ color: '#4ade80' }}>
              {toFa(stats.total_orders)}
            </div>
            <div className="admin-stat-label">کل سفارش‌ها</div>
            <div
              className="admin-stat-glow"
              style={{ background: '#4ade80' }}
            />
          </motion.div>

          <motion.div
            className="admin-stat-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="admin-stat-top">
              <div className="admin-stat-icon" style={{ color: '#fbbf24' }}>
                👥
              </div>
            </div>
            <div className="admin-stat-value" style={{ color: '#fbbf24' }}>
              {toFa(stats.total_members)}
            </div>
            <div className="admin-stat-label">اعضای فعال</div>
            <div
              className="admin-stat-glow"
              style={{ background: '#fbbf24' }}
            />
          </motion.div>

          <motion.div
            className="admin-stat-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="admin-stat-top">
              <div className="admin-stat-icon" style={{ color: '#22d3ee' }}>
                📊
              </div>
            </div>
            <div className="admin-stat-value" style={{ color: '#22d3ee' }}>
              {formatBigNumber(stats.month_revenue)}
            </div>
            <div className="admin-stat-label">درآمد این ماه</div>
            <div className="admin-stat-unit">تومان</div>
            <div
              className="admin-stat-glow"
              style={{ background: '#22d3ee' }}
            />
          </motion.div>
        </div>

        {/* Today Stats */}
        <div className="admin-panel" style={{ marginBottom: '25px' }}>
          <div className="admin-panel-header">
            <h3>
              <span className="title-bar" />
              📅 آمار امروز
            </h3>
          </div>
          <div className="today-stats-grid">
            <div className="today-stat">
              <span>🛒 سفارش امروز</span>
              <strong>{toFa(stats.today_orders)}</strong>
            </div>
            <div className="today-stat">
              <span>💰 درآمد امروز</span>
              <strong>{toFa(stats.today_revenue)} تومان</strong>
            </div>
            <div className="today-stat">
              <span>📋 برنامه‌های تمرینی</span>
              <strong>{toFa(stats.total_plans)}</strong>
            </div>
            <div className="today-stat">
              <span>🍎 برنامه‌های غذایی</span>
              <strong>{toFa(stats.total_nutrition)}</strong>
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="admin-panel" style={{ marginBottom: '25px' }}>
          <div className="admin-panel-header">
            <h3>
              <span className="title-bar" />
              💹 درآمد ۱۲ ماه اخیر
            </h3>
            <div className="chart-total">
              <span>مجموع:</span>
              <strong>{formatBigNumber(stats.total_revenue)} تومان</strong>
            </div>
          </div>
          <LineChart
            data={revenueChartData}
            height={300}
            formatValue={(v) => formatBigNumber(v)}
          />
        </div>

        {/* Orders Chart */}
        <div className="admin-panel" style={{ marginBottom: '25px' }}>
          <div className="admin-panel-header">
            <h3>
              <span className="title-bar" />
              📦 تعداد سفارش‌ها ۱۲ ماه اخیر
            </h3>
            <div className="chart-total">
              <span>مجموع:</span>
              <strong>{toFa(stats.total_orders)} سفارش</strong>
            </div>
          </div>
          <BarChart
            data={ordersChartData}
            height={280}
            formatValue={(v) => toFa(Math.round(v))}
          />
        </div>

        {/* Two Donuts */}
        <div className="admin-dashboard-grid" style={{ marginBottom: '25px' }}>
          <div className="admin-panel">
            <div className="admin-panel-header">
              <h3>
                <span className="title-bar" />
                👥 توزیع پلن‌ها
              </h3>
            </div>
            <DonutChart data={planDonutData} />
          </div>

          <div className="admin-panel">
            <div className="admin-panel-header">
              <h3>
                <span className="title-bar" />
                📊 وضعیت سفارش‌ها
              </h3>
            </div>
            {statusDonutData.length > 0 ? (
              <DonutChart data={statusDonutData} />
            ) : (
              <p
                style={{
                  color: '#858a7d',
                  textAlign: 'center',
                  padding: '60px 20px',
                }}
              >
                هنوز سفارشی ثبت نشده
              </p>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="admin-panel" style={{ marginBottom: '25px' }}>
          <div className="admin-panel-header">
            <h3>
              <span className="title-bar" />
              🏆 پرفروش‌ترین محصولات
            </h3>
          </div>

          {topProducts.length === 0 ? (
            <p
              style={{
                color: '#858a7d',
                textAlign: 'center',
                padding: '40px',
              }}
            >
              هنوز فروشی ثبت نشده
            </p>
          ) : (
            <div className="top-products-list">
              {topProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  className="top-product-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <span className="top-product-rank">{toFa(i + 1)}</span>
                  <span className="top-product-icon">{product.icon}</span>
                  <strong className="top-product-name">{product.title}</strong>
                  <span className="top-product-sales">
                    {toFa(product.sold)} فروش
                  </span>
                  <span className="top-product-revenue">
                    {formatBigNumber(product.revenue)} تومان
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Top Trainers */}
        <div className="admin-panel">
          <div className="admin-panel-header">
            <h3>
              <span className="title-bar" />
              ⭐ بهترین مربیان
            </h3>
          </div>

          <div className="top-trainers-grid">
            {topTrainers.map((trainer, i) => (
              <motion.div
                key={trainer.id}
                className="top-trainer-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <div className="top-trainer-rank">#{toFa(i + 1)}</div>
                <div className="top-trainer-avatar">{trainer.avatar}</div>
                <strong>{trainer.name}</strong>
                <span className="top-trainer-specialty">
                  {trainer.specialty}
                </span>
                <div className="top-trainer-stats">
                  <span>📋 {toFa(trainer.plans_count)}</span>
                  <span>🍎 {toFa(trainer.nutrition_count)}</span>
                  <span>⭐ {toFa(trainer.rating)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminReports