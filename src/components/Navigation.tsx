import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/newtech-hub-logo.jpg";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const navLinks = ["Courses", "About", "Pricing", "Contact"];
  const externalLinks = [
    { label: "Community", path: "/community" },
    ...(user ? [{ label: "Certificates", path: "/my-certificates" }] : []),
  ];

  const handleAuthClick = () => {
    if (user) {
      signOut();
    } else {
      navigate('/auth');
    }
  };

  const scrollToSection = (sectionId: string) => {
    // If not on home page, navigate to home first
    if (window.location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId.toLowerCase() } });
      return;
    }
    
    const element = document.getElementById(sectionId.toLowerCase());
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-primary shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div 
            className="flex-shrink-0 flex items-center gap-3 cursor-pointer" 
            onClick={() => navigate('/')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                navigate('/');
              }
            }}
            aria-label="Go to home page"
          >
            <img 
              src={logo} 
              alt="New Tech Hub International" 
              className="h-12 w-auto"
              width="48"
              height="48"
            />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-white leading-tight">
                New Tech Hub <span className="text-accent">International</span>
              </h1>
              <p className="text-white/70 text-xs italic">...we breathe solutions</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link}
                onClick={() => scrollToSection(link)}
                className="text-white/90 hover:text-white font-medium transition-colors duration-200"
              >
                {link}
              </button>
            ))}
            {externalLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => navigate(link.path)}
                className="text-white/90 hover:text-white font-medium transition-colors duration-200"
              >
                {link.label}
              </button>
            ))}
            {isAdmin && (
              <Button
                onClick={() => navigate('/admin')}
                variant="outline"
                size="sm"
                className="gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                <Shield className="h-4 w-4" />
                Admin
              </Button>
            )}
            <Button 
              onClick={handleAuthClick}
              className="bg-accent hover:bg-accent/90 text-white font-semibold"
            >
              {user ? 'Sign Out' : 'Get Started'}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-6">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link}
                  onClick={() => scrollToSection(link)}
                  className="text-white/90 hover:text-white font-medium transition-colors duration-200 text-left"
                >
                  {link}
                </button>
              ))}
              {externalLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => {
                    navigate(link.path);
                    setIsOpen(false);
                  }}
                  className="text-white/90 hover:text-white font-medium transition-colors duration-200 text-left"
                >
                  {link.label}
                </button>
              ))}
              {isAdmin && (
                <Button
                  onClick={() => {
                    navigate('/admin');
                    setIsOpen(false);
                  }}
                  variant="outline"
                  className="gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20"
                >
                  <Shield className="h-4 w-4" />
                  Admin
                </Button>
              )}
              <Button 
                onClick={() => {
                  handleAuthClick();
                  setIsOpen(false);
                }}
                className="bg-accent hover:bg-accent/90 text-white font-semibold w-full"
              >
                {user ? 'Sign Out' : 'Get Started'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
