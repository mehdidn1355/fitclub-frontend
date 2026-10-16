import { Link, useLocation, useNavigate } from 'react-router-dom'
import CartIcon from './CartIcon'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        FIT<span>CLUB</span>
      </Link>

      <nav className="nav-links">
        <Link to="/" className={isActive('/') ? 'active' : ''}>
          خانه
        </Link>
        <Link
          to="/courses"
          className={location.pathname.startsWith('/courses') ? 'active' : ''}
        >
          دوره‌ها
        </Link>
        <Link
          to="/trainers"
          className={location.pathname.startsWith('/trainers') ? 'active' : ''}
        >
          مربیان
        </Link>
        <Link
          to="/products"
          className={location.pathname.startsWith('/products') ? 'active' : ''}
        >
          فروشگاه
        </Link>
        <Link
          to="/ai-trainer"
          className={location.pathname.startsWith('/ai-trainer') ? 'active' : ''}
        >
          🎯 مربی AI
        </Link>
        <Link to="/contact" className={isActive('/contact') ? 'active' : ''}>
          تماس
        </Link>
      </nav>

      <div className="navbar-actions">
        <CartIcon />

        {isAuthenticated ? (
          <div className="user-menu">
            <Link to="/plans" className="user-plans-link">
              📋 برنامه‌ها
            </Link>
            <div className="user-info">
              <span className="user-avatar">{user.avatar}</span>
              <span className="user-name">{user.full_name}</span>
            </div>
            {user.role === 'admin' && (
              <Link to="/admin" className="user-panel-link">
                پنل مدیریت
              </Link>
            )}
            {user.role === 'trainer' && (
              <Link to="/trainer" className="user-panel-link">
                پنل مربی
              </Link>
            )}
            <button onClick={handleLogout} className="logout-button">
              خروج
            </button>
          </div>
        ) : (
          <Link to="/login" className="login-button">
            ورود / ثبت‌نام
          </Link>
        )}
      </div>
    </header>
  )
}