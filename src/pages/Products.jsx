import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import CinematicProducts from '../components/three/CinematicProducts'
import { useCart } from '../context/CartContext'
import { productsAPI } from '../api/endpoints'

const categories = ['همه', 'تجهیزات', 'پوشاک', 'لوازم', 'مکمل']

function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [activeCategory, setActiveCategory] = useState('همه')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('popular')
  const [addedIds, setAddedIds] = useState([])

  const { addItem } = useCart()

  const toFa = (n) => Number(n || 0).toLocaleString('fa-IR')

  // دریافت محصولات از API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data } = await productsAPI.list()
        setProducts(data)
      } catch (err) {
        console.error(err)
        setError('خطا در دریافت محصولات. لطفاً مطمئن شو Backend در حال اجراست.')
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // فیلتر و مرتب‌سازی
  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const matchCat = activeCategory === 'همه' || p.category === activeCategory
      const matchSearch = p.title.includes(search)
      return matchCat && matchSearch
    })

    if (sortBy === 'price-low')
      list = [...list].sort((a, b) => a.price - b.price)
    else if (sortBy === 'price-high')
      list = [...list].sort((a, b) => b.price - a.price)
    else if (sortBy === 'rating')
      list = [...list].sort((a, b) => b.rating - a.rating)

    return list
  }, [products, activeCategory, search, sortBy])

  const handleAdd = (product) => {
    addItem(product, 1)
    setAddedIds((prev) => [...prev, product.id])
    setTimeout(() => {
      setAddedIds((prev) => prev.filter((id) => id !== product.id))
    }, 1500)
  }

  return (
    <div className="courses-page">
      {/* Hero 3D */}
      <section className="hero-section">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="hero-badge">🛒 فروشگاه FitClub</span>
          <h1>
            تجهیزات <span>حرفه‌ای</span> برای تمرین
          </h1>
          <p>
            هر چی برای تناسب اندام لازم داری — از دمبل و کتلبلا تا مکمل و پوشاک.
          </p>
          <div className="hero-actions">
            <a href="#products-list" className="primary-button">
              شروع خرید
            </a>
          </div>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <CinematicProducts />
        </motion.div>
      </section>

      {/* Products List */}
      <section className="courses-main" id="products-list">
        <div className="courses-intro">
          <span className="eyebrow">محصولات</span>
          <h1>
            همه‌ی <span>محصولات</span>
          </h1>
          <p>
            {loading
              ? 'در حال بارگذاری...'
              : `${toFa(filtered.length)} محصول موجود`}
          </p>
        </div>

        <div className="shop-toolbar">
          <input
            type="text"
            placeholder="🔍 جستجوی محصول..."
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

        {/* Loading */}
        {loading && (
          <div className="loading-state">
            <div className="spinner" />
            <p>در حال بارگذاری محصولات...</p>
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

        {/* Grid */}
        {!loading && !error && (
          <div className="course-grid">
            {filtered.length === 0 ? (
              <p className="courses-empty">محصولی یافت نشد.</p>
            ) : (
              filtered.map((product, i) => (
                <motion.article
                  key={product.id}
                  className="course-card product-card"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  whileHover={{ y: -8 }}
                >
                  <div className="course-art">
                    <span className="course-icon">{product.icon}</span>
                    <span className="course-level">
                      ⭐ {product.rating}
                    </span>
                    {product.tag && (
                      <span className="product-tag">{product.tag}</span>
                    )}
                  </div>
                  <div className="course-info">
                    <span className="course-category">{product.category}</span>
                    <h2>{product.title}</h2>
                    <p>محصول اورجینال با گارانتی اصالت.</p>
                    <div className="course-meta">
                      <span>✅ موجود ({toFa(product.stock)})</span>
                      <strong>{toFa(product.price)} تومان</strong>
                    </div>

                    <div className="product-actions">
                      <Link
                        to={`/products/${product.id}`}
                        className="course-button"
                      >
                        جزئیات
                      </Link>
                      <button
                        className={`add-to-cart-btn ${
                          addedIds.includes(product.id) ? 'added' : ''
                        }`}
                        onClick={() => handleAdd(product)}
                      >
                        {addedIds.includes(product.id)
                          ? '✓ اضافه شد'
                          : '🛒 افزودن'}
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))
            )}
          </div>
        )}
      </section>
    </div>
  )
}

export default Products