import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { adminAPI } from '../api/endpoints'

function AdminCreateUser() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: '',
    full_name: '',
    password: '',
    role: 'customer',
  })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      await adminAPI.createUser({
        email: form.email,
        full_name: form.full_name,
        password: form.password,
      }, form.role)
      setSuccess(`کاربر ${form.full_name} با موفقیت ساخته شد!`)
      setForm({ email: '', full_name: '', password: '', role: 'customer' })
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.detail || 'خطا در ساخت کاربر')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="courses-page">
      <main className="courses-main">
        <motion.div
          className="admin-panel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>ساخت کاربر جدید</h1>
          <p>شما می‌توانید کاربر جدید (شاگرد یا مربی) بسازید.</p>

          <form onSubmit={handleSubmit} className="auth-form" style={{ maxWidth: '600px', marginTop: '2rem' }}>
            <div className="form-group">
              <label>ایمیل</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>نام کامل</label>
              <input type="text" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>رمز عبور اولیه</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>نقش</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="shop-sort">
                <option value="customer">شاگرد</option>
                <option value="trainer">مربی</option>
              </select>
            </div>

            {error && <div className="auth-error">⚠️ {error}</div>}
            {success && <div className="auth-success">✅ {success}</div>}

            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? 'در حال ساخت...' : 'ساخت کاربر'}
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  )
}

export default AdminCreateUser