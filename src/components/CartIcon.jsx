import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'

export default function CartIcon() {
  const { totalItems } = useCart()

  return (
    <Link to="/cart" className="cart-icon">
      <span className="cart-icon-emoji">🛒</span>
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.span
            className="cart-badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 500 }}
          >
            {totalItems.toLocaleString('fa-IR')}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  )
}