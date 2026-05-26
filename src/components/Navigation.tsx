import { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";

export default function Navigation() {
  const [activeSection, setActiveSection] = useState("");
  const { openCart, totalItems } = useCart();
  const { lang, setLang, t } = useLanguage();

  const navLinks = [
    { key: "nav.company", href: "#about" },
    { key: "nav.products", href: "/products" },
    { key: "nav.blog", href: "/blog" },
    { key: "nav.contact", href: "#contact" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.15, rootMargin: "-64px 0px 0px 0px" }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = `/${href}`;
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center bg-[#08080c]/85 border-b border-[#4b4038]/30 backdrop-blur-md"
    >
      <div className="w-full max-w-[1400px] mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          className="text-white text-sm font-bold uppercase tracking-[4px] transition-all duration-300 hover:drop-shadow-[0_0_10px_#CAAA98]"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          MIKRON
        </a>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            link.href.startsWith("#") ? (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`text-xs font-medium uppercase tracking-[1.5px] transition-colors duration-300 ${
                  activeSection === link.href.slice(1)
                    ? "text-gold"
                    : "text-soft hover:text-white"
                }`}
              >
                {t(link.key)}
              </a>
            ) : (
              <Link
                key={link.href}
                to={link.href}
                className={`text-xs font-medium uppercase tracking-[1.5px] transition-colors duration-300 ${
                  activeSection === link.href.slice(1)
                    ? "text-gold"
                    : "text-soft hover:text-white"
                }`}
              >
                {t(link.key)}
              </Link>
            )
          ))}
        </div>

        {/* Language Switcher & Cart */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setLang(lang === "ua" ? "en" : "ua")}
            className="px-2.5 py-1 rounded border border-[#4b4038] text-soft hover:text-gold hover:border-gold font-sans text-[11px] font-semibold transition-all duration-300 uppercase"
            title={lang === "ua" ? "Switch to English" : "Переключити на українську"}
          >
            {lang === "ua" ? "EN" : "UA"}
          </button>

          <button
            onClick={openCart}
            className="relative p-2 text-soft hover:text-gold transition-colors duration-300"
            aria-label={t("nav.cart")}
          >
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span
                className="absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full bg-gold text-deep-black flex items-center justify-center text-[10px] font-semibold"
              >
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
