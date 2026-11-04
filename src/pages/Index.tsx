import { useEffect, lazy, Suspense, memo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import LandingHero from "@/components/LandingHero";
import Reveal from "@/components/Reveal";
import Footer from "@/components/Footer";
import jerryGumaProfile from "@/assets/jerry-guma-profile.png";

const Features = lazy(() => import("@/components/Features"));
const About = lazy(() => import("@/components/About"));
const Testimonials = lazy(() => import("@/components/Testimonials"));
const Impact = lazy(() => import("@/components/Impact"));
const CourseComparison = lazy(() => import("@/components/CourseComparison"));
const Partnerships = lazy(() => import("@/components/Partnerships"));
const Contact = lazy(() => import("@/components/Contact"));
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

/**
 * Public landing page — the first page every visitor sees.
 * Welcomes anyone (no sign-in required) and routes them to the Academy
 * catalog, the daily tech news, or their account.
 */
const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();

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
        <LandingHero />
        <Suspense fallback={<SectionSkeleton />}>
          <Features />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <Impact />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <About />
        </Suspense>

        {/* Founder spotlight — public introduction; the full profile stays private */}
        <section className="py-20 bg-background" aria-labelledby="founder-teaser-heading">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 max-w-5xl mx-auto">
              <Reveal className="flex-shrink-0">
                <div className="w-44 h-44 sm:w-56 sm:h-56 rounded-2xl bg-gradient-to-br from-accent to-accent/60 p-1.5 shadow-[0_0_60px_hsl(17,100%,60%,0.25)]">
                  <img
                    src={jerryGumaProfile}
                    alt="Jerry Guma — Founder & CEO of New Tech Hub International"
                    className="w-full h-full object-cover rounded-xl"
                    loading="lazy"
                    decoding="async"
                    width="224"
                    height="224"
                  />
                </div>
              </Reveal>
              <Reveal delay={100} className="text-center lg:text-left">
                <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">
                  Meet the Founder
                </p>
                <h2 id="founder-teaser-heading" className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  Jerry Guma
                </h2>
                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-2">
                  PMIIM · CAIP · CDST — Technology Strategist, Digital
                  Transformation Expert, Educator &amp; Author.
                </p>
                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-6">
                  With over six years leading projects across Africa's technology
                  and education sectors — including work with Google's Digital
                  Skills for Africa program — Jerry founded New Tech Hub
                  International to bridge the digital divide through practical
                  tech education.
                </p>
                <Button
                  type="button"
                  onClick={() => navigate("/founder")}
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold group"
                >
                  View Full Profile
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Reveal>
            </div>
          </div>
        </section>

        <Suspense fallback={<SectionSkeleton />}>
          <Testimonials />
        </Suspense>
        <div id="pricing">
          <Suspense fallback={<SectionSkeleton />}>
            <CourseComparison />
          </Suspense>
        </div>
        <Suspense fallback={<SectionSkeleton />}>
          <Partnerships />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
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
