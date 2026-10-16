import { useState } from 'react'
import { motion } from 'framer-motion'

const ordersData = [
  { id: '100234', customer: 'محمد احمدی', total: '۲,۸۰۰,۰۰۰', status: 'pending', date: '۱۴۰۴/۰۲/۱۵', items: 3 },
  { id: '100233', customer: 'سارا رضایی', total: '۱,۲۴۰,۰۰۰', status: 'shipped', date: '۱۴۰۴/۰۲/۱۴', items: 2 },
  { id: '100232', customer: 'رضا کریمی', total: '۵,۶۰۰,۰۰۰', status: 'delivered', date: '۱۴۰۴/۰۲/۱۳', items: 5 },
  { id: '100231', customer: 'مریم احمدی', total: '۸۹۰,۰۰۰', status: 'delivered', date: '۱۴۰۴/۰۲/۱۲', items: 1 },
  { id: '100230', customer: 'حسین نوری', total: '۳,۴۵۰,۰۰۰', status: 'cancelled', date: '۱۴۰۴/۰۲/۱۱', items: 4 },
  { id: '100229', customer: 'زهرا صادقی', total: '۲,۱۰۰,۰۰۰', status: 'pending', date: '۱۴۰۴/۰۲/۱۰', items: 2 },
]

const statusLabels = {
  pending: { label: 'در انتظار', color: '#fbbf24', icon: '⏳' },
  shipped: { label: 'ارسال شده', color: '#22d3ee', icon: '🚚' },
  delivered: { label: 'تحویل شده', color: '#4ade80', icon: '✓' },
  cancelled: { label: 'لغو شده', color: '#ef4444', icon: '✕' },
}

const filterOptions = ['همه', 'در انتظار', 'ارسال شده', 'تحویل شده', 'لغو شده']

function AdminOrders() {
  const [activeFilter, setActiveFilter] = useState('همه')

  const filtered = ordersData.filter((o) => {
    if (activeFilter === 'همه') return true
    const key = Object.keys(statusLabels).find((k) => statusLabels[k].label === activeFilter)
    return o.status === key
  })

  return (
    <div className="courses-page">
      <main className="courses-main">
        <div className="courses-intro">
          <span className="eyebrow">پنل مدیریت</span>
          <h1>
            مدیریت <span>سفارش‌ها</span>
          </h1>
          <p>{ordersData.length.toLocaleString('fa-IR')} سفارش</p>
        </div>

        <div className="course-filters admin-filters">
          {filterOptions.map((f) => (
            <button
              key={f}
              className={`course-filter ${activeFilter === f ? 'active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="orders-table">
          <div className="orders-table-header">
            <span>شماره</span>
            <span>مشتری</span>
            <span>تعداد</span>
            <span>مبلغ</span>
            <span>وضعیت</span>
            <span>تاریخ</span>
            <span>عملیات</span>
          </div>

          {filtered.map((order, i) => {
            const status = statusLabels[order.status]
            return (
              <motion.div
                key={order.id}
                className="orders-table-row"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <span className="order-id">#{order.id}</span>
                <strong>{order.customer}</strong>
                <span>{order.items.toLocaleString('fa-IR')} کالا</span>
                <span className="order-total">{order.total} تومان</span>
                <span
                  className="order-status"
                  style={{
                    color: status.color,
                    background: `${status.color}15`,
                    borderColor: `${status.color}40`,
                  }}
                >
                  {status.icon} {status.label}
                </span>
                <span className="order-date">{order.date}</span>
                <div className="member-actions">
                  <button className="member-action-btn" title="مشاهده">👁</button>
                  <button className="member-action-btn" title="ویرایش">✏️</button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </main>
    </div>
  )
}

export default AdminOrders