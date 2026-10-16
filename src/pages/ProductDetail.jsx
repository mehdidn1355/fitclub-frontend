import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { productsAPI } from '../api/endpoints'

function ProductDetail() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const toFa = (n) => Number(n || 0).toLocaleString('fa-IR')

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data } = await productsAPI.get(productId)
        setProduct(data)
      } catch (err) {
        console.error(err)
        setError('محصول یافت نشد')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [productId])

  const handleAdd = () => {
    addItem(product, qty)
    setAdded(true)
    setTimeout(() => navigate('/cart'), 800)
  }

  if (loading) {
    return (
      <div className="courses-page">
        <main className="courses-main">
          <div className="loading-state">
            <div className="spinner" />
            <p>در حال بارگذاری محصول...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="courses-page">
        <main className="courses-main">
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <p>{error || 'محصول یافت نشد'}</p>
            <Link to="/products" className="primary-button">
              بازگشت به فروشگاه
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="courses-page">
      <main className="courses-main">
        <motion.div
          className="detail-wrapper"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Art */}
          <div className="detail-gallery">
            <div className="detail-art">
              <span style={{ fontSize: '140px' }}>{product.icon}</span>
            </div>
          </div>

          {/* Info */}
          <div className="detail-info">
            <span className="eyebrow">{product.category}</span>
            <h1>{product.title}</h1>
            <div className="detail-rating">
              ⭐ {product.rating}{' '}
              <span className="detail-reviews">(۲۴۰ نظر)</span>
            </div>

            <p className="detail-desc">
              {product.description ||
                'این محصول با کیفیت بالا و متریال درجه‌یک ساخته شده و مناسب تمرین‌های حرفه‌ای و خانگی است. با گارانتی اصالت و ضمانت بازگشت.'}
            </p>

            <div className="detail-features">
              <span>✅ گارانتی اصالت</span>
              <span>🚚 ارسال سریع</span>
              <span>🔄 بازگشت ۷ روزه</span>
              <span>✅ موجودی: {toFa(product.stock)}</span>
            </div>

            <div className="detail-price">{toFa(product.price)} تومان</div>

            <div className="detail-qty-wrapper">
              <span className="detail-qty-label">تعداد:</span>
              <div className="detail-qty">
                <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                <span>{toFa(qty)}</span>
                <button
                  onClick={() => setQty(Math.min(product.stock, qty + 1))}
                >
                  +
                </button>
              </div>
            </div>

            <div className="detail-actions">
              <button
                className={`primary-button ${added ? 'added' : ''}`}
                onClick={handleAdd}
                disabled={added || product.stock === 0}
              >
                {added ? '✓ اضافه شد' : 'افزودن به سبد خرید 🛒'}
              </button>
              <Link to="/products" className="secondary-button">
                بازگشت
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

export default ProductDetail