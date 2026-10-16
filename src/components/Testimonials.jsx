import { motion } from 'framer-motion'

const testimonials = [
  {
    name: 'محمد احمدی',
    role: 'عضو باشگاه، ۶ ماه',
    avatar: '💪',
    text: 'بهترین تجربه‌ی ورزشی من! مربی‌ها فوق‌العاده حرفه‌ای هستن و برنامه‌ها کاملاً شخصی‌سازی شده‌ان.',
    rating: 5,
  },
  {
    name: 'سارا رضایی',
    role: 'دانشجوی دوره‌ی یوگا',
    avatar: '🧘',
    text: 'دوره‌های آنلاین عالی هستن. تونستم از خونه تمرین کنم و خیلی نتیجه گرفتم.',
    rating: 5,
  },
  {
    name: 'رضا کریمی',
    role: 'عضو، ۱ سال',
    avatar: '🔥',
    text: 'رزرو نوبت با مربی خیلی راحته. کل روند از انتخاب تا پرداخت کمتر از ۲ دقیقه طول می‌کشه.',
    rating: 5,
  },
]

export default function Testimonials() {
  return (
    <section className="testimonials-section">
      <div className="section-heading">
        <motion.span
          className="eyebrow"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          نظرات اعضا
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          تجربه‌ی اعضای <span>FitClub</span>
        </motion.h2>
      </div>

      <div className="testimonial-grid">
        {testimonials.map((t, i) => (
          <motion.article
            key={i}
            className="testimonial-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            whileHover={{ y: -8, borderColor: '#c5f36b' }}
          >
            <div className="testimonial-stars">
              {'★'.repeat(t.rating)}
            </div>
            <p className="testimonial-text">«{t.text}»</p>
            <div className="testimonial-author">
              <div className="testimonial-avatar">{t.avatar}</div>
              <div>
                <strong>{t.name}</strong>
                <span>{t.role}</span>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}