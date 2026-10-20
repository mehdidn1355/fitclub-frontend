import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Header() {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()

  const handleLogout = () => {
    logout() // پاک کردن توکن و ریست کردن State
    navigate('/login') // هدایت به صفحه لاگین
  }

  return (
    <header className="header">
      <div className="header-container">
        
        {/* لوگو */}
        <Link to="/" className="header-logo">
          FITCLUB
        </Link>

        {/* منوی اصلی */}
        <nav className="header-nav">
          <Link to="/">خانه</Link>
          <Link to="/courses">دوره‌ها</Link>
          <Link to="/trainers">مربیان</Link>
          <Link to="/products">فروشگاه</Link>
          <Link to="/ai-trainer">مربی AI</Link>
          <Link to="/contact">تماس</Link>
        </nav>

        {/* بخش کاربر */}
        <div className="header-actions">
          {isAuthenticated ? (
            <>
              {/* دکمه برنامه‌ها (فقط برای کاربران لاگین شده) */}
              <Link to="/plans" className="header-icon-btn" title="برنامه‌های من">
                📋 برنامه‌ها
              </Link>

              {/* نمایش نام کاربر */}
              <div className="header-user">
                <span className="user-avatar">💪</span>
                <span className="user-name">{user?.full_name || 'کاربر'}</span>
              </div>

              {/* دکمه خروج */}
              <button onClick={handleLogout} className="logout-btn">
                خروج
              </button>
            </>
          ) : (
            <Link to="/login" className="login-btn">
              ورود / ثبت‌نام
            </Link>
          )}
        </div>

      </div>
    </header>
  )
}

export default Header