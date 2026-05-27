import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import CheckoutModal from "./CheckoutModal";
import { useLanguage } from "@/context/LanguageContext";

export default function CartSidebar() {
  const { items, isOpen, closeCart, updateQuantity, removeFromCart, totalPrice } = useCart();
  const { lang, t } = useLanguage();
  const [showCheckout, setShowCheckout] = useState(false);

  if (!isOpen && !showCheckout) return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[99] bg-black/60"
          onClick={closeCart}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full z-[100] flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          width: "420px",
          maxWidth: "100vw",
          background: "#121212",
          borderLeft: "1px solid #1a1a1a",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-charcoal">
          <h2 className="font-heading text-white uppercase mt-2">
            {t("cart.title")}
          </h2>
          <button
            onClick={closeCart}
            className="p-1 text-soft hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-soft">
              <ShoppingCartEmpty />
              <p className="mt-4 text-sm">{t("cart.empty")}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {items.map((item) => {
                const productName = lang === "en" ? (item.product.name_en || item.product.name) : item.product.name;
                return (
                  <div
                    key={item.product.id}
                    className="flex gap-4 pb-6 border-b border-charcoal"
                  >
                    {item.product.image ? (
                      <img
                        src={item.product.image}
                        alt={productName}
                        className="w-20 h-20 object-cover rounded"
                        style={{ aspectRatio: "1/1" }}
                      />
                    ) : (
                      <div className="w-20 h-20 bg-deep-black flex items-center justify-center rounded border border-charcoal text-xs text-soft font-serif">
                        {productName.slice(0, 2)}
                      </div>
                    )}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-sans text-base font-medium text-white">
                          {productName}
                        </h4>
                        <p className="text-gold text-lg font-semibold mt-1">
                          {item.product.price.toLocaleString(lang === "en" ? "en-US" : "uk-UA")} ₴
                        </p>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="w-7 h-7 flex items-center justify-center border border-charcoal text-soft hover:border-gold hover:text-gold transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-white text-sm font-medium min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="w-7 h-7 flex items-center justify-center border border-charcoal text-soft hover:border-gold hover:text-gold transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="ml-auto p-1 text-muted-foreground hover:text-magenta transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-charcoal space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-soft text-sm">{t("cart.total")}</span>
              <span className="text-gold text-2xl font-semibold">
                {totalPrice.toLocaleString(lang === "en" ? "en-US" : "uk-UA")} ₴
              </span>
            </div>
            <button
              onClick={() => setShowCheckout(true)}
              className="w-full h-[52px] bg-gold text-deep-black font-sans text-[13px] uppercase font-semibold tracking-[1.5px] hover:bg-white hover:shadow-neon-gold transition-all duration-300"
            >
              {t("cart.checkout")}
            </button>
            <button
              onClick={closeCart}
              className="w-full text-center text-soft text-sm hover:text-white transition-colors duration-300 mt-2 py-2"
            >
              {t("cart.continue")}
            </button>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <CheckoutModal
          onClose={() => setShowCheckout(false)}
          totalPrice={totalPrice}
        />
      )}
    </>
  );
}

function ShoppingCartEmpty() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="text-charcoal"
    >
      <path d="M6 6h15l-1.5 9h-12z" />
      <circle cx="9" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
      <path d="M6 6L5 3H2" />
    </svg>
  );
}
