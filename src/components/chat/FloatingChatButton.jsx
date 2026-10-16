import { motion } from 'framer-motion'

export default function FloatingChatButton({ onClick, hasNew = false }) {
  return (
    <motion.button
      className="floating-chat-btn"
      onClick={onClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label="باز کردن چت"
    >
      <span className="floating-chat-icon">💬</span>
      {hasNew && <span className="floating-chat-badge">۱</span>}
      <motion.span
        className="floating-chat-pulse"
        animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.button>
  )
}