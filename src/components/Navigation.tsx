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
    ...(user ? [
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
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b">
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
              className="h-14 w-auto"
              width="48"
              height="48"
              loading="eager"
            />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-primary leading-tight">
                New Tech Hub
              </h1>
              <p className="text-muted-foreground text-xs italic">...we breathe solutions</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <button
                type="button"
                key={link}
                onClick={() => scrollToSection(link)}
                className="text-foreground hover:text-primary font-medium transition-colors duration-200 relative group"
              >
                {link}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
            
            {externalLinks.map((link) => (
              <button
                type="button"
                key={link.path}
                onClick={() => navigate(link.path)}
                className="text-foreground hover:text-primary font-medium transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}

            {isAdmin && (
              <Button
                type="button"
                onClick={() => navigate('/admin')}
                variant="outline"
                size="sm"
                className="gap-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
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
              className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 font-medium"
            >
              {user ? 'Sign Out' : 'Sign In'}
            </Button>
            
            <Button 
              type="button"
              onClick={() => scrollToSection('courses')}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-white font-bold shadow-md hover:shadow-lg transition-all duration-300 px-6"
            >
              Apply Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden text-primary"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden pb-6 bg-white border-t">
            <div className="flex flex-col gap-4 pt-4">
              {navLinks.map((link) => (
                <button
                  type="button"
                  key={link}
                  onClick={() => scrollToSection(link)}
                  className="text-foreground hover:text-primary font-medium transition-colors duration-200 text-left px-2"
                >
                  {link}
                </button>
              ))}
              {externalLinks.map((link) => (
                <button
                  type="button"
                  key={link.label}
                  onClick={() => {
                    navigate(link.path);
                    setIsOpen(false);
                  }}
                  className="text-foreground hover:text-primary font-medium transition-colors duration-200 text-left px-2"
                >
                  {link.label}
                </button>
              ))}
              {isAdmin && (
                <Button
                  type="button"
                  onClick={() => {
                    navigate('/admin');
                    setIsOpen(false);
                  }}
                  variant="outline"
                  className="gap-2 border-primary text-primary hover:bg-primary hover:text-white"
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
                className="bg-primary hover:bg-primary/90 text-white font-bold w-full"
              >
                {user ? 'Sign Out' : 'Sign In'}
              </Button>
              
              <Button 
                type="button"
                onClick={() => {
                  scrollToSection('courses');
                  setIsOpen(false);
                }}
                className="bg-primary hover:bg-primary/90 text-white font-bold w-full"
              >
                Apply Now
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
