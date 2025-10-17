import { Code, TrendingUp, Palette, BrainCircuit } from "lucide-react";
import { Card } from "@/components/ui/card";

const categories = [
  {
    icon: Code,
    title: "Web Development",
    description: "Master HTML, CSS, JavaScript, React, and modern frameworks to build powerful web applications.",
    category: "web_dev",
    courseCount: "15+ courses"
  },
  {
    icon: TrendingUp,
    title: "Digital Marketing",
    description: "Learn SEO, social media marketing, content strategy, and analytics to grow your online presence.",
    category: "marketing",
    courseCount: "12+ courses"
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "Create beautiful, user-friendly designs using industry-standard tools like Figma and Adobe XD.",
    category: "design",
    courseCount: "10+ courses"
  },
  {
    icon: BrainCircuit,
    title: "AI & Machine Learning",
    description: "Dive into artificial intelligence, neural networks, and practical machine learning applications.",
    category: "ai_ml",
    courseCount: "8+ courses"
  },
];

const Features = () => {
  const scrollToCourses = () => {
    const coursesSection = document.getElementById('courses');
    if (coursesSection) {
      coursesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="features" className="py-20 bg-secondary" aria-labelledby="features-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16">
          <h2 id="features-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Browse by Category
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose your learning path and discover courses tailored to your goals
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card
                key={index}
                className="p-6 shadow-lg border-none bg-card cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                onClick={scrollToCourses}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    scrollToCourses();
                  }
                }}
                aria-label={`View ${category.title} courses`}
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[hsl(17,100%,60%)] to-[hsl(5,85%,58%)] flex items-center justify-center mb-4">
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {category.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {category.description}
                </p>
                <p className="text-sm font-medium text-primary">
                  {category.courseCount}
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
