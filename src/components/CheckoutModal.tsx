import { useState } from "react";
import { X, CheckCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";

interface CheckoutModalProps {
  onClose: () => void;
  totalPrice: number;
}

type Step = "contact" | "payment" | "success";

export default function CheckoutModal({ onClose, totalPrice }: CheckoutModalProps) {
  const { items, clearCart, closeCart } = useCart();
  const { lang, t } = useLanguage();
  const [step, setStep] = useState<Step>("contact");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && name) setStep("payment");
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cardNumber && expiry && cvc) {
      setStep("success");
      setTimeout(() => {
        clearCart();
        closeCart();
        onClose();
      }, 3000);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const parts = [];
    for (let i = 0; i < v.length; i += 4) {
      parts.push(v.substring(i, i + 4));
    }
    return parts.join(" ").substring(0, 19);
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + " / " + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center"
      style={{
        background: "rgba(5, 5, 5, 0.9)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        className="w-full max-w-[540px] mx-4 relative"
        style={{
          background: "#121212",
          border: "1px solid #1a1a1a",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-soft hover:text-white transition-colors z-10"
        >
          <X size={24} />
        </button>

        {step === "contact" && (
          <form onSubmit={handleContactSubmit} className="p-8">
            <h3 className="font-heading text-2xl text-white uppercase tracking-[-0.5px] mb-2">
              {t("checkout.title")}
            </h3>
            <p className="text-soft text-sm mb-8">
              {t("checkout.step")
                .replace("{current}", "1")
                .replace("{total}", "2")
                .replace("{title}", t("checkout.contact_details"))}
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-[1.5px] text-muted-foreground mb-2">
                  {t("checkout.form.name")}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={lang === "en" ? "Your Name" : "Ваше ім'я"}
                  required
                  className="w-full bg-transparent border-0 border-b border-charcoal text-white text-[15px] py-3 px-0 focus:border-gold focus:outline-none transition-colors placeholder:text-[#666666]"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[1.5px] text-muted-foreground mb-2">
                  {t("checkout.form.email")}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full bg-transparent border-0 border-b border-charcoal text-white text-[15px] py-3 px-0 focus:border-gold focus:outline-none transition-colors placeholder:text-[#666666]"
                />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-charcoal">
              <div className="flex items-center justify-between mb-6">
                <span className="text-soft text-sm">{t("checkout.to_pay")}</span>
                <span className="text-gold text-2xl font-semibold">
                  {totalPrice.toLocaleString(lang === "en" ? "en-US" : "uk-UA")} ₴
                </span>
              </div>
              <button
                type="submit"
                className="w-full h-[52px] bg-gold text-deep-black font-sans text-[13px] uppercase font-semibold tracking-[1.5px] hover:bg-white hover:shadow-neon-gold transition-all duration-300"
              >
                {t("checkout.continue")}
              </button>
            </div>
          </form>
        )}

        {step === "payment" && (
          <form onSubmit={handlePaymentSubmit} className="p-8">
            <h3 className="font-heading text-2xl text-white uppercase tracking-[-0.5px] mb-2">
              {t("checkout.payment_title")}
            </h3>
            <p className="text-soft text-sm mb-8">
              {t("checkout.step")
                .replace("{current}", "2")
                .replace("{total}", "2")
                .replace("{title}", t("checkout.payment_details"))}
            </p>

            {/* Order Summary */}
            <div className="mb-6 p-4 bg-deep-black border border-charcoal">
              <p className="text-xs uppercase tracking-[1.5px] text-muted-foreground mb-3">
                {t("checkout.order_summary")}
              </p>
              {items.map((item) => {
                const productName = lang === "en" ? (item.product.name_en || item.product.name) : item.product.name;
                return (
                  <div key={item.product.id} className="flex justify-between py-1">
                    <span className="text-soft text-sm">
                      {productName} x{item.quantity}
                    </span>
                    <span className="text-white text-sm">
                      {(item.product.price * item.quantity).toLocaleString(lang === "en" ? "en-US" : "uk-UA")} ₴
                    </span>
                  </div>
                );
              })}
              <div className="flex justify-between pt-3 mt-3 border-t border-charcoal">
                <span className="text-white font-medium">{t("cart.total")}</span>
                <span className="text-gold font-semibold">
                  {totalPrice.toLocaleString(lang === "en" ? "en-US" : "uk-UA")} ₴
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-[1.5px] text-muted-foreground mb-2">
                  {t("checkout.card_number")}
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                  required
                  className="w-full bg-transparent border-0 border-b border-charcoal text-white text-[15px] py-3 px-0 focus:border-gold focus:outline-none transition-colors placeholder:text-[#666666]"
                />
              </div>
              <div className="flex gap-6">
                <div className="flex-1">
                  <label className="block text-xs uppercase tracking-[1.5px] text-muted-foreground mb-2">
                    {t("checkout.expiry")}
                  </label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    placeholder="MM / YY"
                    maxLength={7}
                    required
                    className="w-full bg-transparent border-0 border-b border-charcoal text-white text-[15px] py-3 px-0 focus:border-gold focus:outline-none transition-colors placeholder:text-[#666666]"
                  />
                </div>
                <div className="w-24">
                  <label className="block text-xs uppercase tracking-[1.5px] text-muted-foreground mb-2">
                    {t("checkout.cvc")}
                  </label>
                  <input
                    type="text"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").substring(0, 3))}
                    placeholder="000"
                    maxLength={3}
                    required
                    className="w-full bg-transparent border-0 border-b border-charcoal text-white text-[15px] py-3 px-0 focus:border-gold focus:outline-none transition-colors placeholder:text-[#666666]"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-[52px] mt-8 bg-gold text-deep-black font-sans text-[13px] uppercase font-semibold tracking-[1.5px] hover:bg-white hover:shadow-neon-gold transition-all duration-300"
            >
              {t("checkout.pay_amount")} {totalPrice.toLocaleString(lang === "en" ? "en-US" : "uk-UA")} ₴
            </button>

            <button
              type="button"
              onClick={() => setStep("contact")}
              className="w-full text-center text-soft text-sm hover:text-gold transition-colors mt-4 py-2"
            >
              {t("checkout.back")}
            </button>
          </form>
        )}

        {step === "success" && (
          <div className="p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#00ff8822] flex items-center justify-center mb-6">
              <CheckCircle size={32} className="text-[#00ff88]" />
            </div>
            <h3 className="font-heading text-2xl text-white uppercase tracking-[-0.5px] mb-3">
              {t("checkout.success_payment")}
            </h3>
            <p className="text-soft text-sm mb-2">
              {t("checkout.success_thank_you").replace("{name}", name || t("checkout.success_client"))}
            </p>
            <p className="text-muted-foreground text-sm">
              {t("checkout.success_licensing").replace("{email}", email || t("checkout.success_email_fallback"))}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
