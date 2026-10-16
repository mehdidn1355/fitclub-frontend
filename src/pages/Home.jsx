import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import CinematicHero from '../components/three/CinematicHero'
import ShowcaseSection from '../components/ShowcaseSection'
import AnimatedCounter from '../components/AnimatedCounter'
import MarqueeBrands from '../components/MarqueeBrands'
import Testimonials from '../components/Testimonials'
import CtaSection from '../components/CtaSection'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
}

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

function Home() {
  return (
    <>
      {/* ===== Hero ===== */}
      <section className="hero-section">
        <motion.div
          className="hero-content"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.span className="hero-badge" variants={item}>
            🔥 پیشنهاد ویژه‌ی این هفته
          </motion.span>

          <motion.h1 variants={item}>
            بدنت رو <span>بساز</span>،
            <br />
            ذهنت رو قوی کن
          </motion.h1>

          <motion.p variants={item}>
            رزرو نوبت با مربی، خرید دوره‌های آموزشی و محصولات ورزشی — همه در یک
            پلتفرم.
          </motion.p>

          <motion.div className="hero-actions" variants={item}>
            <Link to="/ai-trainer" className="primary-button">
              🎯 شروع با مربی AI
            </Link>
            <Link to="/courses" className="secondary-button">
              مشاهده دوره‌ها
            </Link>
          </motion.div>

          <motion.div className="hero-stats" variants={item}>
            <div>
              <strong>
                <AnimatedCounter to={50} prefix="+" />
              </strong>
              <span>مربی حرفه‌ای</span>
            </div>
            <div>
              <strong>
                <AnimatedCounter to={200} prefix="+" />
              </strong>
              <span>دوره آموزشی</span>
            </div>
            <div>
              <strong>
                <AnimatedCounter to={1000} prefix="+" />
              </strong>
              <span>عضو فعال</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <CinematicHero />
        </motion.div>
      </section>

      {/* ===== Marquee ===== */}
      <MarqueeBrands />

      {/* ===== Services ===== */}
      <section className="services">
        <div className="section-heading">
          <motion.span
            className="eyebrow"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            خدمات ما
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            هر چی برای تناسب اندام لازم داری
          </motion.h2>
        </div>

        <div className="service-grid">
          {[
            {
              icon: '🎯',
              title: 'مربی هوش مصنوعی',
              text: 'برنامه‌ی تمرینی اختصاصی با انیمیشن سه‌بعدی و موسیقی دلخواه',
              link: '/ai-trainer',
              cta: 'شروع کن',
            },
            {
              icon: '👨‍🏫',
              title: 'رزرو مربی',
              text: 'مربی مناسب رو انتخاب کن و زمان تمرینت رو رزرو کن.',
              link: '/trainers',
              cta: 'رزرو نوبت',
            },
            {
              icon: '🎓',
              title: 'دوره‌های آموزشی',
              text: 'دوره‌های ویدئویی بدنسازی، تغذیه و فیتنس.',
              link: '/courses',
              cta: 'مشاهده دوره‌ها',
            },
            {
              icon: '🛒',
              title: 'فروشگاه',
              text: 'لباس، کفش، لوازم و مکمل‌های ورزشی.',
              link: '/products',
              cta: 'ورود به فروشگاه',
            },
          ].map((s, i) => (
            <motion.article
              key={i}
              className="service-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              whileHover={{ y: -8 }}
            >
              <div className="service-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <Link to={s.link}>{s.cta} ←</Link>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ===== Showcase 3D ===== */}
      <ShowcaseSection />

      {/* ===== Testimonials ===== */}
      <Testimonials />

      {/* ===== CTA ===== */}
      <CtaSection />
    </>
  )
}

export default Home