import Hero from "@/sections/Hero";
import About from "@/sections/About";
import Products from "@/sections/Products";
import Contact from "@/sections/Contact";

export default function Home() {
  console.log('Home component rendered');
  return (
    <main>
      <Hero />
      <About />
      <Products />
      <Contact />
    </main>
  );
}
