import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const coursesData = [
  {
    id: 1,
    title: "Web Development Fundamentals",
    description: "Master HTML, CSS, JavaScript, and modern web development practices",
    videoUrl: "https://www.youtube.com/embed/UB1O30fR-EE",
    duration: "12 weeks"
  },
  {
    id: 2,
    title: "Digital Marketing Mastery",
    description: "Learn SEO, social media marketing, content strategy, and analytics",
    videoUrl: "https://www.youtube.com/embed/nU-IIXBWlS4",
    duration: "10 weeks"
  },
  {
    id: 3,
    title: "UI/UX Design Principles",
    description: "Create beautiful, user-friendly designs using industry-standard tools",
    videoUrl: "https://www.youtube.com/embed/c9Wg6Cb_YlU",
    duration: "8 weeks"
  },
  {
    id: 4,
    title: "Artificial Intelligence & Machine Learning",
    description: "Dive into AI fundamentals, neural networks, and practical applications",
    videoUrl: "https://www.youtube.com/embed/ad79nYk2keg",
    duration: "14 weeks"
  }
];

const CoursesPreview = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Course Previews
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Watch short preview videos of our courses to find the perfect learning path for you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {coursesData.map((course) => (
            <Card key={course.id} className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5 text-primary" />
                  {course.title}
                </CardTitle>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video w-full mb-4 rounded-lg overflow-hidden bg-muted">
                  <iframe
                    width="100%"
                    height="100%"
                    src={course.videoUrl}
                    title={course.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Duration: {course.duration}</span>
                  <Button onClick={() => navigate(`/course/${course.id}`)}>
                    View Full Course
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CoursesPreview;
