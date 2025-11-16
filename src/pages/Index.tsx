import { useEffect, lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import { Loader2 } from "lucide-react";

// Lazy load heavy components below the fold
const Features = lazy(() => import("@/components/Features"));
const Courses = lazy(() => import("@/components/Courses"));
const Testimonials = lazy(() => import("@/components/Testimonials"));
const Impact = lazy(() => import("@/components/Impact"));
const Localization = lazy(() => import("@/components/Localization"));
const About = lazy(() => import("@/components/About"));
const Partnerships = lazy(() => import("@/components/Partnerships"));
const BusinessModel = lazy(() => import("@/components/BusinessModel"));
const Pricing = lazy(() => import("@/components/Pricing"));
const Contact = lazy(() => import("@/components/Contact"));
const Footer = lazy(() => import("@/components/Footer"));
const Chatbot = lazy(() => import("@/components/Chatbot"));

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
    <div className="min-h-screen scroll-smooth snap-y snap-mandatory overflow-y-auto">
      <Navigation />
      <main id="main-content">
        <Hero />
        <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
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
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
        <Chatbot />
      </Suspense>
    </div>
  );
};

export default Index;
