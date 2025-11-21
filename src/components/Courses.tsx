import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, Users, Loader2, Play, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Analytics } from "@/lib/analytics";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import marketingImage from "@/assets/course-marketing-new.jpg";
import webdevImage from "@/assets/course-webdev-new.jpg";
import aiImage from "@/assets/course-ai-new.jpg";
import designImage from "@/assets/course-design-new.jpg";

const Courses = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { elementRef, isVisible } = useScrollAnimation();

  const categories = [
    { value: "all", label: "All Courses" },
    { value: "digital_marketing", label: "Digital Marketing" },
    { value: "web_development", label: "Web Development" },
    { value: "graphic_design", label: "Graphic Design" },
    { value: "ai_data", label: "AI & Data" },
    { value: "cybersecurity", label: "Cybersecurity" },
    { value: "video_editing", label: "Video Editing" },
    { value: "freelancing", label: "Freelancing" },
  ];

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
          category: course.category,
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

  const handleEnroll = (courseId: string, courseTitle: string) => {
    Analytics.courseCardClick(courseId, courseTitle);
    navigate(`/course/${courseId}`);
  };

  // Filter courses based on search and category
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [courses, searchTerm, selectedCategory]);

  useEffect(() => {
    if (courses.length > 0) {
      Analytics.courseListView();
    }
  }, [courses]);

  if (loading) {
    return (
      <section id="courses" className="py-20 bg-background">
        <div className="container mx-auto px-4 flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  // Generate JSON-LD structured data for courses
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": filteredCourses.map((course, index) => ({
      "@type": "Course",
      "position": index + 1,
      "name": course.title,
      "description": course.description,
      "provider": {
        "@type": "Organization",
        "name": "New Tech Hub International",
        "url": "https://newtechhub.lovable.app"
      },
      "offers": {
        "@type": "Offer",
        "price": course.price,
        "priceCurrency": "NGN"
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <section id="courses" className="py-20 bg-background" aria-labelledby="courses-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-12">
            <h1 id="courses-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Premium Digital Skills Courses for African Tech Professionals
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Master in-demand tech skills with our expert-led courses in Web Development, AI, Cybersecurity, Digital Marketing, and Graphic Design
            </p>
          </header>

          {/* Search and Filter Section */}
          <div className="max-w-4xl mx-auto mb-12 space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search courses by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg border-2 focus:border-primary transition-all duration-300 rounded-xl"
              />
            </div>

            {/* Category Filter Buttons */}
            <div className="flex flex-wrap gap-3 justify-center items-center">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Filter className="h-4 w-4" />
                <span>Filter:</span>
              </div>
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                  className="transition-all duration-300 hover:scale-105"
                >
                  {category.label}
                </Button>
              ))}
            </div>

            {/* Results Count */}
            <div className="text-center text-sm text-muted-foreground">
              Showing {filteredCourses.length} of {courses.length} courses
            </div>
          </div>

        {filteredCourses.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground mb-2">No courses found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div ref={elementRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {filteredCourses.map((course, index) => (
            <Card
              key={course.id}
              className={`overflow-hidden shadow-xl border-none group transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${
                isVisible ? 'animate-fade-in' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div 
                className="relative h-48 overflow-hidden group/video cursor-pointer"
                onClick={() => handleEnroll(course.id, course.title)}
              >
                {course.videoUrl ? (
                  <>
                    <iframe
                      src={course.videoUrl}
                      title={`${course.title} preview`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full object-cover pointer-events-none transition-transform duration-300 group-hover/video:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover/video:bg-black/50 transition-all duration-300">
                      <div className="bg-white/90 rounded-full p-4 group-hover/video:scale-110 transition-transform duration-300">
                        <Play className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                  </>
                ) : (
                  <img
                    src={course.image}
                    alt={`Learn ${course.title} - ${course.level} level course for African tech professionals covering ${course.description}`}
                    loading="lazy"
                    width="400"
                    height="300"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                )}
                <div className="absolute top-4 right-4 z-10">
                  <span className="px-3 py-1 bg-accent/10 backdrop-blur-sm text-accent text-sm font-semibold rounded-full transition-all duration-300 group-hover:bg-accent/20 group-hover:scale-105">
                    Premium
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2 transition-colors duration-300 group-hover:text-primary">
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
                    onClick={() => handleEnroll(course.id, course.title)}
                    className="w-full bg-gradient-to-r from-[hsl(17,100%,60%)] to-[hsl(5,85%,58%)] hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    View Course
                  </Button>
              </div>
            </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            More premium courses coming soon!
          </p>
        </div>
        </div>
      </section>
    </>
  );
};

export default Courses;
