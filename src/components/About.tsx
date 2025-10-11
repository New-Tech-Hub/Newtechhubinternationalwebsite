import { Target, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";

const About = () => {
  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              About New Tech Hub International
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              New Tech Hub International is a leading African digital innovation and training company committed to closing the technology skills gap. We offer cutting-edge learning experiences that empower individuals and businesses to thrive in today's digital economy.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              From web design to AI, digital marketing to software development — we make premium education accessible, practical, and tailored for Africa's digital generation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <Card className="p-8 border-none bg-card hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[hsl(17,100%,60%)] to-[hsl(5,85%,58%)] flex items-center justify-center mb-6">
                <Eye className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To become Africa's most trusted source for tech education and digital transformation, empowering millions to thrive in the digital economy.
              </p>
            </Card>

            <Card className="p-8 border-none bg-card hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[hsl(17,100%,60%)] to-[hsl(5,85%,58%)] flex items-center justify-center mb-6">
                <Target className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To empower one million Africans with relevant tech and business skills through accessible and affordable digital learning experiences.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
