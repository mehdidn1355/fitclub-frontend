import { motion } from 'framer-motion'

const monthLabels = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور']

export default function RevenueChart({ data = [45, 62, 58, 78, 92, 110], height = 250 }) {
  const max = Math.max(...data) * 1.2
  const width = 600
  const padding = 40
  const chartWidth = width - padding * 2
  const chartHeight = height - padding * 2
  const stepX = chartWidth / (data.length - 1)

  const points = data.map((value, i) => ({
    x: padding + i * stepX,
    y: padding + chartHeight - (value / max) * chartHeight,
    value,
  }))

  const pathD = points
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(' ')

  const areaD = `${pathD} L ${points[points.length - 1].x} ${padding + chartHeight} L ${points[0].x} ${padding + chartHeight} Z`

  return (
    <div className="revenue-chart">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="chart-svg">
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c5f36b" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#c5f36b" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#a6e04a" />
            <stop offset="100%" stopColor="#c5f36b" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* خطوط افقی راهنما */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
          <line
            key={i}
            x1={padding}
            x2={width - padding}
            y1={padding + chartHeight * ratio}
            y2={padding + chartHeight * ratio}
            stroke="rgba(255,255,255,0.05)"
            strokeDasharray="4 6"
          />
        ))}

        {/* ناحیه‌ی زیر نمودار */}
        <motion.path
          d={areaD}
          fill="url(#areaGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />

        {/* خط اصلی */}
        <motion.path
          d={pathD}
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />

        {/* نقاط */}
        {points.map((p, i) => (
          <g key={i}>
            <motion.circle
              cx={p.x}
              cy={p.y}
              r="6"
              fill="#c5f36b"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 1 + i * 0.1 }}
              filter="url(#glow)"
            />
            <motion.circle
              cx={p.x}
              cy={p.y}
              r="3"
              fill="#fff"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 1.1 + i * 0.1 }}
            />
          </g>
        ))}
      </svg>

      <div className="chart-labels">
        {monthLabels.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </div>
  )
}