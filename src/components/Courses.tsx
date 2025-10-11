import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users } from "lucide-react";
import marketingImage from "@/assets/course-marketing.jpg";
import webdevImage from "@/assets/course-webdev.jpg";
import aiImage from "@/assets/course-ai.jpg";
import designImage from "@/assets/course-design.jpg";

const courses = [
  {
    id: 1,
    title: "Digital Marketing for Beginners",
    description: "Master social media marketing, SEO, content creation, and digital advertising strategies.",
    image: marketingImage,
    duration: "8 weeks",
    students: "2,450+",
    level: "Beginner",
    price: "Free",
  },
  {
    id: 2,
    title: "Web Design & Development",
    description: "Learn HTML, CSS, JavaScript, and WordPress to build stunning websites from scratch.",
    image: webdevImage,
    duration: "12 weeks",
    students: "3,200+",
    level: "Beginner",
    price: "Free",
  },
  {
    id: 3,
    title: "Artificial Intelligence Essentials",
    description: "Understand AI fundamentals, machine learning basics, and practical AI applications.",
    image: aiImage,
    duration: "10 weeks",
    students: "1,850+",
    level: "Intermediate",
    price: "Premium",
  },
  {
    id: 4,
    title: "Graphic Design Mastery",
    description: "Create stunning visuals with Canva and Photoshop. Perfect for social media and branding.",
    image: designImage,
    duration: "6 weeks",
    students: "2,900+",
    level: "Beginner",
    price: "Free",
  },
];

const Courses = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Popular Course Categories
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our most sought-after courses designed to transform your career
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-none group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-primary text-sm font-semibold rounded-full">
                    {course.price}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-muted-foreground mb-4 text-sm line-clamp-2">
                  {course.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course.students}</span>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-accent to-[hsl(18,100%,55%)] hover:shadow-lg transition-all duration-300">
                  Enroll Now
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold px-8"
          >
            View All Courses
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Courses;
