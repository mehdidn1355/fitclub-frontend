import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function OrderSuccess() {
  const { orderId } = useParams()
  const toFa = (n) => Number(n || 0).toLocaleString('fa-IR')

  return (
    <div className="courses-page">
      <main className="courses-main">
        <motion.div
          className="order-success"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
        >
          <motion.div
            className="success-icon"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            ✅
          </motion.div>

          <h1>سفارش شما ثبت شد! 🎉</h1>
          <p>ممنون از خریدت. سفارشت به‌زودی ارسال می‌شه.</p>

          <div className="order-id-box">
            <span>شماره سفارش:</span>
            <strong>#{toFa(orderId)}</strong>
          </div>

          <div className="order-success-actions">
            <Link to="/products" className="primary-button">
              ادامه‌ی خرید
            </Link>
            <Link to="/" className="secondary-button">
              بازگشت به خانه
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

export default OrderSuccess