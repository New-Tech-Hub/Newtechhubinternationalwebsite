import { useEffect, lazy, Suspense, memo } from "react";
import { useLocation } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";

const Features = lazy(() => import("@/components/Features"));
const Courses = lazy(() => import("@/components/Courses"));
const About = lazy(() => import("@/components/About"));
const Testimonials = lazy(() => import("@/components/Testimonials"));
const Impact = lazy(() => import("@/components/Impact"));
const Pricing = lazy(() => import("@/components/Pricing"));
const Contact = lazy(() => import("@/components/Contact"));
const CourseComparison = lazy(() => import("@/components/CourseComparison"));
const Localization = lazy(() => import("@/components/Localization"));
const Partnerships = lazy(() => import("@/components/Partnerships"));
const BusinessModel = lazy(() => import("@/components/BusinessModel"));
const Footer = lazy(() => import("@/components/Footer"));
const Chatbot = lazy(() => import("@/components/Chatbot"));

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
          <About />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <CourseComparison />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <Testimonials />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <Impact />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <Pricing />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <Localization />
          <Partnerships />
          <BusinessModel />
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
