import { useState } from 'react'
import { motion } from 'framer-motion'

const days = ['شنبه', 'یک‌شنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه']
const timeSlots = ['۰۸:۰۰', '۱۰:۰۰', '۱۲:۰۰', '۱۴:۰۰', '۱۶:۰۰', '۱۸:۰۰', '۲۰:۰۰']

function TrainerSchedule() {
  const [schedule, setSchedule] = useState(() => {
    const initial = {}
    days.forEach((day) => {
      initial[day] = timeSlots.map((time, i) => ({
        time,
        available: (i + day.length) % 3 === 0,
        booked: (i + day.length) % 5 === 0,
      }))
    })
    return initial
  })

  const toggleSlot = (day, index) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: prev[day].map((slot, i) =>
        i === index && !slot.booked ? { ...slot, available: !slot.available } : slot
      ),
    }))
  }

  return (
    <div className="courses-page">
      <main className="courses-main">
        <div className="courses-intro">
          <span className="eyebrow">پنل مربی</span>
          <h1>
            زمان‌های <span>آزاد</span>
          </h1>
          <p>روی هر بازه کلیک کن تا وضعیتش تغییر کنه.</p>
        </div>

        <div className="schedule-legend">
          <div className="legend-item">
            <span className="legend-dot available" />
            <span>آزاد</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot booked" />
            <span>رزرو شده</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot unavailable" />
            <span>غیرفعال</span>
          </div>
        </div>

        <div className="schedule-wrapper">
          <div className="schedule-header">
            <div className="schedule-corner"></div>
            {days.map((day) => (
              <div key={day} className="schedule-day">{day}</div>
            ))}
          </div>

          {timeSlots.map((time, timeIdx) => (
            <div key={time} className="schedule-row">
              <div className="schedule-time">{time}</div>
              {days.map((day) => {
                const slot = schedule[day][timeIdx]
                return (
                  <motion.button
                    key={`${day}-${time}`}
                    className={`schedule-slot ${slot.booked ? 'booked' : slot.available ? 'available' : 'unavailable'}`}
                    onClick={() => toggleSlot(day, timeIdx)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {slot.booked ? '👤' : slot.available ? '✓' : '—'}
                  </motion.button>
                )
              })}
            </div>
          ))}
        </div>

        <div className="schedule-actions">
          <button className="primary-button">💾 ذخیره تغییرات</button>
          <button className="secondary-button">🔄 بازنشانی</button>
        </div>
      </main>
    </div>
  )
}

export default TrainerSchedule