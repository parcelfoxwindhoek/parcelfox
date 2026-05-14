import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "@/assets/logo.png";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive ? "text-fox-red" : "text-white/80 hover:text-fox-red"
    }`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-fox-navy/95 backdrop-blur shadow-lg" : "bg-fox-navy"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/">
          <img src={logo} alt="Parcel Fox Windhoek" className="h-16" />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex gap-8">
            {navLinks.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.to === "/"} className={linkClass}>
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <a
            href="tel:+264816336344"
            className="inline-flex items-center gap-2 bg-fox-red text-white text-sm font-heading font-semibold px-4 py-2 rounded-lg hover:bg-fox-red/90 transition-colors"
          >
            📞 +264 81 633 6344
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <ul className="md:hidden bg-fox-navy border-t border-white/10 px-4 pb-4">
          {navLinks.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.to === "/"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block py-3 text-sm font-medium ${
                    isActive ? "text-fox-red" : "text-white/80"
                  }`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
          <li>
            <a
              href="tel:+264816336344"
              onClick={() => setMobileOpen(false)}
              className="block mt-2 text-center bg-fox-red text-white font-heading font-semibold py-3 rounded-lg"
            >
              📞 +264 81 633 6344
            </a>
          </li>
        </ul>
      )}
    </header>
  );
};

export default Navbar;
