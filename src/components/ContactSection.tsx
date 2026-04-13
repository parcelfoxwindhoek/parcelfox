import { useState } from "react";

const ContactSection = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-20 bg-fox-light">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-fox-navy text-center mb-4">
          Contact Parcel Fox Windhoek
        </h2>
        <h3 className="font-heading font-semibold text-lg text-fox-orange text-center mb-10">
          Request a Pickup or Get a Quote
        </h3>

        {submitted ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <div className="text-5xl mb-4">✅</div>
            <p className="font-heading font-semibold text-xl text-fox-navy">
              Thank you! We'll be in touch shortly.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-sm p-6 md:p-8 space-y-5"
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <input
                required
                type="text"
                placeholder="Full Name"
                className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-fox-orange/50"
              />
              <input
                required
                type="tel"
                placeholder="Phone Number"
                className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-fox-orange/50"
              />
            </div>
            <input
              required
              type="email"
              placeholder="Email Address"
              className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-fox-orange/50"
            />
            <div className="grid sm:grid-cols-2 gap-5">
              <input
                required
                type="text"
                placeholder="Pickup Address"
                className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-fox-orange/50"
              />
              <input
                required
                type="text"
                placeholder="Delivery Address"
                className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-fox-orange/50"
              />
            </div>
            <textarea
              required
              rows={4}
              placeholder="Parcel Description"
              className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-fox-orange/50 resize-none"
            />
            <button
              type="submit"
              className="w-full bg-fox-orange text-white font-heading font-semibold py-3 rounded-lg hover:bg-fox-orange/90 transition-colors"
            >
              Submit Request
            </button>
          </form>
        )}

        <div className="mt-10 grid sm:grid-cols-3 gap-4 text-center text-sm">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl mb-1">📞</div>
            <p className="text-muted-foreground">+264 81 633 6344</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl mb-1">📧</div>
            <p className="text-muted-foreground">parcelfoxwindhoek@gmail.com</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl mb-1">📍</div>
            <p className="text-muted-foreground">Windhoek, Namibia</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
