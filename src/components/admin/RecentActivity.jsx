import { motion } from 'framer-motion'

const activities = [
  { icon: '🛒', title: 'سفارش جدید', desc: 'محمد احمدی — ۲,۸۰۰,۰۰۰ تومان', time: '۵ دقیقه پیش', color: '#c5f36b' },
  { icon: '👤', title: 'عضو جدید', desc: 'سارا رضایی ثبت‌نام کرد', time: '۲۰ دقیقه پیش', color: '#4ade80' },
  { icon: '📅', title: 'رزرو جدید', desc: 'رضا کریمی — مربی علی رضایی', time: '۱ ساعت پیش', color: '#fbbf24' },
  { icon: '💰', title: 'پرداخت موفق', desc: 'مریم احمدی — دوره‌ی یوگا', time: '۲ ساعت پیش', color: '#22d3ee' },
  { icon: '⭐', title: 'نظر جدید', desc: 'حسین نوری — ۵ ستاره', time: '۳ ساعت پیش', color: '#f59e0b' },
]

export default function RecentActivity() {
  return (
    <div className="recent-activity">
      {activities.map((activity, i) => (
        <motion.div
          key={i}
          className="activity-item"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
        >
          <div
            className="activity-icon"
            style={{
              background: `${activity.color}15`,
              borderColor: `${activity.color}40`,
              color: activity.color,
            }}
          >
            {activity.icon}
          </div>

          <div className="activity-content">
            <strong>{activity.title}</strong>
            <span>{activity.desc}</span>
          </div>

          <div className="activity-time">{activity.time}</div>
        </motion.div>
      ))}
    </div>
  )
}