import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { ordersAPI } from '../api/endpoints'

function Checkout() {
  const navigate = useNavigate()
  const { items, totalPrice, totalItems, clearCart } = useCart()
  const { isAuthenticated } = useAuth()

  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    postalCode: '',
    payment: 'online',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const toFa = (n) => Number(n || 0).toLocaleString('fa-IR')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!isAuthenticated) {
      setError('برای ثبت سفارش باید ابتدا وارد حساب کاربری شوی')
      return
    }

    setIsSubmitting(true)

    try {
      const orderData = {
        items: items.map((item) => ({
          product_id: item.id,
          quantity: item.qty,
        })),
        shipping_name: form.name,
        shipping_phone: form.phone,
        shipping_address: form.address,
        shipping_postal_code: form.postalCode,
        payment_method: form.payment,
      }

      const { data } = await ordersAPI.create(orderData)
      clearCart()
      navigate(`/order-success/${data.id}`)
    } catch (err) {
      console.error(err)
      setError(
        err.response?.data?.detail ||
          'خطا در ثبت سفارش. لطفاً دوباره تلاش کن.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="courses-page">
        <main className="courses-main">
          <div className="empty-cart">
            <h1>سبد خریدت خالیه!</h1>
            <Link to="/products" className="primary-button">
              مشاهده فروشگاه
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="courses-page">
      <main className="courses-main">
        <div className="courses-intro">
          <span className="eyebrow">پرداخت</span>
          <h1>
            تکمیل <span>سفارش</span>
          </h1>
        </div>

        {!isAuthenticated && (
          <div className="error-state" style={{ marginBottom: '20px' }}>
            <div className="error-icon">🔒</div>
            <p>برای ثبت سفارش باید وارد حساب کاربری شوی</p>
            <Link to="/login" className="primary-button">
              ورود به حساب
            </Link>
          </div>
        )}

        <div className="checkout-layout">
          <motion.form
            className="checkout-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3>اطلاعات ارسال</h3>

            <div className="form-row">
              <div className="form-group">
                <label>نام و نام خانوادگی</label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="مثلاً علی رضایی"
                />
              </div>

              <div className="form-group">
                <label>شماره تماس</label>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                />
              </div>
            </div>

            <div className="form-group">
              <label>آدرس</label>
              <textarea
                required
                rows={3}
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
                placeholder="آدرس دقیق پستی"
              />
            </div>

            <div className="form-group">
              <label>کد پستی</label>
              <input
                required
                type="text"
                value={form.postalCode}
                onChange={(e) =>
                  setForm({ ...form, postalCode: e.target.value })
                }
                placeholder="۱۲۳۴۵۶۷۸۹۰"
              />
            </div>

            <h3 style={{ marginTop: '30px' }}>روش پرداخت</h3>

            <div className="payment-options">
              <label
                className={`payment-option ${
                  form.payment === 'online' ? 'active' : ''
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="online"
                  checked={form.payment === 'online'}
                  onChange={(e) =>
                    setForm({ ...form, payment: e.target.value })
                  }
                />
                <span>💳 پرداخت آنلاین</span>
              </label>

              <label
                className={`payment-option ${
                  form.payment === 'cod' ? 'active' : ''
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={form.payment === 'cod'}
                  onChange={(e) =>
                    setForm({ ...form, payment: e.target.value })
                  }
                />
                <span>💰 پرداخت در محل</span>
              </label>
            </div>

            {error && <div className="auth-error">⚠️ {error}</div>}

            <button
              type="submit"
              className="primary-button checkout-submit"
              disabled={isSubmitting || !isAuthenticated}
            >
              {isSubmitting
                ? 'در حال پردازش...'
                : `پرداخت و ثبت سفارش (${toFa(totalPrice)} تومان)`}
            </button>
          </motion.form>

          <motion.aside
            className="cart-summary"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3>سفارش شما</h3>

            <div className="checkout-items">
              {items.map((item) => (
                <div key={item.id} className="checkout-item">
                  <span className="checkout-item-icon">{item.icon}</span>
                  <div>
                    <strong>{item.title}</strong>
                    <span>
                      {toFa(item.qty)} × {toFa(item.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-divider" />

            <div className="summary-row">
              <span>تعداد اقلام</span>
              <strong>{toFa(totalItems)}</strong>
            </div>

            <div className="summary-row">
              <span>هزینه ارسال</span>
              <strong className="free-shipping">رایگان</strong>
            </div>

            <div className="summary-row summary-total">
              <span>مبلغ نهایی</span>
              <strong>{toFa(totalPrice)} تومان</strong>
            </div>
          </motion.aside>
        </div>
      </main>
    </div>
  )
}

export default Checkout