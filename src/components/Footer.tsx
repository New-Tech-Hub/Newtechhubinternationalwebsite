import { useState } from "react";
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    toast.success("Successfully subscribed!", {
      description: "You'll receive our latest updates and courses"
    });
    setEmail("");
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">New Tech Hub International</h3>
            <p className="text-white/80 mb-4 leading-relaxed">
              Empowering Africa's digital generation with world-class tech education and training.
            </p>
            <p className="text-white/70 text-sm italic">We Breathe Solutions</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { label: "About Us", id: "about" },
                { label: "Courses", id: "courses" },
                { label: "Features", id: "features" },
                { label: "Pricing", id: "pricing" },
                { label: "Contact", id: "contact" }
              ].map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="text-white/80 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-white/80">info@newtechhub.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-white/80">+234 (0) 800 000 0000</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-white/80">Lagos, Nigeria</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-4">Stay Updated</h3>
            <p className="text-white/80 mb-4">
              Subscribe to our newsletter for the latest courses and tech tips.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                required
              />
              <Button type="submit" className="bg-accent hover:bg-accent/90 text-white flex-shrink-0">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-white/70 text-sm">
              © {currentYear} New Tech Hub International — We Breathe Solutions
            </p>
            <div className="flex gap-4">
              {[
                { icon: Facebook, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Linkedin, href: "#" },
              ].map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-gradient-to-r hover:from-[hsl(17,100%,60%)] hover:to-[hsl(5,85%,58%)] flex items-center justify-center transition-all duration-300 hover:scale-110"
                    aria-label={`Visit our ${Icon.name} page`}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
