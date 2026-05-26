import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Github, Linkedin, Twitter, Send } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "general",
    message: "",
  });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.from(leftRef.current, {
        x: -30,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
        },
      });

      gsap.from(rightRef.current, {
        x: 30,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const socialLinks = [
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Twitter, href: "#", label: "Twitter" },
  ];

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="bg-[#1f1f1dff]"
      style={{ padding: "120px 0" }}
    >
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left — Contact Info */}
          <div ref={leftRef}>
            <span className="text-gold uppercase tracking-[1.5px] font-sans text-[11px] font-semibold">
              {t("contact.badge")}
            </span>
            <h2
              className="font-heading text-white uppercase mt-2"
              style={{
                fontSize: "clamp(32px, 4vw, 48px)",
                letterSpacing: "-0.5px",
                fontWeight: 400,
              }}
            >
              {t("contact.title")}
            </h2>

            <p
              className="text-soft font-sans text-[15px] mt-12"
              style={{ lineHeight: 1.6 }}
            >
              {t("contact.desc")}
            </p>

            <div className="mt-8 space-y-3">
              <a
                href="mailto:hello@mikron.tech"
                className="block font-sans text-xl font-medium text-white hover:text-gold hover:underline transition-colors"
              >
                hello@mikron.tech
              </a>
              <a
                href="tel:+380445001234"
                className="block font-sans text-xl font-medium text-white hover:text-gold transition-colors"
              >
                +38 (044) 500-12-34
              </a>
              <p className="text-soft font-sans text-[15px] mt-3" style={{ lineHeight: 1.6 }}>
                {t("contact.office")}: Kyiv, Khreshchatyk 22, BC "Gulliver", office 1504
              </p>
            </div>

            <div className="flex items-center gap-4 mt-8">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="text-[#666666] hover:text-gold transition-colors duration-300"
                >
                  <social.icon size={24} />
                </a>
              ))}
            </div>
          </div>

          {/* Right — Contact Form */}
          <div ref={rightRef}>
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#00ff8822] flex items-center justify-center mb-4">
                  <Send size={28} className="text-[#00ff88]" />
                </div>
                <h3 className="font-heading text-2xl text-white">{t("contact.form.success")}</h3>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t("contact.form.name")}
                    required
                    className="w-full bg-[#08080c] border border-[#4b4038] text-white font-sans text-[15px] p-4 focus:border-gold focus:outline-none transition-colors placeholder:text-[#666666] rounded"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t("contact.form.email")}
                    required
                    className="w-full bg-[#08080c] border border-[#4b4038] text-white font-sans text-[15px] p-4 focus:border-gold focus:outline-none transition-colors placeholder:text-[#666666] rounded"
                  />
                </div>
                <div>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-[#08080c] border border-[#4b4038] text-white font-sans text-[15px] p-4 focus:border-gold focus:outline-none transition-colors appearance-none cursor-pointer rounded"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="support">Product Support</option>
                    <option value="enterprise">Enterprise Solutions</option>
                    <option value="partnership">Partnership</option>
                  </select>
                </div>
                <div>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={t("contact.form.message")}
                    rows={5}
                    required
                    className="w-full bg-[#08080c] border border-[#4b4038] text-white font-sans text-[15px] p-4 focus:border-gold focus:outline-none transition-colors resize-none placeholder:text-[#666666] rounded"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full h-[52px] bg-gold text-deep-black font-sans text-[13px] uppercase font-semibold tracking-[1.5px] hover:bg-white hover:shadow-neon-gold transition-all duration-300 rounded"
                >
                  {t("contact.form.submit")}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
