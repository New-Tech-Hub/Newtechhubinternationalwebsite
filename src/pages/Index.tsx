import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Courses from "@/components/Courses";
import Testimonials from "@/components/Testimonials";
import Impact from "@/components/Impact";
import Localization from "@/components/Localization";
import About from "@/components/About";
import Partnerships from "@/components/Partnerships";
import BusinessModel from "@/components/BusinessModel";
import Pricing from "@/components/Pricing";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    // Handle scrolling to section when navigating from other pages
    if (location.state?.scrollTo) {
      const sectionId = location.state.scrollTo;
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [location]);

  return (
    <div className="min-h-screen">
      <Navigation />
      <main id="main-content">
        <Hero />
        <Features />
        <Courses />
        <Testimonials />
        <Impact />
        <Localization />
        <About />
        <Partnerships />
        <BusinessModel />
        <Pricing />
        <Contact />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Index;
