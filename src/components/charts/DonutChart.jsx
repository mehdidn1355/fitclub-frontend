import { motion } from 'framer-motion'

export default function DonutChart({ data, size = 200, thickness = 30 }) {
  if (!data || data.length === 0) {
    return <p style={{ color: '#858a7d', textAlign: 'center', padding: '40px' }}>داده‌ای موجود نیست</p>
  }

  const total = data.reduce((sum, d) => sum + d.value, 0)
  if (total === 0) {
    return <p style={{ color: '#858a7d', textAlign: 'center', padding: '40px' }}>داده‌ای موجود نیست</p>
  }

  const radius = (size - thickness) / 2
  const circumference = 2 * Math.PI * radius
  const center = size / 2

  let cumulativePercent = 0

  return (
    <div className="donut-chart-wrapper">
      <svg width={size} height={size} className="donut-svg">
        {/* Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={thickness}
        />

        {/* Segments */}
        {data.map((item, i) => {
          const percent = item.value / total
          const dashArray = `${percent * circumference} ${circumference}`
          const dashOffset = -cumulativePercent * circumference
          cumulativePercent += percent

          return (
            <motion.circle
              key={i}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth={thickness}
              strokeDasharray={dashArray}
              strokeDashoffset={dashOffset}
              transform={`rotate(-90 ${center} ${center})`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              strokeLinecap="butt"
            />
          )
        })}

        {/* Center Text */}
        <text
          x={center}
          y={center - 5}
          textAnchor="middle"
          fill="#f5f5f5"
          fontSize="20"
          fontWeight="900"
        >
          {total.toLocaleString('fa-IR')}
        </text>
        <text
          x={center}
          y={center + 18}
          textAnchor="middle"
          fill="#858a7d"
          fontSize="11"
        >
          مجموع
        </text>
      </svg>

      {/* Legend */}
      <div className="donut-legend">
        {data.map((item, i) => (
          <div key={i} className="donut-legend-item">
            <span
              className="donut-legend-dot"
              style={{ background: item.color }}
            />
            <span className="donut-legend-label">{item.label}</span>
            <strong className="donut-legend-value">
              {item.value.toLocaleString('fa-IR')}
            </strong>
          </div>
        ))}
      </div>
    </div>
  )
}