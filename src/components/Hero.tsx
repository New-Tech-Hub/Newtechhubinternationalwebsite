import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-learning.jpg";

const Hero = () => {
  const navigate = useNavigate();

  const scrollToCourses = () => {
    const element = document.getElementById('courses');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const showCourseVideos = () => {
    navigate('/courses-preview');
  };
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden" aria-label="Hero section">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="African students collaborating and learning digital skills together in a modern educational setting"
          className="w-full h-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/70" />
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
              className="bg-gradient-to-r from-[hsl(17,100%,60%)] to-[hsl(5,85%,58%)] shadow-[0_10px_40px_-10px_hsl(17,100%,60%/0.5)] text-white font-semibold text-lg px-8 py-6 group hover:scale-105 transition-all duration-200"
            >
              Start Learning Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              type="button"
              size="lg"
              onClick={showCourseVideos}
              variant="outline"
              className="border-2 border-white bg-white/10 backdrop-blur-sm text-white font-semibold text-lg px-8 py-6 hover:bg-white hover:text-primary hover:scale-105 transition-all duration-200"
            >
              Explore Free Courses
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};

export default Hero;
