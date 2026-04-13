const services = [
  {
    emoji: "⚡",
    title: "Same-Day Delivery",
    desc: "Need it there today? We pick up and deliver your parcel across Windhoek within hours — fast, tracked, and reliable.",
  },
  {
    emoji: "🎁",
    title: "Gift & Flower Delivery",
    desc: "Surprise someone special in Windhoek with a beautifully handled gift or fresh flower delivery straight to their door.",
  },
  {
    emoji: "💊",
    title: "Medicine & Pharmacy Delivery",
    desc: "We safely deliver prescriptions and pharmacy items across Windhoek so you or your loved ones never miss a dose.",
  },
  {
    emoji: "📄",
    title: "Document & Parcel Delivery",
    desc: "From important documents to medium-sized parcels, we handle your items with care and deliver them on time.",
  },
  {
    emoji: "🏢",
    title: "Business Courier Solutions",
    desc: "Tailored courier services for Windhoek businesses — regular pickups, bulk deliveries, and reliable scheduling.",
  },
];

const ServicesSection = () => (
  <section id="services" className="py-20 bg-fox-light">
    <div className="max-w-6xl mx-auto px-4">
      <h2 className="font-heading font-bold text-3xl md:text-4xl text-fox-navy text-center mb-4">
        Our Delivery Services in Windhoek
      </h2>
      <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
        Whether it's a last-minute gift, an important document, or a pharmacy
        pickup — Parcel Fox Windhoek has you covered with fast, affordable
        delivery across Windhoek, Namibia.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s) => (
          <article
            key={s.title}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-border"
          >
            <div className="text-4xl mb-4">{s.emoji}</div>
            <h3 className="font-heading font-semibold text-lg text-fox-navy mb-2">
              {s.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {s.desc}
            </p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default ServicesSection;
