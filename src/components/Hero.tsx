import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback, memo } from "react";
import heroImage from "@/assets/hero-learning.jpg";
import { Analytics } from "@/lib/analytics";

// Lazy load secondary images
const heroImages = [
  { src: heroImage, alt: "African students collaborating and learning digital technology skills together" },
];

const Hero = memo(() => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [allImages, setAllImages] = useState(heroImages);

  // Load additional images after initial render
  useEffect(() => {
    const loadImages = async () => {
      const [webDev, ai, marketing, design, cyber] = await Promise.all([
        import("@/assets/hero-webdev-training.jpg"),
        import("@/assets/hero-ai-training.jpg"),
        import("@/assets/hero-marketing-training.jpg"),
        import("@/assets/hero-design-training.jpg"),
        import("@/assets/hero-cybersecurity-training.jpg"),
      ]);
      
      setAllImages([
        heroImages[0],
        { src: webDev.default, alt: "African lecturer teaching web development programming" },
        { src: ai.default, alt: "African students collaborating on AI and machine learning projects" },
        { src: marketing.default, alt: "Young African instructor teaching digital marketing" },
        { src: design.default, alt: "African students in UI/UX design workshop" },
        { src: cyber.default, alt: "African cybersecurity instructor demonstrating network security" },
      ]);
      setImagesLoaded(true);
    };
    
    // Delay loading secondary images
    const timer = setTimeout(loadImages, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!imagesLoaded) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [imagesLoaded, allImages.length]);

  const scrollToCourses = useCallback(() => {
    Analytics.heroCtaClick('Start Learning Now');
    const element = document.getElementById('courses');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const showCourseVideos = useCallback(() => {
    Analytics.heroCtaClick('Explore Free Courses');
    navigate('/courses-preview');
  }, [navigate]);
  // Generate JSON-LD structured data for organization
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "New Tech Hub International",
    "description": "Premier African digital skills education platform offering courses in Web Development, AI, Digital Marketing, Cybersecurity, and Graphic Design",
    "url": "https://newtechhub.lovable.app",
    "logo": "https://newtechhub.lovable.app/assets/newtech-hub-logo.jpg",
    "sameAs": [
      "https://twitter.com/newtechhub",
      "https://facebook.com/newtechhub",
      "https://linkedin.com/company/newtechhub"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "NG"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/90" aria-label="Hero section">
        {/* Background Image with Overlay - Auto-rotating training scenes */}
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full opacity-20">
            {/* Only render current and next image for performance */}
            {allImages.slice(0, imagesLoaded ? allImages.length : 1).map((image, index) => (
              <img
                key={index}
                src={image.src}
                alt={image.alt}
                loading={index === 0 ? "eager" : "lazy"}
                decoding={index === 0 ? "sync" : "async"}
                fetchPriority={index === 0 ? "high" : "low"}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 will-change-opacity ${
                  index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
                width="1920"
                height="1080"
              />
            ))}
          </div>
        </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight animate-fade-in">
            Master Tech Skills and Launch Your Career with Real-World Experience
          </h1>
          <p className="text-lg sm:text-xl text-white/95 mb-8 leading-relaxed animate-fade-in font-medium" style={{ animationDelay: "0.2s" }}>
            Learn. Intern. Work. With New Tech Hub International, you're not learning theories—you get real work experience and opportunities to land tech jobs across Africa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <Button
              type="button"
              size="lg"
              onClick={scrollToCourses}
              className="bg-white text-primary shadow-[0_10px_40px_-10px_rgba(255,255,255,0.5)] font-bold text-lg px-10 py-7 group hover:scale-105 hover:shadow-[0_20px_60px_-10px_rgba(255,255,255,0.7)] transition-all duration-300"
            >
              Apply Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
            </Button>
            <Button
              type="button"
              size="lg"
              onClick={showCourseVideos}
              variant="outline"
              className="border-2 border-white bg-transparent backdrop-blur-sm text-white font-bold text-lg px-10 py-7 hover:bg-white hover:text-primary hover:scale-105 hover:shadow-[0_20px_40px_-10px_rgba(255,255,255,0.3)] transition-all duration-300"
            >
              View Courses
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white rounded-full animate-pulse" />
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
      </section>
    </>
  );
});

Hero.displayName = 'Hero';

export default Hero;
