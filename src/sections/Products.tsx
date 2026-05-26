import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";

gsap.registerPlugin(ScrollTrigger);

export default function Products() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    // Register plugin once – safe for SSR environments
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    const section = sectionRef.current;
    if (!section || !products || products.length === 0) return;

    const ctx = gsap.context(() => {
      const cards = cardsRef.current?.querySelectorAll(".product-card");
      if (cards) {
        gsap.from(cards, {
          y: 40,
          opacity: 0,
          duration: 0.5,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 85%",
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  // Guard against empty product list – show fallback UI
  if (!products || products.length === 0) {
    return (
      <section id="products" className="bg-warm-black py-20" style={{ padding: "120px 0" }}>
        <div className="max-w-[1400px] mx-auto px-6 text-center text-white">
          <h2 className="text-2xl font-bold">Наразі немає доступних продуктів.</h2>
        </div>
      </section>
    );
  }

  return (
    <section
      id="products"
      ref={sectionRef}
      className="bg-warm-black"
      style={{ padding: "120px 0" }}
    >
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-gold uppercase tracking-[1.5px] font-sans text-[11px] font-medium">
            ПРОДУКТИ
          </span>
          <span className="text-muted-foreground font-sans text-[15px]">
            {products.length} продукти
          </span>
        </div>

        <h2
          className="font-serif text-white uppercase mt-6"
          style={{
            fontSize: "clamp(32px, 4vw, 48px)",
            letterSpacing: "-0.5px",
            fontWeight: 400,
          }}
        >
          Наші рішення
        </h2>

        {/* Product Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12"
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="product-card group bg-[#121212] border border-charcoal rounded overflow-hidden transition-all duration-300 hover:border-gold-dim hover:shadow-neon-gold hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative aspect-[16/10] bg-[#0a0a0a] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2">
                  <span
                    className="w-[6px] h-[6px] bg-cyan"
                    style={{ boxShadow: "0 0 6px #00f0ff" }}
                  />
                  <span className="text-cyan uppercase tracking-[1.5px] font-sans text-[11px] font-medium">
                    {product.category.toUpperCase()}
                  </span>
                </div>

                <h3
                  className="font-serif text-white mt-2"
                  style={{ fontSize: "28px", fontWeight: 400 }}
                >
                  {product.name}
                </h3>

                <p
                  className="text-soft font-sans text-sm mt-2 line-clamp-2"
                  style={{ lineHeight: 1.6 }}
                >
                  {product.description}
                </p>

                <div className="flex items-center justify-between mt-6">
                  <span className="text-gold text-2xl font-semibold font-sans">
                    {product.price.toLocaleString("uk-UA")} ₴
                  </span>
                  <button
                    onClick={() => addToCart(product)}
                    className="h-10 px-6 bg-gold text-deep-black font-sans text-[11px] uppercase font-semibold tracking-[1px] hover:bg-white transition-colors duration-300"
                  >
                    В кошик
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-12">
          <span className="text-gold font-sans text-[15px] hover:text-white transition-colors cursor-pointer inline-flex items-center gap-2">
            Переглянути всі продукти →
          </span>
        </div>
      </div>
    </section>
  );
}
