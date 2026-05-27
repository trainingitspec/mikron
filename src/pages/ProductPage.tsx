import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { loadCMSProducts } from "@/data/products";
import { useSEO } from "@/hooks/useSEO";

/**
 * ProductPage component designed for viewing details of an individual product.
 * Integrates the useSEO hook to dynamically manage title, description, and OG tags based on Decap CMS settings.
 */
export default function ProductPage() {
  const { lang, t } = useLanguage();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Scroll to top when product loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Load products dynamically based on current language and find the matched product
  const products = loadCMSProducts(lang);
  const product = products.find((p) => p.id === slug);

  // Hook call to dynamically inject SEO tags into the head (unconditional)
  useSEO({
    title: product ? product.name : (lang === "en" ? "Product Not Found" : "Продукт не знайдено"),
    description: product?.description,
    image: product?.image,
    seoSettings: product?.seo_settings,
  });

  if (!product) {
    return (
      <main className="min-h-screen bg-deep-black flex flex-col items-center justify-center text-center px-6">
        <h1 className="font-heading text-white text-3xl uppercase mb-4">
          {lang === "en" ? "Product Not Found" : "Продукт не знайдено"}
        </h1>
        <p className="text-soft font-sans mb-8">
          {lang === "en" ? "The requested product does not exist." : "Запитуваний продукт не знайдено."}
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-gold/30 text-gold hover:bg-gold/10 font-sans text-sm uppercase tracking-[1px] transition-all duration-300"
        >
          <ArrowLeft size={16} />
          {lang === "en" ? "Back to Catalog" : "Назад до каталогу"}
        </Link>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen bg-deep-black text-white"
      style={{ paddingTop: "120px", paddingBottom: "100px" }}
    >
      <div className="max-w-[1000px] mx-auto px-6">
        {/* Back Link */}
        <button
          onClick={() => navigate("/products")}
          className="inline-flex items-center gap-2 text-soft hover:text-gold font-sans text-[12px] uppercase tracking-[1.5px] mb-8 transition-colors duration-200"
        >
          <ArrowLeft size={14} />
          {lang === "en" ? "Back to Catalog" : "Назад до каталогу"}
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mt-6">
          {/* Image */}
          <div className="relative aspect-[16/10] bg-[#080808] overflow-hidden border border-white/5 rounded-2xl shadow-deep">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-white/5 font-heading text-5xl uppercase tracking-widest select-none">
                  {product.name.slice(0, 2)}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e]/50 to-transparent" />
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_6px_#ffc447]" />
              <span className="text-gold font-sans text-[10px] uppercase tracking-[1.5px] font-semibold border border-gold/30 px-2.5 py-0.5 rounded-full bg-gold/5">
                {product.category}
              </span>
            </div>

            <h1
              className="font-heading text-white uppercase mb-4 leading-tight"
              style={{ fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 400 }}
            >
              {product.name}
            </h1>

            <p className="text-soft font-sans text-sm leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="flex items-center justify-between py-6 border-t border-white/5 mt-auto">
              <div className="flex flex-col">
                <span className="text-soft font-sans text-[10px] uppercase tracking-[1px] mb-0.5">
                  {t("catalog.price_label")}
                </span>
                <span className="text-gold font-sans text-2xl font-bold">
                  {product.price.toLocaleString(lang === "en" ? "en-US" : "uk-UA")}{" "}
                  <span className="text-lg font-normal">₴</span>
                </span>
              </div>

              <button
                onClick={() => addToCart(product)}
                className="bg-gold text-deep-black hover:bg-white hover:shadow-neon-gold h-11 px-6 font-sans text-[11px] uppercase font-semibold tracking-[1px] rounded-lg transition-all duration-300 flex items-center gap-2"
              >
                <ShoppingCart size={14} />
                {t("products.add_to_cart")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
