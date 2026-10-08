import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, X } from "lucide-react";
import { Analytics } from "@/lib/analytics";

interface UpsellOfferProps {
  currentCourseId: string;
  onDismiss?: () => void;
}

const UpsellOffer = ({ currentCourseId, onDismiss }: UpsellOfferProps) => {
  const navigate = useNavigate();
  const [relatedCourses, setRelatedCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRelatedCourses();
    Analytics.upsellView(currentCourseId);
  }, [currentCourseId]);

  const fetchRelatedCourses = async () => {
    try {
      // Get the current course to find related ones
      const { data: currentCourse } = await supabase
        .from('courses')
        .select('category')
        .eq('id', currentCourseId)
        .single();

      if (currentCourse) {
        // Fetch 2 related courses from the same category
        const { data, error } = await supabase
          .from('courses')
          .select('id, title, description, price, estimated_hours')
          .eq('published', true)
          .eq('category', currentCourse.category)
          .neq('id', currentCourseId)
          .limit(2);

        if (error) throw error;
        setRelatedCourses(data || []);
      }
    } catch (error) {
      console.error('Error fetching related courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptUpsell = (courseId: string) => {
    Analytics.upsellAccepted(currentCourseId, courseId);
    navigate(`/course/${courseId}`);
  };

  const handleDecline = () => {
    Analytics.upsellDeclined(currentCourseId);
    if (onDismiss) onDismiss();
  };

  if (loading || relatedCourses.length === 0) {
    return null;
  }

  return (
    <Card className="relative p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
      <button
        onClick={handleDecline}
        className="absolute top-4 right-4 p-1 hover:bg-accent/10 rounded-full transition-colors"
        aria-label="Dismiss offer"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 bg-accent/20 rounded-lg">
          <Sparkles className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h3 className="text-xl font-bold mb-1">Complete Your Learning Path!</h3>
          <p className="text-muted-foreground text-sm">
            Students who take these courses together see 3x better results
          </p>
        </div>
      </div>

      <div className="space-y-3 mt-6">
        {relatedCourses.map((course) => (
          <div
            key={course.id}
            className="flex items-center justify-between p-4 bg-background rounded-lg border border-border hover:border-accent/30 transition-colors"
          >
            <div className="flex-1">
              <h4 className="font-semibold text-sm mb-1">{course.title}</h4>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {course.description}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm font-bold text-accent">
                  ₦{course.price?.toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground">
                  • {course.estimated_hours}h
                </span>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => handleAcceptUpsell(course.id)}
              className="ml-4"
            >
              View Course
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>🎁 Special bundle pricing available</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDecline}
            className="text-xs"
          >
            Maybe Later
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default UpsellOffer;
