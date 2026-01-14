import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Cookie, X } from 'lucide-react';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Small delay to prevent banner from appearing immediately on page load
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur-sm border-t border-border shadow-lg animate-in slide-in-from-bottom-5 duration-500">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Cookie className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm text-foreground font-medium">
                We use cookies to enhance your experience
              </p>
              <p className="text-xs text-muted-foreground">
                We use cookies to analyze site traffic and optimize your experience. 
                By accepting, you consent to our use of cookies. Read our{' '}
                <Link 
                  to="/privacy-policy" 
                  className="text-primary hover:underline font-medium"
                >
                  Privacy Policy
                </Link>{' '}
                for more information.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDecline}
              className="text-xs"
            >
              Decline
            </Button>
            <Button
              size="sm"
              onClick={handleAccept}
              className="text-xs"
            >
              Accept Cookies
            </Button>
            <button
              onClick={handleDecline}
              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors md:hidden"
              aria-label="Close cookie banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
