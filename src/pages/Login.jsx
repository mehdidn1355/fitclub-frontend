import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import FloatingLock from '../components/three/FloatingLock'
import { useAuth } from '../context/AuthContext'

function Login() {
  const navigate = useNavigate()
  const { login, register, loading } = useAuth()
  const [mode, setMode] = useState('login')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (mode === 'login') {
      const result = await login(email, password)
      if (result.success) {
        if (result.user.role === 'admin') navigate('/admin')
        else if (result.user.role === 'trainer') navigate('/trainer')
        else navigate('/')
      } else {
        setError(result.error)
      }
    } else {
      if (password.length < 6) {
        setError('رمز عبور باید حداقل ۶ کاراکتر باشه')
        return
      }
      const result = await register({
        email,
        password,
        full_name: fullName,
      })
      if (result.success) {
        navigate('/')
      } else {
        setError(result.error)
      }
    }
  }

  const switchMode = (newMode) => {
    setMode(newMode)
    setError(null)
    setEmail('')
    setPassword('')
    setFullName('')
  }

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <FloatingLock />
      </div>

      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="auth-tabs">
          <button
            className={mode === 'login' ? 'active' : ''}
            onClick={() => switchMode('login')}
          >
            ورود
          </button>
          <button
            className={mode === 'register' ? 'active' : ''}
            onClick={() => switchMode('register')}
          >
            ثبت‌نام
          </button>
        </div>

        <h1>
          {mode === 'login' ? 'خوش برگشتی 👋' : 'به FitClub بپیوند 🚀'}
        </h1>
        <p className="auth-subtitle">
          {mode === 'login'
            ? 'وارد حساب کاربری خودت شو'
            : 'حساب کاربری جدید بساز'}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <input
              type="text"
              placeholder="نام کامل"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="ایمیل"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="رمز عبور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <div className="auth-error">⚠️ {error}</div>}

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading
              ? 'لطفاً صبر کن...'
              : mode === 'login'
              ? 'ورود'
              : 'ثبت‌نام'}
          </button>
        </form>

        <p className="auth-footer">
          <Link to="/">← بازگشت به خانه</Link>
        </p>
      </motion.div>
    </div>
  )
}

export default Login