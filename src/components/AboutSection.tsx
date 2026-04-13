const AboutSection = () => (
  <section id="about" className="py-20 bg-white">
    <div className="max-w-4xl mx-auto px-4">
      <h2 className="font-heading font-bold text-3xl md:text-4xl text-fox-navy text-center mb-4">
        About Parcel Fox Windhoek
      </h2>
      <h3 className="font-heading font-semibold text-xl text-fox-red text-center mb-8">
        Windhoek's Trusted Local Delivery Partner
      </h3>

      <div className="space-y-4 text-muted-foreground leading-relaxed mb-10">
        <p>
          Parcel Fox Windhoek is a locally owned and operated delivery service
          built by a Windhoek resident, for Windhoek residents. We understand the
          city's roads, neighbourhoods, and rhythm — which means your parcels get
          where they need to go, fast.
        </p>
        <p>
          From the heart of the CBD to the suburbs of Khomasdal, Katutura,
          Kleine Kuppe, and beyond, we provide same-day pickup and delivery you
          can count on. Whether you're sending a birthday gift, picking up
          medicine, or shipping documents across town, we treat every parcel as
          if it were our own.
        </p>
        <p>
          We're proud to serve the community of Windhoek, and we're
          committed to making local delivery simple, affordable, and stress-free
          for everyone.
        </p>
      </div>

      <h3 className="font-heading font-semibold text-xl text-fox-navy mb-4">
        Why Choose Us?
      </h3>
      <ul className="grid sm:grid-cols-2 gap-3">
        {[
          "⏱ Fast turnaround — most deliveries completed same day",
          "🛡 Safe handling of fragile, medical, and sensitive items",
          "💰 Affordable rates with no hidden fees",
          "📍 Deep local knowledge of every Windhoek neighbourhood",
        ].map((item) => (
          <li
            key={item}
            className="flex items-start gap-2 bg-fox-light rounded-lg p-4 text-sm text-foreground"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default AboutSection;
