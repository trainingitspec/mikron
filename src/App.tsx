import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import Navigation from "@/components/Navigation";
import CartSidebar from "@/components/CartSidebar";
import Footer from "@/sections/Footer";
import Home from "@/pages/Home";
import BlogPage from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import ProductsPage from "@/pages/ProductsPage";
import ReportsPage from "@/pages/ReportsPage";
import ErrorBoundary from "@/components/ErrorBoundary";

function AppContent() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`min-h-screen bg-deep-black transition-opacity duration-500 ${
        loaded ? "opacity-100" : "opacity-0"
      }`}
    >
      <Navigation />
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Routes>
      </ErrorBoundary>
      <Footer />
      <CartSidebar />
    </div>
  );
}

import { LanguageProvider } from "@/context/LanguageContext";

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;

