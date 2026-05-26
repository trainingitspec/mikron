import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "@/context/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.from(leftRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
        },
      });

      gsap.from(rightRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.7,
        delay: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
        },
      });

      gsap.from(statsRef.current?.children || [], {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 90%",
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const stats = [
    { value: "150+", labelKey: "about.stat.projects" },
    { value: "50+", labelKey: "about.stat.countries" },
    { value: "8", labelKey: "about.stat.experience" },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="bg-[#08080C]"
      style={{ padding: "120px 0" }}
    >
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 lg:gap-16">
          {/* Left Column */}
          <div ref={leftRef}>
            <span
              className="text-gold uppercase tracking-[1.5px] font-sans text-[11px] font-semibold"
            >
              {t("about.badge")}
            </span>
            <h2
              className="font-heading text-white uppercase mt-6"
              style={{
                fontSize: "clamp(26px, 3.5vw, 42px)",
                letterSpacing: "-0.5px",
                lineHeight: 1.15,
                fontWeight: 400,
              }}
            >
              {t("about.title")}
            </h2>
          </div>

          {/* Right Column */}
          <div ref={rightRef}>
            <p
              className="text-soft font-sans text-[15px] leading-relaxed"
              style={{ lineHeight: 1.6 }}
            >
              {t("about.desc1")}
            </p>
            <p
              className="text-soft font-sans text-[15px] leading-relaxed mt-4"
              style={{ lineHeight: 1.6 }}
            >
              {t("about.desc2")}
            </p>

            {/* Stats */}
            <div
              ref={statsRef}
              className="flex mt-12 divide-x divide-[#4b4038]/30"
            >
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className={`flex-1 text-center ${i === 0 ? "pl-0" : "pl-6"} ${
                    i === stats.length - 1 ? "pr-0" : "pr-6"
                  }`}
                >
                  <div
                    className="font-heading text-gold"
                    style={{
                      fontSize: "clamp(28px, 3vw, 48px)",
                      fontWeight: 400,
                      letterSpacing: "-0.5px",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="text-muted-foreground uppercase tracking-[1.5px] font-sans text-[10px] font-semibold mt-2"
                  >
                    {t(stat.labelKey)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
