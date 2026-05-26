import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { ArrowRight, ShoppingCart } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const CATEGORY_COLORS: Record<string, string> = {
  "Операційні системи": "text-cyan border-cyan/20 bg-cyan/5",
  "Аналітика": "text-gold border-gold/20 bg-gold/5",
  "Безпека": "text-magenta border-magenta/20 bg-magenta/5",
  "DevOps": "text-emerald-400 border-emerald-400/20 bg-emerald-400/5",
  "Інше": "text-soft border-white/5 bg-white/5",
};

export default function Products() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  // Show only featured products on homepage (max 3), or fallback to first 3 products
  const featuredProducts = products.filter((p) => p.featured).slice(0, 3);
  const displayList = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 3);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || displayList.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.from(".product-row", {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: listRef.current,
          start: "top 90%",
        },
      });
    }, section);

    return () => ctx.revert();
  }, [displayList]);

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <section
      id="products"
      ref={sectionRef}
      className="bg-deep-black border-y border-white/5"
      style={{ padding: "80px 0" }}
    >
      <div className="max-w-[1100px] mx-auto px-6">
        
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-gold uppercase tracking-[2px] font-sans text-[10px] font-semibold">
              ПРОДУКТИ
            </span>
            <h2
              className="font-heading text-white uppercase mt-1"
              style={{
                fontSize: "clamp(24px, 3vw, 36px)",
                letterSpacing: "-0.5px",
                fontWeight: 400,
              }}
            >
              Ключові рішення
            </h2>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-soft hover:text-gold font-sans text-[12px] uppercase tracking-[1px] transition-colors duration-300 group"
          >
            Всі рішення
            <ArrowRight
              size={13}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Minimal List */}
        <div ref={listRef} className="flex flex-col divide-y divide-white/5 border-t border-b border-white/5">
          {displayList.map((product) => {
            const badgeClass = CATEGORY_COLORS[product.category] ?? CATEGORY_COLORS["Інше"];
            const isAdded = addedId === product.id;

            return (
              <div
                key={product.id}
                className="product-row group flex flex-col md:flex-row md:items-center justify-between gap-4 py-5 transition-all duration-300 hover:bg-white/[0.01] px-4 -mx-4 rounded-lg"
              >
                {/* Product Name & Category */}
                <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 flex-1 min-w-0">
                  <span className={`inline-flex self-start md:self-auto px-2.5 py-0.5 rounded-full border font-sans text-[9px] uppercase tracking-[1px] font-semibold shrink-0 ${badgeClass}`}>
                    {product.category}
                  </span>
                  
                  <div className="min-w-0">
                    <h3 className="font-heading text-white text-[18px] group-hover:text-gold transition-colors duration-200">
                      {product.name}
                    </h3>
                    <p className="text-soft font-sans text-[13px] line-clamp-1 mt-0.5">
                      {product.description}
                    </p>
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 pt-2 md:pt-0 border-t border-white/[0.02] md:border-none">
                  <span className="font-sans text-white text-md font-medium">
                    {product.price.toLocaleString("uk-UA")} ₴
                  </span>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`flex items-center gap-1.5 h-8 px-4 font-sans text-[10px] uppercase tracking-[0.5px] font-semibold rounded transition-all duration-300 ${
                      isAdded
                        ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                        : "border border-white/10 text-soft hover:border-gold hover:text-gold"
                    }`}
                  >
                    {isAdded ? "✓" : <ShoppingCart size={11} />}
                    {isAdded ? "Додано" : "В кошик"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
