const brands = [
  '🏋️ NIKE', '⚡ ADIDAS', '🔥 UNDER ARMOUR', '💪 PUMA', '🎯 REEBOK',
  '🏆 GYMSHARK', '⚙️ MYPROTEIN', '🥗 OPTIMUM NUTRITION', '🎽 ASICS',
]

export default function MarqueeBrands() {
  return (
    <section className="marquee-section">
      <div className="marquee-track">
        {[...brands, ...brands].map((brand, i) => (
          <span key={i} className="marquee-item">{brand}</span>
        ))}
      </div>
    </section>
  )
}