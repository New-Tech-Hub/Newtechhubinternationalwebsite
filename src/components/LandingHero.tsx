import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Newspaper, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { memo } from "react";
import heroImage from "@/assets/hero-learning.jpg";
import { Card } from "@/components/ui/card";

const quickLinks = [
  {
    icon: BookOpen,
    title: "The Academy",
    description: "24 hands-on course modules in web development, AI, marketing, design and more.",
    cta: "Browse courses",
    path: "/academy",
  },
  {
    icon: Newspaper,
    title: "Daily Tech & AI News",
    description: "Fresh technology, STEM, AI and innovation headlines updated every day.",
    cta: "Read the news",
    path: "/news",
  },
  {
    icon: Users,
    title: "Join the Community",
    description: "Connect with learners and mentors across Africa building tech careers.",
    cta: "Say hello",
    path: "/community",
  },
];

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "New Tech Hub International",
  "description": "Premier African digital skills education platform offering courses in Web Development, AI, Digital Marketing, Cybersecurity, and Graphic Design",
  "url": "https://newtechproject.lovable.app",
  "logo": "https://newtechproject.lovable.app/assets/newtech-hub-logo.jpg",
  "address": { "@type": "PostalAddress", "addressCountry": "NG" }
};

const LandingHero = memo(() => {
  const navigate = useNavigate();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-[hsl(222,55%,30%)] to-primary/90" aria-label="Welcome">
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
                Welcome to New Tech Hub International
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight animate-fade-in">
                Your gateway to{" "}
                <span className="text-accent">tech skills &amp; opportunities</span>
              </h1>
              <p className="text-lg sm:text-xl text-white/85 mb-4 leading-relaxed animate-fade-in font-medium" style={{ animationDelay: "0.15s" }}>
                We breathe innovation and solutions.
              </p>
              <p className="text-base sm:text-lg text-white/75 mb-8 leading-relaxed animate-fade-in" style={{ animationDelay: "0.2s" }}>
                Explore our academy, catch up on daily technology and AI news, and
                join a community of learners across Africa — no sign-in needed to
                look around.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center sm:items-start animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <Button
                  type="button"
                  size="lg"
                  onClick={() => navigate("/academy")}
                  className="bg-accent hover:bg-accent/90 text-white font-bold text-lg px-10 py-7 group hover:scale-105 shadow-lg hover:shadow-[0_20px_60px_-10px_hsl(17,100%,60%,0.5)] transition-all duration-300"
                >
                  Explore the Academy
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </Button>
                <Button
                  type="button"
                  size="lg"
                  onClick={() => navigate("/news")}
                  variant="outline"
                  className="border-2 border-white/40 bg-white/5 backdrop-blur-sm text-white font-bold text-lg px-10 py-7 hover:bg-white hover:text-primary hover:scale-105 transition-all duration-300"
                >
                  Today's Tech News
                </Button>
              </div>
              <p className="mt-5 text-sm text-white/70 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                Already a learner?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/auth")}
                  className="underline underline-offset-4 font-semibold text-accent hover:text-white transition-colors"
                >
                  Sign in to continue learning
                </button>
              </p>
            </div>

            {/* Right: Hero Image */}
            <div className="flex-1 relative w-full max-w-lg lg:max-w-xl animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                <img
                  src={heroImage}
                  alt="African students collaborating and learning digital technology skills together"
                  loading="eager"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover"
                  width="640"
                  height="480"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom gradient transition */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
      </section>

      {/* Overlapping Quick-Access Cards */}
      <section className="relative z-20 -mt-16 pb-8" aria-label="Explore New Tech Hub">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickLinks.map((item, index) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.title}
                  className="p-6 border-none bg-card/80 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 animate-fade-in group"
                  style={{ animationDelay: `${index * 100 + 400}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-[hsl(5,85%,58%)] flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{item.description}</p>
                  <button
                    type="button"
                    onClick={() => navigate(item.path)}
                    className="text-sm font-semibold text-primary hover:text-accent transition-colors inline-flex items-center gap-1"
                    aria-label={`${item.cta} — ${item.title}`}
                  >
                    {item.cta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
});

LandingHero.displayName = 'LandingHero';

export default LandingHero;
