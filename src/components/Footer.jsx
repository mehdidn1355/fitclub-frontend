import { Link } from 'react-router-dom'

const socialLinks = [
  {
    id: 'whatsapp',
    icon: '💬',
    title: 'واتساپ',
    href: 'https://wa.me/989121234567',
    color: '#25D366',
  },
  {
    id: 'eitaa',
    icon: '🔵',
    title: 'ایتا',
    href: 'https://eitaa.com/fitclub_ir',
    color: '#0088cc',
  },
  {
    id: 'instagram',
    icon: '📷',
    title: 'اینستاگرام',
    href: 'https://instagram.com/fitclub.ir',
    color: '#E4405F',
  },
  {
    id: 'telegram',
    icon: '✈️',
    title: 'تلگرام',
    href: 'https://t.me/fitclub_ir',
    color: '#0088cc',
  },
  {
    id: 'phone',
    icon: '📞',
    title: 'تماس',
    href: 'tel:+982112345678',
    color: '#c5f36b',
  },
  {
    id: 'email',
    icon: '✉️',
    title: 'ایمیل',
    href: 'mailto:info@fitclub.ir',
    color: '#fbbf24',
  },
]

export default function Footer() {
  return (
    <footer className="footer">
      {/* Newsletter / Social Row */}
      <div className="footer-social-row">
        <div className="footer-social-text">
          <strong>با ما در ارتباط باش</strong>
          <span>آخرین اخبار و تخفیف‌ها رو دنبال کن</span>
        </div>

        <div className="footer-social-icons">
          {socialLinks.map((social) => (
            <a
              key={social.id}
              href={social.href}
              target={social.href.startsWith('http') ? '_blank' : '_self'}
              rel="noopener noreferrer"
              className="footer-social-icon"
              title={social.title}
              style={{ '--icon-color': social.color }}
            >
              <span>{social.icon}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Main Columns */}
      <div className="footer-columns">
        <div className="footer-col">
          <div className="brand">
            FIT<span>CLUB</span>
          </div>
          <p className="footer-copy">
            پلتفرم آموزش، رزرو و فروشگاه ورزشی
            <br />
            بدنت رو بساز، ذهنت رو قوی کن 💪
          </p>
          <div className="footer-contact-mini">
            <a href="tel:+982112345678">📞 ۰۲۱-۱۲۳۴۵۶۷۸</a>
            <a href="mailto:info@fitclub.ir">✉️ info@fitclub.ir</a>
          </div>
        </div>

        <div className="footer-col">
          <h4>دسترسی سریع</h4>
          <Link to="/courses">دوره‌ها</Link>
          <Link to="/trainers">مربیان</Link>
          <Link to="/products">فروشگاه</Link>
          <Link to="/ai-trainer">مربی AI</Link>
        </div>

        <div className="footer-col">
          <h4>پشتیبانی</h4>
          <Link to="/contact">تماس با ما</Link>
          <a href="#">سوالات متداول</a>
          <a href="#">قوانین</a>
          <a href="#">حریم خصوصی</a>
        </div>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p className="footer-copy">
          © ۱۴۰۴ FitClub — تمام حقوق محفوظ است.
        </p>
        <p className="footer-copy footer-made">
          ساخته شده با ❤️ در ایران
        </p>
      </div>
    </footer>
  )
}