import { useEffect, lazy, Suspense, memo } from "react";
import { useLocation } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";

// Lazy load heavy components below the fold with preload hints
const Features = lazy(() => import("@/components/Features"));
const Courses = lazy(() => import("@/components/Courses"));
const CourseComparison = lazy(() => import("@/components/CourseComparison"));
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

// Minimal skeleton for lazy sections
const SectionSkeleton = memo(() => (
  <div className="py-16 bg-background animate-pulse">
    <div className="container mx-auto px-4">
      <div className="h-8 bg-muted rounded w-1/3 mx-auto mb-6" />
      <div className="h-4 bg-muted rounded w-2/3 mx-auto" />
    </div>
  </div>
));

SectionSkeleton.displayName = 'SectionSkeleton';

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    // Handle scrolling to section when navigating from other pages
    if (location.state?.scrollTo) {
      const sectionId = location.state.scrollTo;
      requestAnimationFrame(() => {
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      });
    }
  }, [location]);

  return (
    <div className="min-h-screen overflow-y-auto">
      <Navigation />
      <main id="main-content">
        <Hero />
        <Suspense fallback={<SectionSkeleton />}>
          <Features />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <Courses />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <CourseComparison />
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
