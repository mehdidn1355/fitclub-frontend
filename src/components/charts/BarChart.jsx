import { motion } from 'framer-motion'

export default function BarChart({ data, height = 280, formatValue = (v) => v }) {
  if (!data || data.length === 0) {
    return <p style={{ color: '#858a7d', textAlign: 'center', padding: '40px' }}>داده‌ای موجود نیست</p>
  }

  const maxValue = Math.max(...data.map((d) => d.value)) * 1.15

  return (
    <div className="bar-chart-wrapper">
      <div className="bar-chart" style={{ height }}>
        {data.map((item, i) => {
          const percent = (item.value / maxValue) * 100
          return (
            <div key={i} className="bar-column">
              <div className="bar-value-top">
                {formatValue(item.value)}
              </div>
              <div className="bar-track">
                <motion.div
                  className="bar-fill"
                  style={{ background: item.color || '#c5f36b' }}
                  initial={{ height: 0 }}
                  animate={{ height: `${percent}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                />
              </div>
              <div className="bar-label">{item.label}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}