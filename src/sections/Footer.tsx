import { Github, Linkedin, Twitter } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const companyLinks = [
  { key: "footer.about", href: "#about" },
  { key: "footer.team", href: "#" },
  { key: "footer.careers", href: "#" },
];

const productLinks = [
  { label: "CloudOS", href: "#products" },
  { label: "DataForge", href: "#products" },
  { label: "SecureLink", href: "#products" },
  { label: "DevPulse", href: "#products" },
];

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer
      className="bg-deep-black border-t border-charcoal"
      style={{ padding: "120px 0 48px" }}
    >
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo & Tagline */}
          <div>
            <span className="text-white text-sm font-bold uppercase tracking-[4px]">
              MIKRON
            </span>
            <p
              className="text-[#666666] font-sans text-[15px] mt-4"
              style={{ lineHeight: 1.6 }}
            >
              {t("footer.tagline")}
            </p>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-sans text-sm font-medium uppercase tracking-[1.5px] mb-4">
              {t("footer.company")}
            </h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.key}>
                  <a
                    href={link.href}
                    className="text-soft font-sans text-[15px] hover:text-white transition-colors"
                    style={{ lineHeight: 1.6 }}
                  >
                    {t(link.key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-white font-sans text-sm font-medium uppercase tracking-[1.5px] mb-4">
              {t("footer.products")}
            </h4>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-soft font-sans text-[15px] hover:text-white transition-colors"
                    style={{ lineHeight: 1.6 }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="text-white font-sans text-sm font-medium uppercase tracking-[1.5px] mb-4">
              {t("footer.contacts")}
            </h4>
            <div className="space-y-2">
              <a
                href="mailto:hello@mikron.tech"
                className="block text-soft font-sans text-[15px] hover:text-gold transition-colors"
              >
                hello@mikron.tech
              </a>
              <a
                href="tel:+380445001234"
                className="block text-soft font-sans text-[15px] hover:text-gold transition-colors"
              >
                +38 (044) 500-12-34
              </a>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <a href="#" className="text-[#666666] hover:text-gold transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-[#666666] hover:text-gold transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-[#666666] hover:text-gold transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Row 2 — Copyright */}
        <div className="mt-16 pt-8 border-t border-charcoal text-center">
          <p className="text-[#666666] uppercase tracking-[1.5px] font-sans text-[11px] font-medium">
            © 2026 Mikron. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
