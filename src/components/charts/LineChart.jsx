import { motion } from 'framer-motion'

export default function LineChart({ data, height = 280, formatValue = (v) => v }) {
  if (!data || data.length === 0) {
    return <p style={{ color: '#858a7d', textAlign: 'center', padding: '40px' }}>داده‌ای موجود نیست</p>
  }

  const width = 700
  const padding = { top: 20, right: 30, bottom: 40, left: 70 }
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom

  const maxValue = Math.max(...data.map((d) => d.value)) * 1.15
  const stepX = chartWidth / Math.max(data.length - 1, 1)

  const points = data.map((d, i) => ({
    x: padding.left + i * stepX,
    y: padding.top + chartHeight - (d.value / maxValue) * chartHeight,
    ...d,
  }))

  const linePath = points
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(' ')

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${
    padding.top + chartHeight
  } L ${points[0].x} ${padding.top + chartHeight} Z`

  return (
    <div className="line-chart-wrapper">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className="chart-svg"
      >
        <defs>
          <linearGradient id="lineAreaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c5f36b" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#c5f36b" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lineStrokeGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#a6e04a" />
            <stop offset="100%" stopColor="#c5f36b" />
          </linearGradient>
          <filter id="lineGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Grid Lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = padding.top + chartHeight * ratio
          const value = maxValue * (1 - ratio)
          return (
            <g key={i}>
              <line
                x1={padding.left}
                x2={width - padding.right}
                y1={y}
                y2={y}
                stroke="rgba(255,255,255,0.05)"
                strokeDasharray="4 6"
              />
              <text
                x={padding.left - 10}
                y={y + 4}
                textAnchor="end"
                fill="#858a7d"
                fontSize="11"
              >
                {formatValue(value)}
              </text>
            </g>
          )
        })}

        {/* Area */}
        <motion.path
          d={areaPath}
          fill="url(#lineAreaGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />

        {/* Line */}
        <motion.path
          d={linePath}
          fill="none"
          stroke="url(#lineStrokeGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#lineGlow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />

        {/* Points */}
        {points.map((p, i) => (
          <g key={i}>
            <motion.circle
              cx={p.x}
              cy={p.y}
              r="6"
              fill="#c5f36b"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 1 + i * 0.08 }}
              filter="url(#lineGlow)"
            />
            <motion.circle
              cx={p.x}
              cy={p.y}
              r="3"
              fill="#fff"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 1.1 + i * 0.08 }}
            />
            {/* Label */}
            <text
              x={p.x}
              y={height - 15}
              textAnchor="middle"
              fill="#858a7d"
              fontSize="11"
            >
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}