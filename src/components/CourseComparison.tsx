import { Check, X, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";

const CourseComparison = () => {
  // Set expiration to 7 days from now (you can change this date)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Set expiration date to 7 days from component mount
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const distance = expirationDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      name: "Core Curriculum",
      standard: true,
      premium: true,
    },
    {
      name: "Video Lessons",
      standard: true,
      premium: true,
    },
    {
      name: "Certificate of Completion",
      standard: true,
      premium: true,
    },
    {
      name: "Community Forum Access",
      standard: true,
      premium: true,
    },
    {
      name: "1-on-1 Mentorship Sessions",
      standard: false,
      premium: true,
    },
    {
      name: "Advanced Projects & Case Studies",
      standard: false,
      premium: true,
    },
    {
      name: "Job Placement Support",
      standard: false,
      premium: true,
    },
    {
      name: "Lifetime Course Updates",
      standard: false,
      premium: true,
    },
    {
      name: "Priority Support",
      standard: false,
      premium: true,
    },
    {
      name: "Industry Tools & Software Access",
      standard: false,
      premium: true,
    },
    {
      name: "Portfolio Review Sessions",
      standard: false,
      premium: true,
    },
    {
      name: "Interview Preparation",
      standard: false,
      premium: true,
    },
  ];

  return (
    <section className="py-16 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Course Tiers Comparison
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Choose the learning experience that fits your career goals and budget
          </p>
          
          {/* Countdown Timer */}
          <div className="inline-flex items-center gap-3 bg-destructive/10 border border-destructive/30 rounded-xl px-6 py-4">
            <Clock className="w-5 h-5 text-destructive animate-pulse" />
            <span className="text-sm font-medium text-destructive">Offer expires in:</span>
            <div className="flex gap-2">
              <div className="bg-destructive text-destructive-foreground px-3 py-2 rounded-lg text-center min-w-[50px]">
                <span className="text-lg font-bold">{timeLeft.days}</span>
                <p className="text-[10px] uppercase">Days</p>
              </div>
              <div className="bg-destructive text-destructive-foreground px-3 py-2 rounded-lg text-center min-w-[50px]">
                <span className="text-lg font-bold">{timeLeft.hours.toString().padStart(2, '0')}</span>
                <p className="text-[10px] uppercase">Hours</p>
              </div>
              <div className="bg-destructive text-destructive-foreground px-3 py-2 rounded-lg text-center min-w-[50px]">
                <span className="text-lg font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                <p className="text-[10px] uppercase">Mins</p>
              </div>
              <div className="bg-destructive text-destructive-foreground px-3 py-2 rounded-lg text-center min-w-[50px]">
                <span className="text-lg font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                <p className="text-[10px] uppercase">Secs</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Features Column */}
          <Card className="md:col-span-1 border-border/50">
            <CardHeader>
              <CardTitle className="text-xl">Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="py-3 text-sm font-medium text-foreground"
                >
                  {feature.name}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Standard Column */}
          <Card className="border-border/50 hover:shadow-lg transition-shadow relative">
            <div className="absolute -top-3 right-4">
              <span className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
                50% OFF
              </span>
            </div>
            <CardHeader className="bg-accent/5">
              <CardTitle className="text-xl text-center">Standard</CardTitle>
              <p className="text-center text-muted-foreground text-sm mt-2">
                <span className="line-through text-muted-foreground/50 mr-2">₦100,000</span>
                <span className="text-accent font-semibold">₦50,000</span>
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="py-3 flex items-center justify-center"
                >
                  {feature.standard ? (
                    <Check className="w-5 h-5 text-accent" />
                  ) : (
                    <X className="w-5 h-5 text-muted-foreground/30" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Premium Column */}
          <Card className="border-2 border-primary/50 bg-gradient-to-br from-background via-background to-primary/5 hover:shadow-xl transition-shadow relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 flex gap-2">
              <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-semibold">
                RECOMMENDED
              </span>
              <span className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
                50% OFF
              </span>
            </div>
            <CardHeader className="bg-primary/10">
              <CardTitle className="text-xl text-center text-primary">
                ⭐ Premium Bootcamp
              </CardTitle>
              <p className="text-center text-muted-foreground text-sm mt-2">
                <span className="line-through text-muted-foreground/50 mr-2">₦200,000</span>
                <span className="text-primary font-semibold">₦100,000</span>
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="py-3 flex items-center justify-center"
                >
                  {feature.premium ? (
                    <Check className="w-5 h-5 text-primary" />
                  ) : (
                    <X className="w-5 h-5 text-muted-foreground/30" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            All courses include access to our learning platform and community support
          </p>
        </div>
      </div>
    </section>
  );
};

export default CourseComparison;
