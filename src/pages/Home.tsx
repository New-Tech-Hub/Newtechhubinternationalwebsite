import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowRight,
  Linkedin,
  Facebook,
  BookOpen,
  Brain,
  Globe,
  Briefcase,
  Award,
  Rocket,
  Target,
  Users,
  Bot,
  BarChart3,
  Code,
  Shield,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const competencies = [
  { icon: Briefcase, label: "Product & Project Management" },
  { icon: BarChart3, label: "Digital Marketing & Automation" },
  { icon: Bot, label: "AI & Chatbot Development" },
  { icon: BookOpen, label: "ICT Training & Capacity Building" },
  { icon: Globe, label: "Blockchain & Web3 Consultation" },
  { icon: BarChart3, label: "Forex & Algorithmic Trading" },
  { icon: Code, label: "Educational Technology (EdTech)" },
  { icon: Rocket, label: "Strategic Business Development" },
];

const notableProjects = [
  "Google Digital Skills for Africa Program – Program Manager under MindTheGap",
  "Nasarawa State ICT Teachers' Training Initiative – Lead Consultant",
  "Ned-Encyclopaedia Web App – Product Manager",
  "National Defence College Library Digitization Proposal – Project Lead",
  "AI-Powered Business Chatbots for corporate and government clients",
];

const Home = memo(() => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-y-auto">
      <Navigation />
      <main id="main-content">
        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex items-center bg-gradient-to-br from-primary via-primary to-primary/90 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 z-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/50 rounded-full blur-3xl" />
          </div>

          <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              {/* Profile */}
              <div className="flex-shrink-0 animate-fade-in">
                <div className="relative">
                  <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-gradient-to-br from-accent to-accent/60 p-1.5 shadow-[0_0_60px_hsl(17,100%,60%,0.35)]">
                    <Avatar className="w-full h-full">
                      <AvatarFallback className="bg-primary/80 text-white text-5xl sm:text-6xl font-bold">
                        JG
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-accent text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                    Founder & CEO
                  </div>
                </div>
              </div>

              {/* Text */}
              <div className="text-center lg:text-left max-w-2xl">
                <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3 animate-fade-in">
                  Meet the Visionary
                </p>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight animate-fade-in">
                  Jerry Guma
                </h1>
                <p className="text-lg sm:text-xl text-white/90 mb-4 leading-relaxed animate-fade-in font-medium" style={{ animationDelay: "0.15s" }}>
                  PMIIM · CAIP · CDST
                </p>
                <p className="text-base sm:text-lg text-white/80 mb-8 leading-relaxed animate-fade-in" style={{ animationDelay: "0.25s" }}>
                  Technology Strategist · Digital Transformation Expert · Educator · Author
                </p>

                {/* Social Links */}
                <div className="flex items-center gap-4 justify-center lg:justify-start animate-fade-in" style={{ animationDelay: "0.35s" }}>
                  <a
                    href="https://www.linkedin.com/in/jerry-guma-pmiim-caip-cdst-424000121/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110"
                    aria-label="Visit Jerry Guma's LinkedIn profile"
                  >
                    <Linkedin className="h-5 w-5 text-white" />
                  </a>
                  <a
                    href="https://web.facebook.com/JerryGuma01"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110"
                    aria-label="Visit Jerry Guma's Facebook profile"
                  >
                    <Facebook className="h-5 w-5 text-white" />
                  </a>
                  <Button
                    onClick={() => navigate("/academy")}
                    size="lg"
                    className="bg-white text-primary font-bold text-base px-8 py-6 group hover:scale-105 hover:shadow-[0_20px_60px_-10px_rgba(255,255,255,0.5)] transition-all duration-300 ml-4"
                  >
                    Visit Academy
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
        </section>

        {/* Biography Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  About Jerry Guma
                </h2>
                <div className="w-20 h-1 bg-accent mx-auto rounded-full" />
              </div>

              <div className="space-y-6 text-muted-foreground text-base sm:text-lg leading-relaxed">
                <p>
                  Jerry Guma is a seasoned technology strategist, digital transformation expert, and educator with over six years of experience leading innovative projects across Africa's technology and education sectors. As the Product Manager at <strong className="text-foreground">New Tech Hub International</strong> and <strong className="text-foreground">Creative Minds Academy</strong>, Jerry has played a pivotal role in driving Africa's digital evolution through education, innovation, and automation.
                </p>
                <p>
                  With a strong background in project management, Jerry previously worked with <strong className="text-foreground">Google</strong> under the Google Digital Skills for Africa Program as a Program Manager with MindTheGap, where he trained and empowered thousands of young Africans in digital literacy, entrepreneurship, and online marketing.
                </p>
                <p>
                  At New Tech Hub International, Jerry oversees the design and implementation of cutting-edge ICT, AI, and automation projects, including AI chatbots, e-voting systems, digital branding, software and mobile app development, and ICT training programs for institutions and government bodies.
                </p>
                <p>
                  Beyond his corporate work, Jerry is the founder of <strong className="text-foreground">Creative Minds Academy</strong>, an initiative focused on equipping young Nigerians — particularly secondary school graduates — with practical digital and tech skills to prepare them for the future of work.
                </p>
                <p>
                  His passion for education and innovation also led him to author the motivational and practical guide, <em className="text-foreground font-medium">"Now That You Are Here: Staying Focused on Your Purpose in Nigerian Higher Education,"</em> a book designed to help students thrive in university life with clarity and purpose.
                </p>
                <p>
                  A fellow of the <strong className="text-foreground">Institute of Information Management Africa (IIM-Africa)</strong>, Jerry is also a blockchain and Web3 consultant, AI chatbot builder, forex strategist, and financial analyst.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Competencies */}
        <section className="py-20 bg-secondary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Core Competencies
              </h2>
              <div className="w-20 h-1 bg-accent mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {competencies.map((item, i) => {
                const Icon = item.icon;
                return (
                  <Card key={i} className="p-6 text-center border-none bg-card shadow-md hover:shadow-xl">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent to-[hsl(5,85%,58%)] flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <p className="text-foreground font-semibold text-sm">{item.label}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Notable Projects */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  Notable Projects
                </h2>
                <div className="w-20 h-1 bg-accent mx-auto rounded-full" />
              </div>

              <div className="space-y-4">
                {notableProjects.map((project, i) => (
                  <Card key={i} className="p-5 border-none bg-card shadow-sm flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-[hsl(5,85%,58%)] flex items-center justify-center flex-shrink-0">
                      <Award className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-foreground font-medium text-sm sm:text-base leading-relaxed pt-1.5">
                      {project}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Vision Statement */}
        <section className="py-20 bg-primary text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <Target className="h-12 w-12 text-accent mx-auto mb-6" />
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Vision Statement</h2>
              <p className="text-lg sm:text-xl text-white/90 leading-relaxed italic">
                "To empower Africa through technology, education, and innovation — creating sustainable solutions that bridge the digital divide and position Africa as a global force in the digital economy."
              </p>
            </div>
          </div>
        </section>

        {/* CTA to Academy */}
        <section className="py-20 bg-secondary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-2xl mx-auto">
              <Users className="h-12 w-12 text-accent mx-auto mb-6" />
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Ready to Start Learning?
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Explore our academy and join thousands of Africans building tech careers with world-class courses.
              </p>
              <Button
                onClick={() => navigate("/academy")}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white font-bold text-lg px-12 py-7 group hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Explore the Academy
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
});

Home.displayName = "Home";

export default Home;
