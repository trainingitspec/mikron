import { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";

export default function Navigation() {
  const [activeSection, setActiveSection] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { openCart, totalItems } = useCart();
  const { lang, setLang, t } = useLanguage();

  const navLinks = [
    { key: "nav.company", href: "#about" },
    { key: "nav.products", href: "/products" },
    { key: "nav.blog", href: "/blog" },
    { key: "nav.reports", href: "/reports" },
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

  // Prevent background scrolling when mobile menu overlay is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = `/${href}`;
    }
  };

  const handleMobileNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    handleNavClick(e, href);
    setIsOpen(false);
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
            setIsOpen(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          MIKRON
        </a>

        {/* Desktop Nav Links (lg and above) */}
        <div className="hidden lg:flex items-center gap-8">
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

        {/* Action Panel: Cart, Desktop Lang, Mobile Burger Toggle */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Desktop Language Switcher */}
          <button
            onClick={() => setLang(lang === "ua" ? "en" : "ua")}
            className="hidden lg:block px-2.5 py-1 rounded border border-[#4b4038] text-soft hover:text-gold hover:border-gold font-sans text-[11px] font-semibold transition-all duration-300 uppercase"
            title={lang === "ua" ? "Switch to English" : "Переключити на українську"}
          >
            {lang === "ua" ? "EN" : "UA"}
          </button>

          {/* Cart Trigger */}
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

          {/* Burger Menu Button (less than lg) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-soft hover:text-gold transition-colors duration-300 focus:outline-none"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            <div className="relative w-5 h-5 flex items-center justify-center">
              <span
                className={`absolute block w-5 h-0.5 bg-current transition-all duration-300 ease-in-out ${
                  isOpen ? "rotate-45" : "-translate-y-1.5"
                }`}
              />
              <span
                className={`absolute block w-5 h-0.5 bg-current transition-all duration-300 ease-in-out ${
                  isOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute block w-5 h-0.5 bg-current transition-all duration-300 ease-in-out ${
                  isOpen ? "-rotate-45" : "translate-y-1.5"
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Glassmorphic Dropdown Menu overlay */}
      <div
        className={`fixed top-16 left-0 right-0 bottom-0 bg-[#08080c]/95 backdrop-blur-lg border-t border-[#4b4038]/20 z-40 lg:hidden flex flex-col items-center justify-center transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center gap-6 text-center">
          {navLinks.map((link) => (
            link.href.startsWith("#") ? (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleMobileNavClick(e, link.href)}
                className={`text-lg font-semibold uppercase tracking-[2.5px] py-2 px-6 transition-all duration-200 ${
                  activeSection === link.href.slice(1)
                    ? "text-gold scale-105"
                    : "text-soft hover:text-white active:text-gold"
                }`}
              >
                {t(link.key)}
              </a>
            ) : (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-lg font-semibold uppercase tracking-[2.5px] py-2 px-6 transition-all duration-200 ${
                  activeSection === link.href.slice(1)
                    ? "text-gold scale-105"
                    : "text-soft hover:text-white active:text-gold"
                }`}
              >
                {t(link.key)}
              </Link>
            )
          ))}

          {/* Integrated Mobile Language Switcher */}
          <div className="flex items-center gap-3 mt-8 border-t border-[#4b4038]/20 pt-8 w-48 justify-center">
            <span className="text-[10px] text-soft font-sans uppercase tracking-[1.5px] opacity-65">
              {lang === "ua" ? "Мова:" : "Language:"}
            </span>
            <button
              onClick={() => {
                setLang("ua");
                setIsOpen(false);
              }}
              className={`px-3 py-1 text-xs font-semibold rounded transition-all duration-300 ${
                lang === "ua"
                  ? "bg-gold/10 border border-gold text-gold"
                  : "border border-[#4b4038]/40 text-soft hover:text-white"
              }`}
            >
              UA
            </button>
            <button
              onClick={() => {
                setLang("en");
                setIsOpen(false);
              }}
              className={`px-3 py-1 text-xs font-semibold rounded transition-all duration-300 ${
                lang === "en"
                  ? "bg-gold/10 border border-gold text-gold"
                  : "border border-[#4b4038]/40 text-soft hover:text-white"
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
