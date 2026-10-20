import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await axios.post('http://localhost:8000/api/auth/login', {
        email: email,
        password: password
      })

      // استفاده از تابع login در Context
      login(response.data.user, response.data.access_token)
      
      // هدایت به صفحه اصلی
      navigate('/')
      
    } catch (err) {
      console.error("Login Error:", err)
      if (err.response) {
        setError(err.response.data?.detail || 'اطلاعات ورود اشتباه است')
      } else if (err.request) {
        setError('ارتباط با سرور برقرار نشد.')
      } else {
        setError('خطای ناشناخته رخ داد.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="wizard-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="wizard-container" style={{ maxWidth: '400px', width: '100%', padding: '30px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>ورود به حساب</h2>
        
        {error && (
          <div style={{ background: 'rgba(255,0,0,0.1)', border: '1px solid red', color: '#ff6b6b', padding: '10px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div className="wizard-form-group">
            <label>ایمیل</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="wizard-form-group">
            <label>رمز عبور</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="primary-button" 
            disabled={loading}
            style={{ marginTop: '10px' }}
          >
            {loading ? 'در حال ورود...' : 'ورود'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login