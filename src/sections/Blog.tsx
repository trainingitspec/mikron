import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { blogPosts } from "@/data/blog";

gsap.registerPlugin(ScrollTrigger);

export default function Blog() {
  const sectionRef = useRef<HTMLElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const sideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.from(featuredRef.current, {
        x: -30,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
        },
      });

      const sideCards = sideRef.current?.querySelectorAll(".side-post");
      if (sideCards) {
        gsap.from(sideCards, {
          y: 30,
          opacity: 0,
          duration: 0.5,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sideRef.current,
            start: "top 85%",
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const featured = blogPosts.find((p) => p.featured);
  const sidePosts = blogPosts.filter((p) => !p.featured);

  return (
    <section
      id="blog"
      ref={sectionRef}
      className="bg-deep-black"
      style={{ padding: "120px 0" }}
    >
      <div className="max-w-[1400px] mx-auto px-6">
        <span className="text-gold uppercase tracking-[1.5px] font-sans text-[11px] font-medium">
          БЛОГ
        </span>
        <h2
          className="font-heading text-white uppercase mt-2"
          style={{
            fontSize: "clamp(32px, 4vw, 48px)",
            letterSpacing: "-0.5px",
            fontWeight: 400,
          }}
        >
          Останні публікації
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12">
          {/* Featured Post */}
          {featured && (
            <div
              ref={featuredRef}
              className="lg:col-span-2 group cursor-pointer"
            >
              <div className="relative aspect-video rounded overflow-hidden">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <span className="text-muted-foreground uppercase tracking-[1.5px] font-sans text-[11px] font-medium mt-6 block">
                {featured.date}
              </span>
              <h3
                className="font-heading text-white mt-2 transition-colors duration-300 group-hover:text-gold"
                style={{
                  fontSize: "clamp(24px, 2.5vw, 32px)",
                  fontWeight: 400,
                  lineHeight: 1.2,
                }}
              >
                {featured.title}
              </h3>
              <p
                className="text-soft font-sans text-[15px] mt-2 line-clamp-2"
                style={{ lineHeight: 1.6 }}
              >
                {featured.excerpt}
              </p>
              <span className="text-gold font-sans text-[15px] mt-4 inline-flex items-center gap-2 group-hover:text-white transition-colors">
                Читати далі →
              </span>
            </div>
          )}

          {/* Side Posts */}
          <div ref={sideRef} className="flex flex-col gap-6">
            {sidePosts.map((post) => (
              <div
                key={post.id}
                className="side-post group cursor-pointer"
              >
                <div className="relative aspect-[4/3] rounded overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <span className="text-muted-foreground uppercase tracking-[1.5px] font-sans text-[11px] font-medium mt-4 block">
                  {post.date}
                </span>
                <h4
                  className="font-heading text-white mt-1 transition-colors duration-300 group-hover:text-gold line-clamp-2"
                  style={{ fontSize: "20px", fontWeight: 400, lineHeight: 1.3 }}
                >
                  {post.title}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
