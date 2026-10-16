import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'

function Cart() {
  const { items, removeItem, updateQty, totalItems, totalPrice, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="courses-page">
        <main className="courses-main">
          <motion.div
            className="empty-cart"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="empty-cart-icon">🛒</div>
            <h1>سبد خریدت خالیه!</h1>
            <p>بریم یه سری محصول باحال ببینیم؟</p>
            <Link to="/products" className="primary-button">مشاهده فروشگاه</Link>
          </motion.div>
        </main>
      </div>
    )
  }

  return (
    <div className="courses-page">
      <main className="courses-main">
        <div className="courses-intro">
          <span className="eyebrow">سبد خرید</span>
          <h1>سبد <span>خرید</span> شما</h1>
          <p>{totalItems.toLocaleString('fa-IR')} کالا در سبد</p>
        </div>

        <div className="cart-layout">
          <div className="cart-items">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  className="cart-item"
                  layout
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="cart-item-art">
                    <span>{item.icon}</span>
                  </div>

                  <div className="cart-item-info">
                    <span className="course-category">{item.category}</span>
                    <h3>{item.title}</h3>
                    <div className="cart-item-price">{item.price} تومان</div>
                  </div>

                  <div className="cart-item-qty">
                    <button onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                    <span>{item.qty.toLocaleString('fa-IR')}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                  </div>

                  <div className="cart-item-total">
                    {((item.priceRaw || 0) * item.qty).toLocaleString('fa-IR')} تومان
                  </div>

                  <button
                    className="cart-item-remove"
                    onClick={() => removeItem(item.id)}
                    aria-label="حذف"
                  >
                    ✕
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            <button className="cart-clear" onClick={clearCart}>
              🗑 خالی کردن سبد
            </button>
          </div>

          <motion.aside
            className="cart-summary"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3>خلاصه‌ی سفارش</h3>

            <div className="summary-row">
              <span>تعداد اقلام</span>
              <strong>{totalItems.toLocaleString('fa-IR')}</strong>
            </div>

            <div className="summary-row">
              <span>جمع کل</span>
              <strong>{totalPrice.toLocaleString('fa-IR')} تومان</strong>
            </div>

            <div className="summary-row">
              <span>هزینه ارسال</span>
              <strong className="free-shipping">رایگان</strong>
            </div>

            <div className="summary-divider" />

            <div className="summary-row summary-total">
              <span>مبلغ نهایی</span>
              <strong>{totalPrice.toLocaleString('fa-IR')} تومان</strong>
            </div>

            <Link to="/checkout" className="primary-button checkout-btn">
              ادامه‌ی پرداخت 💳
            </Link>

            <Link to="/products" className="continue-shopping">
              ← ادامه‌ی خرید
            </Link>
          </motion.aside>
        </div>
      </main>
    </div>
  )
}

export default Cart