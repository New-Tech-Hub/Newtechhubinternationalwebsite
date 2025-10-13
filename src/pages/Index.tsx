import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Courses from "@/components/Courses";
import About from "@/components/About";
import Pricing from "@/components/Pricing";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main id="main-content">
        <Hero />
        <Features />
        <Courses />
        <About />
        <Pricing />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
