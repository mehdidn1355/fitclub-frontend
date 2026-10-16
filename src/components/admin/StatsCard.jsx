import { motion } from 'framer-motion'

export default function StatsCard({ icon, label, value, change, color = '#c5f36b', index = 0 }) {
  const isPositive = change > 0

  return (
    <motion.div
      className="admin-stat-card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      style={{ '--accent': color }}
    >
      <div className="admin-stat-top">
        <div className="admin-stat-icon" style={{ color }}>
          {icon}
        </div>
        {change !== undefined && (
          <div className={`admin-stat-change ${isPositive ? 'up' : 'down'}`}>
            {isPositive ? '▲' : '▼'} {Math.abs(change).toLocaleString('fa-IR')}٪
          </div>
        )}
      </div>

      <div className="admin-stat-value" style={{ color }}>{value}</div>
      <div className="admin-stat-label">{label}</div>

      <div className="admin-stat-glow" style={{ background: color }} />
    </motion.div>
  )
}