import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Users, Clock, UserCheck, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

type DashboardStats = {
  totalRevenue: number;
  activeStudents: number;
  pendingPayments: number;
  totalEnrollments: number;
};

type RecentEnrollment = {
  id: string;
  user_email: string;
  user_name: string | null;
  course_title: string;
  granted_at: string;
};

export const DashboardMetrics = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    activeStudents: 0,
    pendingPayments: 0,
    totalEnrollments: 0,
  });
  const [recentEnrollments, setRecentEnrollments] = useState<RecentEnrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch total revenue from verified payments
      const { data: payments, error: paymentsError } = await supabase
        .from('payments')
        .select('amount, status')
        .eq('status', 'verified');

      if (paymentsError) throw paymentsError;

      const totalRevenue = payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;

      // Fetch pending payments count
      const { count: pendingPaymentsCount, error: pendingError } = await supabase
        .from('payments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      if (pendingError) throw pendingError;

      // Fetch active students (unique users with course access)
      const { count: activeStudentsCount, error: studentsError } = await supabase
        .from('user_course_access')
        .select('user_id', { count: 'exact', head: true });

      if (studentsError) throw studentsError;

      // Fetch total enrollments
      const { count: totalEnrollmentsCount, error: enrollmentsError } = await supabase
        .from('user_course_access')
        .select('*', { count: 'exact', head: true });

      if (enrollmentsError) throw enrollmentsError;

      // Fetch recent enrollments with user and course info
      const { data: enrollments, error: recentError } = await supabase
        .from('user_course_access')
        .select(`
          id,
          granted_at,
          user_id,
          course_id,
          profiles!user_id(email, full_name),
          courses!course_id(title)
        `)
        .order('granted_at', { ascending: false })
        .limit(10);

      if (recentError) throw recentError;

      const formattedEnrollments = enrollments?.map((enrollment: any) => ({
        id: enrollment.id,
        user_email: enrollment.profiles.email,
        user_name: enrollment.profiles.full_name,
        course_title: enrollment.courses.title,
        granted_at: enrollment.granted_at,
      })) || [];

      setStats({
        totalRevenue,
        activeStudents: activeStudentsCount || 0,
        pendingPayments: pendingPaymentsCount || 0,
        totalEnrollments: totalEnrollmentsCount || 0,
      });
      setRecentEnrollments(formattedEnrollments);
    } catch (error: any) {
      toast.error('Failed to fetch dashboard data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-4 w-4 bg-muted rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-32 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">From verified payments</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <UserCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeStudents}</div>
            <p className="text-xs text-muted-foreground mt-1">With course access</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingPayments}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting verification</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEnrollments}</div>
            <p className="text-xs text-muted-foreground mt-1">Course accesses granted</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Recent Enrollments
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentEnrollments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No enrollments yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentEnrollments.map((enrollment) => (
                  <TableRow key={enrollment.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{enrollment.user_name || 'N/A'}</p>
                        <p className="text-sm text-muted-foreground">{enrollment.user_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{enrollment.course_title}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(enrollment.granted_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
