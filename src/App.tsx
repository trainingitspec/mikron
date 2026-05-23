import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import Navigation from "@/components/Navigation";
import CartSidebar from "@/components/CartSidebar";
import Footer from "@/sections/Footer";
import Home from "@/pages/Home";
import BlogPage from "@/pages/Blog";

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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<BlogPage />} />
      </Routes>
      <Footer />
      <CartSidebar />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
