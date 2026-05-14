import { useEffect, useState, type ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 left-6 z-50 bg-fox-red text-white w-12 h-12 rounded-full shadow-lg hover:bg-fox-red/90 transition-all text-xl"
      aria-label="Scroll to top"
    >
      ↑
    </button>
  );
};

const Layout = ({ children }: { children: ReactNode }) => (
  <main>
    <Navbar />
    {children}
    <Footer />
    <ScrollToTop />
    <WhatsAppButton />
  </main>
);

export default Layout;
