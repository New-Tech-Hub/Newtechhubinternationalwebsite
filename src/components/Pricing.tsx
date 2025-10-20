import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const plans = [
  {
    name: "Per-Course Payment",
    price: "Pay per course",
    description: "Purchase individual courses as you need them",
    features: [
      "Single course access",
      "Lifetime course access",
      "Certificate of completion",
      "Downloadable resources",
      "Community forum access",
      "30-day money-back guarantee",
    ],
    cta: "Browse Courses",
    highlighted: false,
  },
  {
    name: "Premium Membership",
    price: "₦50,000",
    period: "/year",
    description: "Unlock unlimited access to all courses and premium benefits",
    features: [
      "Access to ALL courses",
      "Unlimited course enrollment",
      "Certificates for all courses",
      "Mentorship and career support",
      "Exclusive community access",
      "Priority support",
      "Downloadable resources",
      "Live Q&A sessions",
      "New courses added monthly",
    ],
    cta: "Get Premium Access",
    highlighted: true,
  },
];

const Pricing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handlePlanClick = (planName: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (planName === "Per-Course Payment") {
      const element = document.getElementById('courses');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      toast.info("Premium Membership", {
        description: "Annual membership payment coming soon. Contact us for early access!"
      });
    }
  };

  return (
    <section id="pricing" className="py-20 bg-background" aria-labelledby="pricing-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16">
          <h2 id="pricing-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Choose Your Learning Path
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Pay per course or unlock unlimited access with annual membership
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`p-8 ${
                plan.highlighted
                  ? "border-2 border-accent shadow-2xl scale-105"
                  : "border-none shadow-2xl"
              } relative overflow-hidden`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-[hsl(17,100%,60%)] to-[hsl(5,85%,58%)] text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                  Most Popular
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {plan.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-muted-foreground">{plan.period}</span>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-accent" />
                    </div>
                    <span className="text-muted-foreground text-sm">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                type="button"
                onClick={() => handlePlanClick(plan.name)}
                className={`w-full ${
                  plan.highlighted
                    ? "bg-gradient-to-r from-[hsl(17,100%,60%)] to-[hsl(5,85%,58%)] hover:shadow-lg"
                    : "bg-primary hover:bg-primary/90"
                } text-white font-semibold py-6 transition-all duration-300`}
              >
                {plan.cta}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
