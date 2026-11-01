import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/newtech-hub-logo.jpg";
import ScrollProgress from "@/components/ScrollProgress";
import BackToTop from "@/components/BackToTop";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isOpen]);

  // Highlight the section the visitor is currently reading (home page only).
  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection(null);
      return;
    }
    const ids = ['about', 'pricing', 'contact'];
    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-35% 0px -55% 0px' }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [location.pathname]);

  const navLinks = ["Academy", "About", "Pricing", "Contact"];
  const externalLinks = [
    { label: "News", path: "/news" },
    { label: "Team", path: "/team" },
    { label: "Community", path: "/community" },
    ...(user ? [
      { label: "Founder", path: "/founder" },
      { label: "Certificates", path: "/my-certificates" },
      { label: "My Payments", path: "/my-payments" }
    ] : []),
  ];

  const handleAuthClick = () => {
    if (user) {
      signOut();
    } else {
      navigate('/auth');
    }
  };

  const scrollToSection = (sectionId: string) => {
    if (sectionId.toLowerCase() === 'academy' || sectionId.toLowerCase() === 'courses') {
      navigate('/academy');
      setIsOpen(false);
      return;
    }
    const path = window.location.pathname;
    if (path !== '/') {
      navigate('/', { state: { scrollTo: sectionId.toLowerCase() } });
      setIsOpen(false);
      return;
    }

    const element = document.getElementById(sectionId.toLowerCase());
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-background shadow-sm border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex-shrink-0 flex items-center gap-3 cursor-pointer" 
            aria-label="Go to home page"
          >
            <img 
              src={logo} 
              alt="New Tech Hub International" 
              className="h-14 w-auto"
              width="48"
              height="48"
              loading="eager"
              decoding="async"
            />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-primary leading-tight">
                New Tech Hub
              </h1>
              <p className="text-muted-foreground text-xs italic">...we breathe solutions</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden 2xl:flex items-center gap-3">
            {navLinks.map((link) => {
              const isActive =
                link === 'Academy'
                  ? location.pathname === '/academy'
                  : location.pathname === '/' && activeSection === link.toLowerCase();
              return (
                <Button
                  variant="ghost"
                  type="button"
                  key={link}
                  onClick={() => scrollToSection(link)}
                  aria-current={isActive ? 'true' : undefined}
                  className={`px-2 relative group ${
                    isActive ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'
                  }`}
                >
                  {link}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full ${
                      isActive ? 'w-full' : 'w-0'
                    }`}
                  />
                </Button>
              );
            })}

            {externalLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Button
                  variant="ghost"
                  type="button"
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  aria-current={isActive ? 'true' : undefined}
                  className={`px-2 relative group ${
                    isActive ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full ${
                      isActive ? 'w-full' : 'w-0'
                    }`}
                  />
                </Button>
              );
            })}

            {isAdmin && (
              <Button
                type="button"
                onClick={() => navigate('/admin')}
                variant="outline"
                size="sm"
                className="gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Shield className="h-4 w-4" />
                Admin
              </Button>
            )}

            <Button 
              type="button"
              onClick={handleAuthClick}
              variant="outline"
              size="sm"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-medium"
            >
              {user ? 'Sign Out' : 'Sign In'}
            </Button>
            
            <Button 
              type="button"
              onClick={() => {
                scrollToSection('courses');
              }}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md hover:shadow-lg transition-all duration-300 px-4"
            >
              Apply Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="2xl:hidden h-11 w-11 text-primary"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div id="mobile-navigation" className="2xl:hidden max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain pb-6 bg-background border-t">
            <div className="flex flex-col gap-2 pt-4">
              {navLinks.map((link) => (
                <Button
                  variant="ghost"
                  type="button"
                  key={link}
                  onClick={() => scrollToSection(link)}
                  className="min-h-11 justify-start text-foreground hover:text-primary text-left px-2"
                >
                  {link}
                </Button>
              ))}
              {externalLinks.map((link) => (
                <Button
                  variant="ghost"
                  type="button"
                  key={link.label}
                  onClick={() => {
                    navigate(link.path);
                    setIsOpen(false);
                  }}
                  className="min-h-11 justify-start text-foreground hover:text-primary text-left px-2"
                >
                  {link.label}
                </Button>
              ))}
              {isAdmin && (
                <Button
                  type="button"
                  onClick={() => {
                    navigate('/admin');
                    setIsOpen(false);
                  }}
                  variant="outline"
                  className="min-h-11 gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <Shield className="h-4 w-4" />
                  Admin
                </Button>
              )}
              <Button 
                type="button"
                onClick={() => {
                  handleAuthClick();
                  setIsOpen(false);
                }}
                className="min-h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-bold w-full"
              >
                {user ? 'Sign Out' : 'Sign In'}
              </Button>
              
              <Button 
                type="button"
                onClick={() => {
                  scrollToSection('courses');
                  setIsOpen(false);
                }}
                className="min-h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-bold w-full"
              >
                Apply Now
              </Button>
            </div>
          </div>
        )}
        <ScrollProgress />
      </div>
      <BackToTop />
    </nav>
  );
};

export default Navigation;
