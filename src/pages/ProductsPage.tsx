import { useState, useMemo } from "react";
import { ShoppingCart, SlidersHorizontal, Star, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { products as ALL_PRODUCTS, type Product } from "@/data/products";


const CATEGORY_COLORS: Record<string, string> = {
  "Операційні системи": "text-cyan border-cyan/30 bg-cyan/5",
  "Аналітика": "text-gold border-gold/30 bg-gold/5",
  "Безпека": "text-magenta border-magenta/30 bg-magenta/5",
  "DevOps": "text-emerald-400 border-emerald-400/30 bg-emerald-400/5",
  "Інше": "text-soft border-white/10 bg-white/5",
};

const CATEGORY_DOT: Record<string, string> = {
  "Операційні системи": "bg-cyan shadow-[0_0_6px_#00f0ff]",
  "Аналітика": "bg-gold shadow-[0_0_6px_#ffc447]",
  "Безпека": "bg-magenta shadow-[0_0_6px_#ff00a0]",
  "DevOps": "bg-emerald-400 shadow-[0_0_6px_#34d399]",
  "Інше": "bg-soft",
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const { addToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState<string>("Всі");
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">("default");
  const [showFilters, setShowFilters] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);

  // Derive unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(ALL_PRODUCTS.map((p) => p.category)));
    return ["Всі", ...cats];
  }, []);

  // Filter + sort
  const displayProducts = useMemo(() => {
    let list =
      activeCategory === "Всі"
        ? ALL_PRODUCTS
        : ALL_PRODUCTS.filter((p) => p.category === activeCategory);

    if (sortBy === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") list = [...list].sort((a, b) => b.price - a.price);

    return list;
  }, [activeCategory, sortBy]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  const isEmpty = ALL_PRODUCTS.length === 0;

  return (
    <main
      className="min-h-screen bg-deep-black"
      style={{ paddingTop: "112px", paddingBottom: "80px" }}
    >
      <div className="max-w-[1400px] mx-auto px-6">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-2 mb-10">
          <span className="text-gold uppercase tracking-[1.5px] font-sans text-[11px] font-medium">
            КАТАЛОГ
          </span>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h1
              className="font-heading text-white uppercase"
              style={{
                fontSize: "clamp(32px, 4vw, 52px)",
                fontWeight: 400,
                letterSpacing: "-0.5px",
              }}
            >
              Наші продукти
            </h1>
            <span className="text-soft font-sans text-sm">
              {displayProducts.length}{" "}
              {displayProducts.length === 1 ? "продукт" : "продукти"}
            </span>
          </div>
          {/* Thin gold divider */}
          <div className="h-px w-full bg-gradient-to-r from-gold/40 via-gold/10 to-transparent mt-4" />
        </div>

        {/* ── Filters row ────────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full font-sans text-[12px] uppercase tracking-[1px] font-medium border transition-all duration-200 ${
                  activeCategory === cat
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-white/10 text-soft hover:border-white/30 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort toggle */}
          <div className="relative">
            <button
              onClick={() => setShowFilters((v) => !v)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-soft hover:text-white hover:border-white/30 font-sans text-[12px] uppercase tracking-[1px] transition-all duration-200"
            >
              <SlidersHorizontal size={14} />
              Сортування
              {showFilters && (
                <X size={12} className="ml-1 opacity-60" />
              )}
            </button>
            {showFilters && (
              <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-white/10 bg-[#121212] shadow-deep z-20 overflow-hidden">
                {[
                  { value: "default", label: "За замовчуванням" },
                  { value: "price-asc", label: "Ціна: від низької" },
                  { value: "price-desc", label: "Ціна: від високої" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setSortBy(opt.value as typeof sortBy);
                      setShowFilters(false);
                    }}
                    className={`w-full px-4 py-3 text-left font-sans text-[13px] transition-colors duration-150 ${
                      sortBy === opt.value
                        ? "text-gold bg-gold/5"
                        : "text-soft hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Empty state ─────────────────────────────────────────────────── */}
        {isEmpty && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div
              className="w-20 h-20 rounded-full border border-white/5 bg-white/3 flex items-center justify-center mb-6"
              style={{ boxShadow: "0 0 40px #ffc44711" }}
            >
              <ShoppingCart size={28} className="text-gold opacity-60" />
            </div>
            <p className="text-white font-heading text-xl uppercase mb-2">
              Каталог порожній
            </p>
            <p className="text-soft font-sans text-sm">
              Додайте перший продукт через адмінку Decap CMS за адресою{" "}
              <span className="text-gold">/admin</span>
            </p>
          </div>
        )}

        {/* ── Products grid ───────────────────────────────────────────────── */}
        {!isEmpty && displayProducts.length === 0 && (
          <p className="text-soft font-sans text-[15px] py-20 text-center">
            У категорії «{activeCategory}» продуктів не знайдено.
          </p>
        )}

        {displayProducts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {displayProducts.map((product) => {
              const isFeatured = product.featured;
              const dotClass = CATEGORY_DOT[product.category] ?? CATEGORY_DOT["Інше"];
              const badgeClass = CATEGORY_COLORS[product.category] ?? CATEGORY_COLORS["Інше"];
              const isAdded = addedId === product.id;

              return (
                <article
                  key={product.id}
                  className={`group relative bg-[#0e0e0e] border rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-neon-gold ${
                    isFeatured ? "border-gold/20" : "border-charcoal"
                  }`}
                >
                  {/* Featured badge */}
                  {isFeatured && (
                    <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 backdrop-blur-sm">
                      <Star size={10} className="text-gold fill-gold" />
                      <span className="text-gold font-sans text-[10px] uppercase tracking-[1.5px] font-semibold">
                        Топ
                      </span>
                    </div>
                  )}

                  {/* Product image */}
                  <div className="relative aspect-[16/10] bg-[#080808] overflow-hidden border-b border-charcoal">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-white/5 font-heading text-5xl uppercase tracking-widest select-none">
                          {product.name.slice(0, 2)}
                        </span>
                      </div>
                    )}
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-transparent to-transparent opacity-60" />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-6">
                    {/* Category badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClass}`} />
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full border font-sans text-[10px] uppercase tracking-[1.5px] font-semibold ${badgeClass}`}>
                        {product.category}
                      </span>
                    </div>

                    {/* Name */}
                    <h2
                      className="font-serif text-white group-hover:text-gold transition-colors duration-300 mb-2 leading-tight"
                      style={{ fontSize: "26px", fontWeight: 400 }}
                    >
                      {product.name}
                    </h2>

                    {/* Description */}
                    <p className="text-soft font-sans text-sm line-clamp-3 leading-relaxed flex-1 mb-6">
                      {product.description}
                    </p>

                    {/* Price + CTA */}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                      <div className="flex flex-col">
                        <span className="text-soft font-sans text-[10px] uppercase tracking-[1px] mb-0.5">
                          Вартість
                        </span>
                        <span className="text-gold font-sans text-2xl font-semibold">
                          {product.price.toLocaleString("uk-UA")}{" "}
                          <span className="text-base font-normal">₴</span>
                        </span>
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className={`relative h-10 px-5 font-sans text-[11px] uppercase font-semibold tracking-[1px] rounded-lg transition-all duration-300 overflow-hidden ${
                          isAdded
                            ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
                            : "bg-gold text-deep-black hover:bg-white hover:shadow-neon-gold"
                        }`}
                      >
                        {isAdded ? "✓ Додано" : "В кошик"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* ── Bottom CTA ─────────────────────────────────────────────────── */}
        {!isEmpty && (
          <div className="mt-16 text-center">
            <p className="text-soft font-sans text-sm mb-4">
              Не знайшли потрібне рішення?
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-lg border border-gold/30 text-gold hover:bg-gold/10 font-sans text-[13px] uppercase tracking-[1px] font-semibold transition-all duration-300"
            >
              Зв'язатися з нами →
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
