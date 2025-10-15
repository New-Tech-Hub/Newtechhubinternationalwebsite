import { BookOpen, Award, Globe, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: BookOpen,
    title: "100% Free & Paid Courses",
    description: "Access a wide range of digital skills courses, from beginner to advanced levels, tailored for African learners.",
  },
  {
    icon: Award,
    title: "Certified Instructors",
    description: "Learn from industry experts with real-world experience and localized content that resonates with African contexts.",
  },
  {
    icon: Globe,
    title: "Access Anytime, Anywhere",
    description: "Study at your own pace with 24/7 access to course materials on any device, from anywhere in Africa.",
  },
  {
    icon: TrendingUp,
    title: "Career-Boosting Certificates",
    description: "Earn recognized certificates upon completion to showcase your skills and advance your career opportunities.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-secondary" aria-labelledby="features-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16">
          <h2 id="features-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Why Choose Us
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're committed to providing the best learning experience for Africa's digital generation
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="p-6 shadow-lg border-none bg-card"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[hsl(17,100%,60%)] to-[hsl(5,85%,58%)] flex items-center justify-center mb-4">
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
