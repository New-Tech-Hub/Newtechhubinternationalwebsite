import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import heroImage from "@/assets/hero-learning.jpg";
import heroWebDev from "@/assets/hero-webdev-training.jpg";
import heroAI from "@/assets/hero-ai-training.jpg";
import heroMarketing from "@/assets/hero-marketing-training.jpg";
import heroDesign from "@/assets/hero-design-training.jpg";
import heroCybersecurity from "@/assets/hero-cybersecurity-training.jpg";
import { Analytics } from "@/lib/analytics";

const Hero = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const trainingImages = [
    { 
      src: heroImage, 
      alt: "African students collaborating and learning digital technology skills together in modern educational setting",
      loading: "eager" as const
    },
    { 
      src: heroWebDev, 
      alt: "African lecturer teaching web development programming to engaged students in modern computer lab",
      loading: "lazy" as const
    },
    { 
      src: heroAI, 
      alt: "African students collaborating on AI and machine learning projects with data visualizations",
      loading: "lazy" as const
    },
    { 
      src: heroMarketing, 
      alt: "Young African female instructor teaching digital marketing with social media analytics",
      loading: "lazy" as const
    },
    { 
      src: heroDesign, 
      alt: "African students in UI/UX design workshop working with design software",
      loading: "lazy" as const
    },
    { 
      src: heroCybersecurity, 
      alt: "African cybersecurity instructor demonstrating network security concepts to focused students",
      loading: "lazy" as const
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % trainingImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [trainingImages.length]);

  const scrollToCourses = () => {
    Analytics.heroCtaClick('Start Learning Now');
    const element = document.getElementById('courses');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const showCourseVideos = () => {
    Analytics.heroCtaClick('Explore Free Courses');
    navigate('/courses-preview');
  };
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
      <section className="relative min-h-screen flex items-center overflow-hidden scroll-smooth snap-start" aria-label="Hero section">
        {/* Background Image with Overlay - Auto-rotating training scenes */}
        <div 
          className="absolute inset-0 z-0 transition-all duration-700 hover:scale-105"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="relative w-full h-full">
            {trainingImages.map((image, index) => (
              <img
                key={index}
                src={image.src}
                alt={image.alt}
                loading={index === 0 ? "eager" : "lazy"}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
                width="1920"
                height="1080"
              />
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/70 transition-opacity duration-500 hover:opacity-90" />
        </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight animate-fade-in">
            Empowering Africa's Digital Generation — Learn, Build, and Succeed.
          </h1>
          <p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Join thousands of learners transforming their future with world-class digital skills courses curated by experts and powered by New Tech Hub International.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <Button
              type="button"
              size="lg"
              onClick={scrollToCourses}
              className="bg-gradient-to-r from-[hsl(17,100%,60%)] to-[hsl(5,85%,58%)] shadow-[0_10px_40px_-10px_hsl(17,100%,60%/0.5)] text-white font-semibold text-lg px-8 py-6 group hover:scale-110 hover:shadow-[0_20px_60px_-10px_hsl(17,100%,60%/0.7)] transition-all duration-300"
            >
              Start Learning Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
            </Button>
            <Button
              type="button"
              size="lg"
              onClick={showCourseVideos}
              variant="outline"
              className="border-2 border-white bg-white/10 backdrop-blur-sm text-white font-semibold text-lg px-8 py-6 hover:bg-white hover:text-primary hover:scale-110 hover:shadow-[0_20px_40px_-10px_rgba(255,255,255,0.3)] transition-all duration-300"
            >
              Explore Free Courses
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
};

export default Hero;
