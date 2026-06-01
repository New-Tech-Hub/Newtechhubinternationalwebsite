import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Clock, Users, BarChart, ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Analytics } from "@/lib/analytics";
import { useCourseAccess } from "@/hooks/useCourseAccess";
import { LockedVideoPlayer } from "@/components/LockedVideoPlayer";
import { VideoPlayer } from "@/components/VideoPlayer";
import { InstallmentPlanSelector } from "@/components/InstallmentPlanSelector";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasAccess, isAdmin, loading: accessLoading } = useCourseAccess(id);
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [paymentPlans, setPaymentPlans] = useState<any[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    fetchCourse();
  }, [id]);

  useEffect(() => {
    if (course) {
      Analytics.courseDetailView(course.id, course.title, course.price);
    }
  }, [course]);

  const fetchCourse = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setCourse(data);

      // Fetch payment plans for premium courses (400k+)
      if (data && data.price >= 400000) {
        const { data: plans, error: plansError } = await supabase
          .from('payment_plans')
          .select('*')
          .eq('course_id', id)
          .eq('is_active', true)
          .order('installment_count', { ascending: true });

        if (!plansError && plans) {
          setPaymentPlans(plans);
        }
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const handleFormFocus = () => {
    if (course && !enrolling) {
      Analytics.leadCaptureStart(course.id);
    }
  };

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnrolling(true);

    try {
      // Track lead capture completion
      Analytics.leadCaptureComplete(course.id, formData.email);
      
      // Track payment initiation
      Analytics.paymentInitiated(course.id, course.price);

      const { data, error } = await supabase.functions.invoke('initialize-payment', {
        body: {
          courseId: id,
          email: formData.email,
          fullName: formData.fullName,
          phone: formData.phone,
          paymentType: selectedPlanId ? 'installment' : 'full',
          ...(selectedPlanId && { planId: selectedPlanId })
        },
      });

      if (error) throw error;

      // Redirect to Paystack payment page
      window.location.href = data.authorizationUrl;
    } catch (error: any) {
      console.error('Error enrolling:', error);
      console.error('Enrollment error:', error);
      toast.error('Unable to process enrollment. Please try again or contact support.');
      setEnrolling(false);
    }
  };

  if (loading || accessLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Course not found</h2>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  // Generate JSON-LD structured data for course detail
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.title,
    "description": course.description,
    "provider": {
      "@type": "Organization",
      "name": "New Tech Hub International",
      "sameAs": "https://newtechhub.lovable.app"
    },
    "offers": {
      "@type": "Offer",
      "price": course.price,
      "priceCurrency": "NGN",
      "availability": "https://schema.org/InStock"
    },
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "online",
      "courseWorkload": `PT${course.estimated_hours}H`
    },
    "educationalLevel": course.difficulty_level
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-6"
            aria-label="Go back to courses page"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          <article className="lg:col-span-2">
            {/* Video or locked video player */}
            {course.video_preview_url && (
              <div className="mb-6">
                {hasAccess || isAdmin ? (
                  <VideoPlayer 
                    videoUrl={course.video_preview_url}
                    title={course.title}
                  />
                ) : (
                  <LockedVideoPlayer
                    courseId={course.id}
                    courseTitle={course.title}
                    thumbnailUrl={course.thumbnail_url}
                    isLoggedIn={!!user}
                  />
                )}
              </div>
            )}
            
            {course.thumbnail_url && !course.video_preview_url && (
              <img
                src={course.thumbnail_url}
                alt={`${course.title} - Complete ${course.difficulty_level} level course covering ${course.description}`}
                className="w-full h-64 object-cover rounded-lg mb-6"
                width="800"
                height="400"
              />
            )}
            
            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-5 w-5" />
                <span>{course.estimated_hours} hours</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <BarChart className="h-5 w-5" />
                <span className="capitalize">{course.difficulty_level}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-5 w-5" />
                <span>200+ students</span>
              </div>
            </div>

            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold mb-4">About This Course</h2>
              <p className="text-lg mb-6">{course.description}</p>
              
              <h2 className="text-2xl font-semibold mb-4">What You'll Learn</h2>
              <ul className="space-y-2 mb-6">
                <li>Master the fundamentals of {course.title}</li>
                <li>Build real-world projects and portfolios</li>
                <li>Get lifetime access to course materials</li>
                <li>Receive a certificate upon completion</li>
              </ul>
            </div>
          </article>

          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6" id="enrollment">
              <div className="mb-6">
                <div className="text-4xl font-bold text-primary mb-2">
                  ₦{course.price?.toLocaleString()}
                </div>
                <div className="inline-block bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-semibold">
                  Premium Course
                </div>
              </div>

              {hasAccess || isAdmin ? (
                <div className="space-y-4">
                  <div className="bg-primary/10 text-primary p-4 rounded-lg text-center">
                    <p className="font-semibold">✓ You have full access to this course</p>
                  </div>
                  {!isAdmin && (
                    <Button
                      onClick={() => navigate(`/redeem-access/${course.id}`)}
                      variant="outline"
                      className="w-full"
                    >
                      Enter Another Access Code
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  <form onSubmit={handleEnroll} className="space-y-4" onFocus={handleFormFocus}>
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+234 800 000 0000"
                  />
                </div>

                {paymentPlans.length > 0 && (
                  <InstallmentPlanSelector
                    plans={paymentPlans}
                    selectedPlanId={selectedPlanId}
                    onSelectPlan={setSelectedPlanId}
                    coursePrice={course.price}
                  />
                )}

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={enrolling}
                >
                  {enrolling ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Enroll Now'
                  )}
                </Button>

                <div className="text-xs text-center text-muted-foreground">
                  Secure payment powered by Paystack
                </div>
              </form>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                After payment, you'll receive an access code from the admin to unlock the course.
              </div>
              </>
              )}

              <div className="mt-6 pt-6 border-t space-y-3">
                <h3 className="font-semibold mb-3">This course includes:</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div>✓ Lifetime access</div>
                  <div>✓ Certificate of completion</div>
                  <div>✓ Downloadable resources</div>
                  <div>✓ Community support</div>
                  <div>✓ 30-day money-back guarantee</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
        </div>
      </div>
    </>
  );
};

export default CourseDetail;
