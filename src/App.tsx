import { useEffect, useState } from "react";
import { CartProvider } from "@/context/CartContext";
import Navigation from "@/components/Navigation";
import CartSidebar from "@/components/CartSidebar";
import Hero from "@/sections/Hero";
import About from "@/sections/About";
import Products from "@/sections/Products";
import Blog from "@/sections/Blog";
import Contact from "@/sections/Contact";
import Footer from "@/sections/Footer";

function App() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Page load fade-in
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <CartProvider>
      <div
        className={`min-h-screen bg-deep-black transition-opacity duration-600 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <Navigation />
        <main>
          <Hero />
          <About />
          <Products />
          <Blog />
          <Contact />
        </main>
        <Footer />
        <CartSidebar />
      </div>
    </CartProvider>
  );
}

export default App;
