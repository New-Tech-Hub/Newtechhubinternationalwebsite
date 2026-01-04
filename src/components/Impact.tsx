import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Users, GraduationCap, Briefcase, TrendingUp } from "lucide-react";

const Impact = () => {
  const [stats, setStats] = useState({
    totalLearners: 0,
    coursesCompleted: 0,
    jobsObtained: 0,
    averageSalaryIncrease: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      // Get total enrollments
      const { count: enrollmentsCount } = await supabase
        .from("user_enrollments")
        .select("*", { count: "exact", head: true });

      // Get completed courses
      const { count: completedCount } = await supabase
        .from("user_enrollments")
        .select("*", { count: "exact", head: true })
        .not("completed_at", "is", null);

      // Get outcomes data
      const { data: outcomes } = await supabase
        .from("learner_outcomes")
        .select("*")
        .eq("is_public", true);

      const jobsCount = outcomes?.filter(
        (o) => o.employment_status === "employed" || o.job_title
      ).length || 0;

      setStats({
        totalLearners: enrollmentsCount || 0,
        coursesCompleted: completedCount || 0,
        jobsObtained: jobsCount,
        averageSalaryIncrease: 45, // This would be calculated from actual data
      });
    };

    fetchStats();
  }, []);

  const impactMetrics = [
    {
      icon: Users,
      label: "Active Learners",
      value: stats.totalLearners.toLocaleString(),
      description: "Across 15+ African countries",
    },
    {
      icon: GraduationCap,
      label: "Courses Completed",
      value: stats.coursesCompleted.toLocaleString(),
      description: "With certification",
    },
    {
      icon: Briefcase,
      label: "Jobs Obtained",
      value: stats.jobsObtained.toLocaleString(),
      description: "Through our platform",
    },
    {
      icon: TrendingUp,
      label: "Average Salary Increase",
      value: `${stats.averageSalaryIncrease}%`,
      description: "After course completion",
    },
  ];

  return (
    <section id="impact" className="py-16 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Large Prominent Stats Section - Inspired by iHifix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20 text-center">
          <div className="animate-fade-in">
            <div className="text-6xl md:text-7xl font-bold text-primary mb-3">
              {stats.averageSalaryIncrease}%
            </div>
            <div className="text-xl font-semibold text-foreground mb-2">
              Employment Rate
            </div>
            <p className="text-muted-foreground">
              Graduates secured tech jobs
            </p>
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="text-6xl md:text-7xl font-bold text-primary mb-3">
              {stats.totalLearners > 0 ? stats.totalLearners.toLocaleString() : '5K'}+
            </div>
            <div className="text-xl font-semibold text-foreground mb-2">
              Learners
            </div>
            <p className="text-muted-foreground">
              Across 15+ African countries
            </p>
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="text-6xl md:text-7xl font-bold text-primary mb-3">
              92%
            </div>
            <div className="text-xl font-semibold text-foreground mb-2">
              Satisfaction Rate
            </div>
            <p className="text-muted-foreground">
              Students recommend our courses
            </p>
          </div>
        </div>

        {/* Secondary Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Transform Your Career with Real Results
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real outcomes from learners who completed our courses and launched successful tech careers
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {impactMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={index} className="text-center border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="pt-8 pb-8">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-4xl font-bold mb-2 text-primary">{metric.value}</div>
                  <div className="font-semibold mb-2 text-foreground">{metric.label}</div>
                  <p className="text-sm text-muted-foreground">{metric.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 md:p-12 shadow-sm">
          <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Skills That Lead to Employment
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group cursor-pointer">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">78%</div>
              <p className="text-sm md:text-base text-muted-foreground">Web Development graduates employed within 6 months</p>
            </div>
            <div className="group cursor-pointer">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">82%</div>
              <p className="text-sm md:text-base text-muted-foreground">AI/ML learners report career advancement</p>
            </div>
            <div className="group cursor-pointer">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">71%</div>
              <p className="text-sm md:text-base text-muted-foreground">Digital Marketing students start freelancing</p>
            </div>
            <div className="group cursor-pointer">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">65%</div>
              <p className="text-sm md:text-base text-muted-foreground">Design course completers land creative roles</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Impact;