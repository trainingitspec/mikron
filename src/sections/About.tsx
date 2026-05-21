import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
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
    { value: "150+", label: "Проєктів реалізовано" },
    { value: "50+", label: "Країн світу" },
    { value: "8", label: "Років на ринку" },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="bg-deep-black"
      style={{ padding: "120px 0" }}
    >
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 lg:gap-16">
          {/* Left Column */}
          <div ref={leftRef}>
            <span
              className="text-gold uppercase tracking-[1.5px] font-sans text-[11px] font-medium"
            >
              ПРО КОМПАНІЮ
            </span>
            <h2
              className="font-serif text-white uppercase mt-6"
              style={{
                fontSize: "clamp(32px, 4vw, 48px)",
                letterSpacing: "-0.5px",
                lineHeight: 1.15,
                fontWeight: 400,
              }}
            >
              Ми створюємо програмне забезпечення, яке трансформує бізнеси та
              визначає технологічні стандарти завтрашнього дня
            </h2>
          </div>

          {/* Right Column */}
          <div ref={rightRef}>
            <p
              className="text-soft font-sans text-[15px] leading-relaxed"
              style={{ lineHeight: 1.6 }}
            >
              Mikron — це команда інженерів, дизайнерів та візіонерів, об&apos;єднаних
              спільною метою: розробляти програмні рішення, що поєднують передові
              технології з інтуїтивною простотою. З 2018 року ми постачаємо
              продукти для компаній по всьому світу — від стартапів до корпорацій
              Fortune 500.
            </p>

            {/* Stats */}
            <div
              ref={statsRef}
              className="flex mt-12 divide-x divide-charcoal"
            >
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className={`flex-1 text-center ${i === 0 ? "pl-0" : "pl-6"} ${
                    i === stats.length - 1 ? "pr-0" : "pr-6"
                  }`}
                >
                  <div
                    className="font-serif text-gold"
                    style={{
                      fontSize: "clamp(28px, 3vw, 48px)",
                      fontWeight: 400,
                      letterSpacing: "-0.5px",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="text-muted-foreground uppercase tracking-[1.5px] font-sans text-[11px] font-medium mt-2"
                  >
                    {stat.label}
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
