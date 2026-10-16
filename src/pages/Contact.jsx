import { useState } from 'react'
import { motion } from 'framer-motion'
import FloatingGlobe from '../components/three/FloatingGlobe'

const contactMethods = [
  {
    id: 'phone',
    icon: '📞',
    title: 'تلفن ثابت',
    value: '۰۲۱-۱۲۳۴۵۶۷۸',
    href: 'tel:+982112345678',
    color: '#c5f36b',
    desc: 'شنبه تا پنجشنبه ۹-۱۸',
  },
  {
    id: 'mobile',
    icon: '📱',
    title: 'موبایل',
    value: '۰۹۱۲-۱۲۳۴۵۶۷',
    href: 'tel:+989121234567',
    color: '#22d3ee',
    desc: 'پاسخگویی سریع',
  },
  {
    id: 'whatsapp',
    icon: '💬',
    title: 'واتساپ',
    value: '۰۹۱۲-۱۲۳۴۵۶۷',
    href: 'https://wa.me/989121234567',
    color: '#25D366',
    desc: 'پیام‌رسان بین‌المللی',
  },
  {
    id: 'eitaa',
    icon: '🔵',
    title: 'ایتا',
    value: 'fitclub_ir',
    href: 'https://eitaa.com/fitclub_ir',
    color: '#0088cc',
    desc: 'پیام‌رسان ایرانی',
  },
  {
    id: 'telegram',
    icon: '✈️',
    title: 'تلگرام',
    value: '@fitclub_ir',
    href: 'https://t.me/fitclub_ir',
    color: '#229ED9',
    desc: 'پیام‌رسان تلگرام',
  },
  {
    id: 'instagram',
    icon: '📷',
    title: 'اینستاگرام',
    value: '@fitclub.ir',
    href: 'https://instagram.com/fitclub.ir',
    color: '#E4405F',
    desc: 'صفحه رسمی FitClub',
  },
  {
    id: 'email',
    icon: '✉️',
    title: 'ایمیل',
    value: 'info@fitclub.ir',
    href: 'mailto:info@fitclub.ir',
    color: '#fbbf24',
    desc: 'پاسخ در ۲۴ ساعت',
  },
]

function Contact() {
  return (
    <div className="courses-page">
      {/* Hero */}
      <section className="hero-section">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="hero-badge">📞 تماس با ما</span>
          <h1>
            با <span>FitClub</span> در تماس باش
          </h1>
          <p>
            از هر راهی که راحتی با ما در ارتباط باش. کارشناسان ما آماده‌ی
            پاسخگویی به سوالات و پیشنهادات شما هستن.
          </p>

          <div className="contact-quick-info">
            <div className="quick-info-item">
              <span>⏰</span>
              <div>
                <strong>ساعت پاسخگویی</strong>
                <p>شنبه تا پنجشنبه ۹:۰۰ - ۱۸:۰۰</p>
              </div>
            </div>
            <div className="quick-info-item">
              <span>⚡</span>
              <div>
                <strong>زمان پاسخ</strong>
                <p>حداکثر ۲۴ ساعت</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <FloatingGlobe />
        </motion.div>
      </section>

      {/* Contact Methods */}
      <section className="courses-main">
        <div className="courses-intro">
          <span className="eyebrow">راه‌های ارتباطی</span>
          <h1>
            هر جا که <span>هستی</span>
          </h1>
          <p>از هر پلتفرمی که دوست داری با ما در تماس باش</p>
        </div>

        <div className="contact-methods-grid">
          {contactMethods.map((method, i) => (
            <motion.a
              key={method.id}
              href={method.href}
              target={method.href.startsWith('http') ? '_blank' : '_self'}
              rel="noopener noreferrer"
              className="contact-method-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -8 }}
              style={{ '--accent': method.color }}
            >
              <div
                className="contact-method-icon"
                style={{ color: method.color }}
              >
                {method.icon}
              </div>
              <div className="contact-method-info">
                <strong>{method.title}</strong>
                <span className="contact-method-value">{method.value}</span>
                <span className="contact-method-desc">{method.desc}</span>
              </div>
              <div className="contact-method-arrow">↗</div>
              <div
                className="contact-method-glow"
                style={{ background: method.color }}
              />
            </motion.a>
          ))}
        </div>

        {/* Address Section */}
        <motion.div
          className="address-section"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="address-card">
            <div className="address-icon">📍</div>
            <div className="address-content">
              <span className="eyebrow">آدرس مجموعه</span>
              <h3>تهران، خیابان ولیعصر</h3>
              <p>
                پلاک ۱۲۳، برج تجاری ولیعصر، طبقه ۴، واحد ۵
                <br />
                کد پستی: ۱۲۳۴۵۶۷۸۹۰
              </p>
              <div className="address-details">
                <span>🚇 مترو: ایستگاه ولیعصر (۵ دقیقه پیاده)</span>
                <span>🚌 اتوبوس: خط ۱۲۳</span>
                <span>🚗 پارکینگ رایگان برای اعضا</span>
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=تهران+خیابان+ولیعصر+پلاک+۱۲۳"
                target="_blank"
                rel="noopener noreferrer"
                className="primary-button"
              >
                🗺 مشاهده روی نقشه
              </a>
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          className="contact-form-wrapper"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginTop: '40px' }}
        >
          <h2>📩 پیام بفرست</h2>
          <p className="contact-form-subtitle">
            هر سوال، پیشنهاد یا انتقادی داری، برامون بنویس
          </p>
          <form
            className="contact-form"
            onSubmit={(e) => {
              e.preventDefault()
              alert('پیام شما ثبت شد! به‌زودی پاسخ می‌دیم. 🙏')
            }}
          >
            <input type="text" placeholder="نام شما" required />
            <input type="email" placeholder="ایمیل" required />
            <input type="tel" placeholder="شماره تماس (اختیاری)" />
            <textarea
              placeholder="پیام شما..."
              rows={5}
              required
            ></textarea>
            <button type="submit" className="primary-button">
              ارسال پیام ✉️
            </button>
          </form>
        </motion.div>
      </section>
    </div>
  )
}

export default Contact