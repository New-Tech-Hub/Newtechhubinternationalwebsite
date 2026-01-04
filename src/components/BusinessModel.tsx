import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Users, Award, Lock } from "lucide-react";

const BusinessModel = () => {
  return (
    <section id="business-model" className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            How We Make Learning Sustainable
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our freemium model ensures quality education remains accessible while maintaining platform excellence
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle>Free Tier</CardTitle>
                <Badge variant="secondary">Forever Free</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Zap className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span>Access to 50+ free courses across all categories</span>
                </li>
                <li className="flex items-start gap-2">
                  <Users className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span>Community forums and peer support</span>
                </li>
                <li className="flex items-start gap-2">
                  <Award className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span>Basic certificates of completion</span>
                </li>
              </ul>
              <p className="text-sm text-muted-foreground mt-6">
                Perfect for getting started and exploring digital skills
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle>Premium Access</CardTitle>
                <Badge className="bg-primary">Paid Plans Available</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Lock className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span>Exclusive advanced courses and specializations</span>
                </li>
                <li className="flex items-start gap-2">
                  <Award className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span>Verified certificates recognized by employers</span>
                </li>
                <li className="flex items-start gap-2">
                  <Users className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span>1-on-1 mentorship and career guidance</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span>Priority support and offline downloads</span>
                </li>
              </ul>
              <p className="text-sm text-muted-foreground mt-6">
                For serious learners committed to career transformation
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-card rounded-lg p-8 shadow-sm">
          <h3 className="text-2xl font-bold mb-6 text-center">Revenue Streams & Sustainability</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-2 text-primary">Course Sales</h4>
              <p className="text-sm text-muted-foreground">
                Affordable premium courses with lifetime access, priced for African markets (₦5,000 - ₦25,000)
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-primary">Corporate Partnerships</h4>
              <p className="text-sm text-muted-foreground">
                Enterprise training solutions for companies upskilling their workforce at scale
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-primary">Certification Programs</h4>
              <p className="text-sm text-muted-foreground">
                Professional certifications that boost employability and are recognized across the continent
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-primary/5 rounded-lg">
            <h4 className="font-semibold mb-2 text-center">Our Commitment</h4>
            <p className="text-sm text-muted-foreground text-center max-w-3xl mx-auto">
              70% of our content will always remain free. Revenue from premium offerings funds platform improvements, 
              instructor compensation, and scholarships for learners who can't afford paid courses. We're backed by 
              impact investors committed to education access across Africa.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessModel;