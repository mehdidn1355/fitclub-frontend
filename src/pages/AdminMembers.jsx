import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { adminAPI } from '../api/endpoints'

function AdminMembers() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('همه')

  const toFa = (n) => Number(n || 0).toLocaleString('fa-IR')

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true)
      try {
        const { data } = await adminAPI.listUsers()
        setMembers(data)
      } catch (err) {
        console.error(err)
        setError('خطا در دریافت لیست کاربران')
      } finally {
        setLoading(false)
      }
    }
    fetchMembers()
  }, [])

  const filtered = members.filter((m) => {
    const matchSearch = m.full_name.includes(search) || m.email.includes(search)
    const matchFilter =
      activeFilter === 'همه' ||
      (activeFilter === 'فعال' && m.is_active) ||
      (activeFilter === 'غیرفعال' && !m.is_active)
    return matchSearch && matchFilter
  })

  if (loading) {
    return <div className="courses-page"><main className="courses-main"><div className="loading-state"><div className="spinner" /><p>در حال بارگذاری...</p></div></main></div>
  }
  if (error) {
    return <div className="courses-page"><main className="courses-main"><div className="error-state"><div className="error-icon">⚠️</div><p>{error}</p></div></main></div>
  }

  return (
    <div className="courses-page">
      <main className="courses-main">
        <div className="courses-intro">
          <span className="eyebrow">پنل مدیریت</span>
          <h1>مدیریت <span>اعضا</span></h1>
          <p>{toFa(members.length)} کاربر در سیستم</p>
        </div>

        <div className="admin-toolbar">
          <input type="text" placeholder="🔍 جستجوی نام یا ایمیل..." value={search} onChange={(e) => setSearch(e.target.value)} className="shop-search" />
        </div>

        <div className="course-filters admin-filters">
          {['همه', 'فعال', 'غیرفعال'].map((f) => (
            <button key={f} className={`course-filter ${activeFilter === f ? 'active' : ''}`} onClick={() => setActiveFilter(f)}>{f}</button>
          ))}
        </div>

        <div className="members-table">
          <div className="members-table-header">
            <span>عضو</span>
            <span>ایمیل</span>
            <span>نقش</span>
            <span>وضعیت</span>
            <span>تاریخ عضویت</span>
            <span>عملیات</span>
          </div>
          {filtered.map((member, i) => (
            <motion.div key={member.id} className="members-table-row" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.05 }}>
              <div className="member-cell">
                <div className="member-avatar">{member.avatar}</div>
                <strong>{member.full_name}</strong>
              </div>
              <span className="member-email">{member.email}</span>
              <span className={`member-plan ${member.role === 'admin' ? 'gold' : member.role === 'trainer' ? 'silver' : 'bronze'}`}>
                {member.role === 'admin' ? 'مدیر' : member.role === 'trainer' ? 'مربی' : 'شاگرد'}
              </span>
              <span className={`member-status ${member.is_active ? 'active' : 'inactive'}`}>
                {member.is_active ? '✓ فعال' : '✕ غیرفعال'}
              </span>
              <span className="member-joined">{new Date(member.created_at).toLocaleDateString('fa-IR')}</span>
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