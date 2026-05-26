import { useEffect, useRef } from "react";
import CyberCanvas from "@/components/CyberCanvas";
import gsap from "gsap";
import { useLanguage } from "@/context/LanguageContext";

export default function Hero() {
  const { t } = useLanguage();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
      delay: 0.3,
    })
      .to(
        taglineRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.4"
      )
      .to(
        ctaRef.current,
        {
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
        },
        "-=0.3"
      )
      .to(
        scrollRef.current,
        {
          opacity: 1,
          duration: 0.5,
        },
        "-=0.1"
      );

    return () => {
      tl.kill();
    };
  }, []);

  const handleCtaClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.querySelector("#products");
    if (target) target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden"
      style={{ height: "100vh", background: "#08080C" }}
    >
      <CyberCanvas />

      {/* Content */}
      <div
        className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6"
        style={{ transform: "translateY(-40px)" }}
      >
        <div className="mb-2">
          <span className="text-gold uppercase tracking-[3px] font-sans text-[11px] font-semibold">
            {t("hero.subtitle")}
          </span>
        </div>

        <h1
          ref={titleRef}
          className="font-heading text-white uppercase opacity-0 translate-y-5 flex flex-col items-center"
          style={{
            fontSize: "clamp(36px, 7vw, 76px)",
            letterSpacing: "-1.5px",
            fontWeight: 400,
            lineHeight: 1.1,
          }}
        >
          <span>{t("hero.title1")}</span>
          <span className="text-gold">{t("hero.title2")}</span>
        </h1>

        <p
          ref={taglineRef}
          className="text-soft mt-6 opacity-0 translate-y-4"
          style={{
            fontSize: "15px",
            fontWeight: 400,
            lineHeight: 1.6,
            maxWidth: "520px",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {t("hero.description")}
        </p>

        <a
          ref={ctaRef}
          href="#products"
          onClick={handleCtaClick}
          className="mt-10 opacity-0 inline-flex items-center justify-center text-gold border border-gold font-sans text-[13px] uppercase font-medium tracking-[1.5px] transition-all duration-300 hover:bg-gold hover:text-deep-black hover:shadow-neon-gold rounded"
          style={{ width: "190px", height: "50px" }}
        >
          {t("hero.cta.products")}
        </a>
      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center opacity-0"
      >
        <div className="relative w-[1px] h-10 bg-gold/30">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[6px] h-[6px] rounded-full bg-gold animate-scroll-dot"
          />
        </div>
      </div>
    </section>
  );
}
