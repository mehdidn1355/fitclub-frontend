import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import CinematicCourses from '../components/three/CinematicCourses'
import CourseCard from '../components/CourseCard'
import { coursesAPI } from '../api/endpoints'

const categories = ['همه', 'بدنسازی', 'تغذیه', 'کراس‌فیت', 'یوگا']
const levels = ['همه', 'مبتدی', 'متوسط', 'پیشرفته']

function Courses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('همه')
  const [activeLevel, setActiveLevel] = useState('همه')
  const [sortBy, setSortBy] = useState('popular')

  // ============ دریافت دوره‌ها از API ============
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data } = await coursesAPI.list()
        setCourses(data)
      } catch (err) {
        console.error(err)
        setError('خطا در دریافت دوره‌ها. لطفاً مطمئن شو Backend در حال اجراست.')
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  // ============ فیلتر و مرتب‌سازی ============
  const filtered = useMemo(() => {
    let list = courses.filter((c) => {
      const matchCat =
        activeCategory === 'همه' || c.category === activeCategory
      const matchLevel =
        activeLevel === 'همه' || c.level === activeLevel
      const matchSearch =
        c.title.includes(search) || c.description.includes(search)
      return matchCat && matchLevel && matchSearch
    })

    if (sortBy === 'price-low')
      list = [...list].sort((a, b) => a.price - b.price)
    else if (sortBy === 'price-high')
      list = [...list].sort((a, b) => b.price - a.price)
    else if (sortBy === 'rating')
      list = [...list].sort((a, b) => b.rating - a.rating)

    return list
  }, [courses, search, activeCategory, activeLevel, sortBy])

  // ============ تبدیل اعداد انگلیسی به فارسی ============
  const toFa = (n) => n.toLocaleString('fa-IR')

  const formatPrice = (price) => {
    return toFa(price)
  }

  return (
    <div className="courses-page">
      {/* ===== Hero ===== */}
      <section className="hero-section">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="hero-badge">🎓 آموزش آنلاین</span>
          <h1>
            دوره‌های <span>آموزشی</span> FitClub
          </h1>
          <p>
            از مبتدی تا حرفه‌ای — هر دوره‌ای که برای رسیدن به هدف تناسب اندامت
            لازم داری، اینجاست.
          </p>
          <div className="hero-actions">
            <a href="#courses-list" className="primary-button">
              مشاهده دوره‌ها
            </a>
          </div>

          <div className="hero-stats">
            <div>
              <strong>+{toFa(courses.length || 200)}</strong>
              <span>دوره آموزشی</span>
            </div>
            <div>
              <strong>+۵۰</strong>
              <span>مدرس حرفه‌ای</span>
            </div>
            <div>
              <strong>+۵۰K</strong>
              <span>دانشجو</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <CinematicCourses />
        </motion.div>
      </section>

      {/* ===== Course List ===== */}
      <section className="courses-main" id="courses-list">
        <div className="courses-intro">
          <span className="eyebrow">همه‌ی دوره‌ها</span>
          <h1>
            دوره‌های <span>FitClub</span>
          </h1>
          <p>
            {loading
              ? 'در حال بارگذاری...'
              : `${toFa(filtered.length)} دوره موجود`}
          </p>
        </div>

        {/* Toolbar */}
        <div className="courses-toolbar">
          <input
            type="text"
            placeholder="🔍 جستجوی دوره..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="shop-search"
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="shop-sort"
          >
            <option value="popular">محبوب‌ترین</option>
            <option value="price-low">ارزان‌ترین</option>
            <option value="price-high">گران‌ترین</option>
            <option value="rating">بهترین امتیاز</option>
          </select>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filter-group">
            <span className="filter-label">دسته:</span>
            <div className="course-filters">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`course-filter ${
                    activeCategory === cat ? 'active' : ''
                  }`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <span className="filter-label">سطح:</span>
            <div className="course-filters">
              {levels.map((lvl) => (
                <button
                  key={lvl}
                  className={`course-filter ${
                    activeLevel === lvl ? 'active' : ''
                  }`}
                  onClick={() => setActiveLevel(lvl)}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="loading-state">
            <div className="spinner" />
            <p>در حال بارگذاری دوره‌ها...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <p>{error}</p>
            <button
              className="primary-button"
              onClick={() => window.location.reload()}
            >
              تلاش دوباره
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <div className="courses-empty">
            <div className="empty-icon">🔍</div>
            <p>دوره‌ای با این مشخصات پیدا نشد.</p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && filtered.length > 0 && (
          <div className="course-grid">
            {filtered.map((course, i) => (
              <CourseCard key={course.id} course={course} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Courses