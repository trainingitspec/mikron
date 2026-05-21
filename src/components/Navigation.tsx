import { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { label: "Компанія", href: "#about" },
  { label: "Продукти", href: "#products" },
  { label: "Блог", href: "#blog" },
  { label: "Контакти", href: "#contact" },
];

export default function Navigation() {
  const [activeSection, setActiveSection] = useState("");
  const { openCart, totalItems } = useCart();

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
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center"
      style={{
        background: "rgba(5, 5, 5, 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid #1a1a1a",
      }}
    >
      <div className="w-full max-w-[1400px] mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          className="text-white text-sm font-bold uppercase tracking-[4px] transition-all duration-300 hover:drop-shadow-[0_0_10px_#ffc447]"
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
              {link.label}
            </a>
          ))}
        </div>

        {/* Cart */}
        <button
          onClick={openCart}
          className="relative p-2 text-soft hover:text-gold transition-colors duration-300"
          aria-label="Відкрити кошик"
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
    </nav>
  );
}
