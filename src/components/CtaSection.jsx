import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function CtaSection() {
  return (
    <section className="cta-section">
      <motion.div
        className="cta-inner"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="cta-glow" />
        <span className="eyebrow">آماده‌ای شروع کنی؟</span>
        <h2>
          امروز اولین قدم رو <span>بردار</span>
        </h2>
        <p>
          به بیش از ۱۰۰۰ عضو FitClub بپیوند و مسیر تناسب اندامت رو شروع کن.
        </p>
        <div className="cta-actions">
          <Link to="/courses" className="primary-button">
            شروع کن 🚀
          </Link>
          <Link to="/trainers" className="secondary-button">
            مشاهده مربیان
          </Link>
        </div>
      </motion.div>
    </section>
  )
}