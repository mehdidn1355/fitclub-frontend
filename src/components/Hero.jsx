
function Hero() {
  return (
    <section className="hero-section" id="home">
      <div className="hero-content">
        <span className="eyebrow">
          قوی‌تر شو، بهتر زندگی کن
        </span>

        <h1>
          بهترین نسخه
          <br />
          <span>خودت باش</span>
        </h1>

        <p>
          با مربیان حرفه‌ای تمرین کن، دوره‌های تخصصی یاد بگیر
          و مسیر تناسب اندامت را هوشمندانه پیش ببر.
        </p>

        <div className="hero-actions">
          <a className="primary-button" href="#trainers">
            رزرو مربی
          </a>

          <a className="secondary-button" href="#courses">
            مشاهده دوره‌ها
          </a>
        </div>

        <div className="hero-stats">
          <div>
            <strong>۲۰+</strong>
            <span>مربی حرفه‌ای</span>
          </div>

          <div>
            <strong>۵۰+</strong>
            <span>دوره آموزشی</span>
          </div>

          <div>
            <strong>۱۰۰۰+</strong>
            <span>عضو فعال</span>
          </div>
        </div>
      </div>

      <div className="hero-visual">
        <div className="visual-circle">
          <span>FIT</span>
          <strong>YOUR</strong>
          <span>LIMITS</span>
        </div>

        <div className="floating-card">
          <span>هدف امروز</span>
          <strong>قوی‌تر از دیروز 💪</strong>
        </div>
      </div>
    </section>
  )
}

export default Hero
