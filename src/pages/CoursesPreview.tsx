import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Play, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CoursesPreview = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('id, title, description, estimated_hours')
          .eq('published', true);

        if (error) throw error;

        const coursesWithVideos = (data || []).map(course => ({
          id: course.id,
          title: course.title,
          description: course.description,
          duration: `${course.estimated_hours || 8} weeks`,
        }));

        setCourses(coursesWithVideos);
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error('Failed to load course previews');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 flex items-center justify-center min-h-[70vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4 hover:bg-primary/10"
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

        {courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No video previews available yet. Check back soon!</p>
            <Button onClick={() => navigate('/')} className="mt-6">
              Browse Courses
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {courses.map((course) => (
              <Card key={course.id} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5 text-primary" />
                    {course.title}
                  </CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video w-full mb-4 rounded-lg overflow-hidden bg-muted relative group cursor-pointer"
                    onClick={() => navigate(`/course/${course.id}`)}
                  >
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10 group-hover:bg-background/90 transition-all">
                      <div className="text-center">
                        <div className="bg-primary/10 p-6 rounded-full mb-4 inline-block">
                          <Play className="h-12 w-12 text-primary" />
                        </div>
                        <p className="text-lg font-semibold">Click to unlock full course</p>
                        <p className="text-sm text-muted-foreground mt-2">Payment required</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Duration: {course.duration}</span>
                    <Button 
                      onClick={() => navigate(`/course/${course.id}`)}
                      className="bg-gradient-to-r from-[hsl(17,100%,60%)] to-[hsl(5,85%,58%)] hover:shadow-lg transition-all duration-300"
                    >
                      View Full Course
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CoursesPreview;
