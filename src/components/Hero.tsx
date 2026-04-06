import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Users, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback, memo } from "react";
import heroImage from "@/assets/hero-learning.jpg";
import { Analytics } from "@/lib/analytics";
import { Card } from "@/components/ui/card";

const heroImages = [
  { src: heroImage, alt: "African students collaborating and learning digital technology skills together" },
];

const highlights = [
  {
    icon: BookOpen,
    title: "Expert-Led Training",
    description: "Learn from industry professionals with real-world experience in tech and digital skills.",
  },
  {
    icon: Users,
    title: "Flexible Learning",
    description: "Choose from face-to-face, hybrid, or virtual learning options that fit your schedule.",
  },
  {
    icon: Globe,
    title: "Career-Ready Skills",
    description: "Earn practical skills recognized by employers across Africa and beyond.",
  },
];

const Hero = memo(() => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [allImages, setAllImages] = useState(heroImages);

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
    Analytics.heroCtaClick('Apply Now');
    const element = document.getElementById('courses');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const showCourseVideos = useCallback(() => {
    Analytics.heroCtaClick('View Courses');
    navigate('/courses-preview');
  }, [navigate]);

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
    "address": { "@type": "PostalAddress", "addressCountry": "NG" }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-[hsl(222,55%,30%)] to-primary/90" aria-label="Hero section">
        {/* Decorative blobs */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/50 rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-32 lg:pt-24 lg:pb-40">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left: Text */}
            <div className="flex-1 text-center lg:text-left max-w-2xl">
              <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-4 animate-fade-in">
                Africa's Premier Tech Academy
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight animate-fade-in">
                Master Tech Skills &{" "}
                <span className="text-accent">Launch Your Career</span>
              </h1>
              <p className="text-lg sm:text-xl text-white/85 mb-8 leading-relaxed animate-fade-in font-medium" style={{ animationDelay: "0.15s" }}>
                Learn. Intern. Work. Get real work experience and opportunities to land tech jobs across Africa.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <Button
                  type="button"
                  size="lg"
                  onClick={scrollToCourses}
                  className="bg-accent hover:bg-accent/90 text-white font-bold text-lg px-10 py-7 group hover:scale-105 shadow-lg hover:shadow-[0_20px_60px_-10px_hsl(17,100%,60%,0.5)] transition-all duration-300"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </Button>
                <Button
                  type="button"
                  size="lg"
                  onClick={showCourseVideos}
                  variant="outline"
                  className="border-2 border-white/40 bg-white/5 backdrop-blur-sm text-white font-bold text-lg px-10 py-7 hover:bg-white hover:text-primary hover:scale-105 transition-all duration-300"
                >
                  View Courses
                </Button>
              </div>
            </div>

            {/* Right: Hero Image */}
            <div className="flex-1 relative w-full max-w-lg lg:max-w-xl animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                {allImages.slice(0, imagesLoaded ? allImages.length : 1).map((image, index) => (
                  <img
                    key={index}
                    src={image.src}
                    alt={image.alt}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding={index === 0 ? "sync" : "async"}
                    {...(index === 0 ? { fetchPriority: "high" } : { fetchPriority: "low" }) as React.ImgHTMLAttributes<HTMLImageElement>}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                      index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                    width="640"
                    height="480"
                  />
                ))}
                {/* Image overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom gradient transition */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
      </section>

      {/* Overlapping Feature Cards */}
      <section className="relative z-20 -mt-16 pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {highlights.map((item, index) => {
              const Icon = item.icon;
              return (
                <Card
                  key={index}
                  className="p-6 border-none bg-card/80 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                  style={{ animationDelay: `${index * 100 + 400}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-[hsl(5,85%,58%)] flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
});

Hero.displayName = 'Hero';

export default Hero;
