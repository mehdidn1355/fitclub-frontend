import { useState } from 'react'
import { motion } from 'framer-motion'

const membersData = [
  { id: 1, name: 'محمد احمدی', email: 'm.ahmadi@mail.com', plan: 'طلایی', status: 'active', joined: '۱۴۰۳/۰۵/۱۲', avatar: '💪' },
  { id: 2, name: 'سارا رضایی', email: 's.rezaei@mail.com', plan: 'نقره‌ای', status: 'active', joined: '۱۴۰۳/۰۶/۰۳', avatar: '🧘' },
  { id: 3, name: 'رضا کریمی', email: 'r.karimi@mail.com', plan: 'طلایی', status: 'active', joined: '۱۴۰۳/۰۴/۲۱', avatar: '🔥' },
  { id: 4, name: 'مریم احمدی', email: 'm.ahmadi2@mail.com', plan: 'برنزی', status: 'pending', joined: '۱۴۰۴/۰۱/۱۵', avatar: '🥗' },
  { id: 5, name: 'حسین نوری', email: 'h.nouri@mail.com', plan: 'طلایی', status: 'active', joined: '۱۴۰۳/۰۸/۰۹', avatar: '🏋️' },
  { id: 6, name: 'زهرا صادقی', email: 'z.sadeghi@mail.com', plan: 'نقره‌ای', status: 'inactive', joined: '۱۴۰۲/۱۱/۲۸', avatar: '⚖️' },
]

const filters = ['همه', 'فعال', 'در انتظار', 'غیرفعال']

function AdminMembers() {
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('همه')

  const filtered = membersData.filter((m) => {
    const matchSearch = m.name.includes(search) || m.email.includes(search)
    const matchFilter =
      activeFilter === 'همه' ||
      (activeFilter === 'فعال' && m.status === 'active') ||
      (activeFilter === 'در انتظار' && m.status === 'pending') ||
      (activeFilter === 'غیرفعال' && m.status === 'inactive')
    return matchSearch && matchFilter
  })

  return (
    <div className="courses-page">
      <main className="courses-main">
        <div className="courses-intro">
          <span className="eyebrow">پنل مدیریت</span>
          <h1>
            مدیریت <span>اعضا</span>
          </h1>
          <p>{membersData.length.toLocaleString('fa-IR')} عضو در سیستم</p>
        </div>

        <div className="admin-toolbar">
          <input
            type="text"
            placeholder="🔍 جستجوی نام یا ایمیل..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="shop-search"
          />
        </div>

        <div className="course-filters admin-filters">
          {filters.map((f) => (
            <button
              key={f}
              className={`course-filter ${activeFilter === f ? 'active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="members-table">
          <div className="members-table-header">
            <span>عضو</span>
            <span>ایمیل</span>
            <span>پلن</span>
            <span>وضعیت</span>
            <span>تاریخ عضویت</span>
            <span>عملیات</span>
          </div>

          {filtered.map((member, i) => (
            <motion.div
              key={member.id}
              className="members-table-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <div className="member-cell">
                <div className="member-avatar">{member.avatar}</div>
                <strong>{member.name}</strong>
              </div>
              <span className="member-email">{member.email}</span>
              <span className={`member-plan ${member.plan === 'طلایی' ? 'gold' : member.plan === 'نقره‌ای' ? 'silver' : 'bronze'}`}>
                {member.plan}
              </span>
              <span className={`member-status ${member.status}`}>
                {member.status === 'active' ? '✓ فعال' : member.status === 'pending' ? '⏳ در انتظار' : '✕ غیرفعال'}
              </span>
              <span className="member-joined">{member.joined}</span>
              <div className="member-actions">
                <button className="member-action-btn" title="ویرایش">✏️</button>
                <button className="member-action-btn danger" title="حذف">🗑</button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default AdminMembers