const HeroSection = () => (
  <section
    id="home"
    className="relative min-h-screen flex items-center bg-fox-navy overflow-hidden"
  >
    {/* Decorative gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-fox-navy via-fox-navy to-fox-red/20" />
    <div className="absolute top-20 right-0 w-96 h-96 bg-fox-red/10 rounded-full blur-3xl" />
    <div className="absolute bottom-0 left-0 w-72 h-72 bg-fox-red/5 rounded-full blur-3xl" />

    <div className="relative max-w-4xl mx-auto px-4 pt-24 pb-16 text-center">
      <div className="inline-block bg-fox-red/10 text-fox-red text-sm font-medium px-4 py-1.5 rounded-full mb-6">
        📦 Windhoek's #1 Local Courier
      </div>

      <h1 className="font-heading font-extrabold text-4xl sm:text-5xl md:text-6xl text-white leading-tight mb-6">
        Reliable parcel delivery services in{" "}
        <span className="text-fox-red">Windhoek</span>
      </h1>

      <h2 className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-4 font-body">
        Same-day pickup and delivery across Windhoek — gifts, flowers, medicine,
        and more.
      </h2>

      <p className="text-white/50 max-w-xl mx-auto mb-10 text-sm leading-relaxed">
        Parcel Fox Windhoek is your trusted neighbourhood courier. We pick up
        from your door and deliver across Windhoek — safely, quickly,
        and affordably.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href="tel:+264816336344"
          className="inline-block bg-fox-red text-white font-heading font-semibold px-8 py-3.5 rounded-lg hover:bg-fox-red/90 transition-colors shadow-lg shadow-fox-red/25"
        >
          📞 Call Now
        </a>
        <Link
          to="/services"
          className="inline-block border-2 border-white/20 text-white font-heading font-semibold px-8 py-3.5 rounded-lg hover:border-fox-red hover:text-fox-red transition-colors"
        >
          Our Services
        </Link>
      </div>
    </div>
  </section>
);

export default HeroSection;
