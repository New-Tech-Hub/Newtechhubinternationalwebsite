import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users, Loader2, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import marketingImage from "@/assets/course-marketing-new.jpg";
import webdevImage from "@/assets/course-webdev-new.jpg";
import aiImage from "@/assets/course-ai-new.jpg";
import designImage from "@/assets/course-design-new.jpg";

const Courses = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('published', true);

        if (error) throw error;

        // Map to course format with images
        const imageMap: Record<string, any> = {
          'digital_marketing': marketingImage,
          'web_development': webdevImage,
          'ai_data': aiImage,
          'graphic_design': designImage,
          'cybersecurity': webdevImage,
          'freelancing': marketingImage,
          'video_editing': designImage,
        };

        const coursesWithImages = (data || []).map(course => ({
          id: course.id,
          title: course.title,
          description: course.description,
          image: imageMap[course.category] || webdevImage,
          videoUrl: course.video_preview_url,
          duration: `${course.estimated_hours || 8} weeks`,
          students: "Coming soon",
          level: course.difficulty_level,
          price: course.price,
        }));

        setCourses(coursesWithImages);
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleEnroll = (courseId: string) => {
    navigate(`/course/${courseId}`);
  };

  if (loading) {
    return (
      <section id="courses" className="py-20 bg-background">
        <div className="container mx-auto px-4 flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  return (
    <section id="courses" className="py-20 bg-background" aria-labelledby="courses-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16">
          <h2 id="courses-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Featured Courses
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our most sought-after courses designed to transform your career
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="overflow-hidden shadow-xl -translate-y-2 border-none group"
            >
              <div className="relative h-48 overflow-hidden group/video">
                {course.videoUrl ? (
                  <>
                    <iframe
                      src={course.videoUrl}
                      title={`${course.title} preview`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover/video:opacity-100 transition-opacity pointer-events-none">
                      <div className="bg-white/90 rounded-full p-3">
                        <Play className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </>
                ) : (
                  <img
                    src={course.image}
                    alt={`${course.title} - ${course.description}`}
                    loading="lazy"
                    className="w-full h-full object-cover scale-110"
                  />
                )}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-accent/10 backdrop-blur-sm text-accent text-sm font-semibold rounded-full">
                    Premium
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-muted-foreground mb-4 text-sm line-clamp-3">
                  {course.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{course.students}</span>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-primary">
                    ₦{course.price.toLocaleString()}
                  </span>
                </div>
                  <Button 
                    type="button"
                    onClick={() => handleEnroll(course.id)}
                    className="w-full bg-gradient-to-r from-[hsl(17,100%,60%)] to-[hsl(5,85%,58%)] hover:shadow-lg transition-all duration-300"
                  >
                    View Course
                  </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            More premium courses coming soon!
          </p>
        </div>
      </div>
    </section>
  );
};

export default Courses;
