const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#services", label: "Services" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

const Footer = () => (
  <footer className="bg-fox-navy text-white py-10">
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <div className="font-heading font-bold text-lg mb-1">
            <span className="text-fox-orange">Parcel Fox</span> Windhoek
          </div>
          <p className="text-white/60 text-sm italic">
            Delivering Windhoek, One Parcel at a Time.
          </p>
        </div>

        <ul className="flex gap-6">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm text-white/70 hover:text-fox-orange transition-colors"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 pt-6 border-t border-white/10 text-center text-white/40 text-xs">
        © {new Date().getFullYear()} Parcel Fox Windhoek. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
