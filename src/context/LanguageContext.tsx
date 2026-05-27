import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "ua" | "en";

interface LanguageContextProps {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  ua: {
    // Navigation
    "nav.company": "Компанія",
    "nav.products": "Продукти",
    "nav.blog": "Блог",
    "nav.reports": "Звіти",
    "nav.contact": "Контакти",
    "nav.cart": "Кошик",
    // Hero
    "hero.subtitle": "Сучасні програмні рішення",
    "hero.title1": "Екосистема",
    "hero.title2": "для вашої ефективності",
    "hero.description": "Ми розробляємо передові операційні системи, платформи аналітики та рішення для моніторингу, які оптимізують процеси та гарантують найвищий рівень безпеки.",
    "hero.cta.products": "Наші продукти",
    "hero.cta.contact": "Зв'язатися",
    // About
    "about.badge": "ПРО КОМПАНІЮ",
    "about.title": "Ми створюємо технології майбутнього",
    "about.desc1": "Mikron — це команда інженерів, розробників та дизайнерів, які об'єдналися для створення передових програмних рішень. Наша мета — створювати продукти, які поєднують швидкість роботи, надійність та бездоганний дизайн.",
    "about.desc2": "Ми спеціалізуємося на розробці низькорівневого програмного забезпечення, захищених операційних систем, інструментів аналітики великих даних та DevOps-платформ для бізнесу будь-якого масштабу.",
    "about.stat.experience": "Років на ринку",
    "about.stat.projects": "Активних проєктів",
    "about.stat.support": "Підтримка 24/7",
    // Products Section (Home)
    "products.badge": "ПРОДУКТИ",
    "products.title": "Ключові рішення",
    "products.all": "Всі рішення",
    "products.add_to_cart": "В кошик",
    "products.added": "Додано",
    // Products Page (Catalog)
    "catalog.badge": "КАТАЛОГ",
    "catalog.title": "Наші продукти",
    "catalog.count_singular": "продукт",
    "catalog.count_plural": "продукти",
    "catalog.all": "Всі",
    "catalog.sorting": "Сортування",
    "catalog.sort.default": "За замовчуванням",
    "catalog.sort.asc": "Ціна: від низької",
    "catalog.sort.desc": "Ціна: від високої",
    "catalog.empty.title": "Каталог порожній",
    "catalog.empty.desc": "Додайте перший продукт через адмінку Decap CMS за адресою",
    "catalog.empty.category": "У категорії «{cat}» продуктів не знайдено.",
    "catalog.price_label": "Вартість",
    "catalog.top_badge": "Топ",
    "catalog.footer.text": "Не знайшли потрібне рішення?",
    "catalog.footer.cta": "Зв'язатися з нами →",
    // Blog (List)
    "blog.badge": "БЛОГ",
    "blog.title": "Всі публікації",
    "blog.loading": "Завантаження публікацій...",
    "blog.empty": "Публікацій поки немає. Додайте першу статтю в адмінці.",
    "blog.read_more": "Читати далі →",
    // Blog Post (Detail)
    "blog.post.not_found": "Статтю не знайдено",
    "blog.post.not_found_desc": "Запитувана публікація не існує або була видалена.",
    "blog.post.back": "Назад до блогу",
    "blog.post.author": "Автор",
    // Contact Section
    "contact.badge": "КОНТАКТИ",
    "contact.title": "Почніть трансформацію вашого бізнесу",
    "contact.desc": "Зв'яжіться з нами для консультації або замовлення демонстрації наших продуктів.",
    "contact.office": "Головний офіс",
    "contact.support": "Технічна підтримка",
    "contact.form.title": "Надіслати запит",
    "contact.form.name": "Ваше ім'я",
    "contact.form.email": "Email адреса",
    "contact.form.message": "Повідомлення",
    "contact.form.submit": "Надіслати запит",
    "contact.form.success": "✓ Повідомлення надіслано!",
    // Footer
    "footer.desc": "Сучасні програмні рішення для бізнесу та розробників.",
    "footer.products": "Продукти",
    "footer.company": "Компанія",
    "footer.blog": "Блог",
    "footer.rights": "Всі права захищено.",
    "footer.tagline": "Програмні рішення майбутнього",
    "footer.about": "Про нас",
    "footer.team": "Команда",
    "footer.careers": "Кар'єра",
    "footer.contacts": "Контакти",
    // Cart Sidebar
    "cart.title": "Ваш кошик",
    "cart.empty": "Кошик порожній",
    "cart.checkout": "Оформити замовлення",
    "cart.total": "Разом",
    "cart.clear": "Очистити",
    "cart.continue": "Продовжити покупки",
    // Checkout Modal
    "checkout.title": "Оформлення замовлення",
    "checkout.form.name": "Ім'я та Прізвище",
    "checkout.form.phone": "Телефон",
    "checkout.form.email": "Email",
    "checkout.form.notes": "Примітки до замовлення",
    "checkout.form.cancel": "Скасувати",
    "checkout.form.submit": "Підтвердити замовлення",
    "checkout.success.title": "Дякуємо за замовлення!",
    "checkout.success.desc": "Наш менеджер зв'яжеться з вами найближчим часом для підтвердження деталей.",
    "checkout.success.close": "Закрити",
    "checkout.error.empty": "Ваш кошик порожній",
    "checkout.step": "Крок {current} з {total} — {title}",
    "checkout.contact_details": "Контактні дані",
    "checkout.payment_details": "Дані картки",
    "checkout.card_number": "Номер картки",
    "checkout.expiry": "Термін дії",
    "checkout.cvc": "CVC",
    "checkout.payment_title": "Оплата карткою",
    "checkout.order_summary": "Замовлення",
    "checkout.pay_amount": "Сплатити",
    "checkout.back": "← Назад",
    "checkout.success_payment": "Оплата успішна!",
    "checkout.success_thank_you": "Дякуємо за покупку, {name}.",
    "checkout.success_licensing": "Ліцензії будуть надіслані на {email} протягом кількох хвилин.",
    "checkout.success_client": "клієнте",
    "checkout.success_email_fallback": "ваш email",
    "checkout.to_pay": "До сплати",
    "checkout.continue": "Продовжити",
  },
  en: {
    // Navigation
    "nav.company": "Company",
    "nav.products": "Products",
    "nav.blog": "Blog",
    "nav.reports": "Reports",
    "nav.contact": "Contacts",
    "nav.cart": "Cart",
    // Hero
    "hero.subtitle": "Modern Software Solutions",
    "hero.title1": "Ecosystem",
    "hero.title2": "for your efficiency",
    "hero.description": "We develop advanced operating systems, analytics platforms, and monitoring solutions that optimize processes and ensure the highest level of security.",
    "hero.cta.products": "Our Products",
    "hero.cta.contact": "Contact Us",
    // About
    "about.badge": "ABOUT US",
    "about.title": "We create the technology of the future",
    "about.desc1": "Mikron is a team of engineers, developers, and designers united to build cutting-edge software solutions. Our goal is to create products that combine speed, reliability, and flawless design.",
    "about.desc2": "We specialize in developing low-level software, secure operating systems, big data analytics tools, and DevOps platforms for businesses of all sizes.",
    "about.stat.experience": "Years in Market",
    "about.stat.projects": "Active Projects",
    "about.stat.support": "Support 24/7",
    // Products Section (Home)
    "products.badge": "PRODUCTS",
    "products.title": "Key Solutions",
    "products.all": "All Solutions",
    "products.add_to_cart": "Add to Cart",
    "products.added": "Added",
    // Products Page (Catalog)
    "catalog.badge": "CATALOG",
    "catalog.title": "Our Products",
    "catalog.count_singular": "product",
    "catalog.count_plural": "products",
    "catalog.all": "All",
    "catalog.sorting": "Sorting",
    "catalog.sort.default": "Default",
    "catalog.sort.asc": "Price: low to high",
    "catalog.sort.desc": "Price: high to low",
    "catalog.empty.title": "Catalog is empty",
    "catalog.empty.desc": "Add your first product via the Decap CMS admin panel at",
    "catalog.empty.category": "No products found in category \"{cat}\".",
    "catalog.price_label": "Price",
    "catalog.top_badge": "Top",
    "catalog.footer.text": "Didn't find the solution you need?",
    "catalog.footer.cta": "Contact Us →",
    // Blog (List)
    "blog.badge": "BLOG",
    "blog.title": "All Publications",
    "blog.loading": "Loading publications...",
    "blog.empty": "No publications yet. Add your first article in the admin panel.",
    "blog.read_more": "Read more →",
    // Blog Post (Detail)
    "blog.post.not_found": "Article not found",
    "blog.post.not_found_desc": "The requested article does not exist or has been deleted.",
    "blog.post.back": "Back to blog",
    "blog.post.author": "Author",
    // Contact Section
    "contact.badge": "CONTACTS",
    "contact.title": "Start your business transformation",
    "contact.desc": "Contact us for a consultation or to order a demonstration of our products.",
    "contact.office": "Headquarters",
    "contact.support": "Technical Support",
    "contact.form.title": "Send request",
    "contact.form.name": "Your Name",
    "contact.form.email": "Email Address",
    "contact.form.message": "Message",
    "contact.form.submit": "Submit Request",
    "contact.form.success": "✓ Message sent successfully!",
    // Footer
    "footer.desc": "Modern software solutions for businesses and developers.",
    "footer.products": "Products",
    "footer.company": "Company",
    "footer.blog": "Blog",
    "footer.rights": "All rights reserved.",
    "footer.tagline": "Software solutions of the future",
    "footer.about": "About Us",
    "footer.team": "Team",
    "footer.careers": "Careers",
    "footer.contacts": "Contacts",
    // Cart Sidebar
    "cart.title": "Your Cart",
    "cart.empty": "Cart is empty",
    "cart.checkout": "Checkout",
    "cart.total": "Total",
    "cart.clear": "Clear",
    "cart.continue": "Continue shopping",
    // Checkout Modal
    "checkout.title": "Checkout",
    "checkout.form.name": "Full Name",
    "checkout.form.phone": "Phone Number",
    "checkout.form.email": "Email",
    "checkout.form.notes": "Order Notes",
    "checkout.form.cancel": "Cancel",
    "checkout.form.submit": "Confirm Order",
    "checkout.success.title": "Thank you for your order!",
    "checkout.success.desc": "Our manager will contact you shortly to confirm the details.",
    "checkout.success.close": "Close",
    "checkout.error.empty": "Your cart is empty",
    "checkout.step": "Step {current} of {total} — {title}",
    "checkout.contact_details": "Contact Details",
    "checkout.payment_details": "Card Details",
    "checkout.card_number": "Card Number",
    "checkout.expiry": "Expiry Date",
    "checkout.cvc": "CVC",
    "checkout.payment_title": "Card Payment",
    "checkout.order_summary": "Order Summary",
    "checkout.pay_amount": "Pay",
    "checkout.back": "← Back",
    "checkout.success_payment": "Payment successful!",
    "checkout.success_thank_you": "Thank you for your purchase, {name}.",
    "checkout.success_licensing": "Licenses will be sent to {email} within a few minutes.",
    "checkout.success_client": "customer",
    "checkout.success_email_fallback": "your email",
    "checkout.to_pay": "To pay",
    "checkout.continue": "Continue",
  },
};

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem("app_lang");
    return (saved === "en" || saved === "ua" ? saved : "ua") as Language;
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("app_lang", newLang);
    document.documentElement.lang = newLang;
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key: string): string => {
    return translations[lang]?.[key] ?? translations["ua"]?.[key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
