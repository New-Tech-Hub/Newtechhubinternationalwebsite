import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard, Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";

interface InstallmentPlan {
  id: string;
  course_id: string;
  plan_id: string | null;
  total_installments: number;
  current_installment: number;
  installment_amount: number;
  total_paid: number;
  total_amount: number;
  next_payment_date: string | null;
  status: string;
  created_at: string;
  courses: {
    title: string;
    thumbnail_url: string | null;
  };
  payment_plans: {
    plan_name: string;
  } | null;
}

interface PaymentRecord {
  id: string;
  installment_id: string;
  installment_number: number;
  amount: number;
  status: string;
  paid_at: string | null;
  created_at: string;
}

const MyPayments = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [installmentPlans, setInstallmentPlans] = useState<InstallmentPlan[]>([]);
  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please sign in to view your payments");
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Fetch installment plans
        const { data: plans, error: plansError } = await supabase
          .from("payment_installments")
          .select(`
            *,
            courses(title, thumbnail_url),
            payment_plans(plan_name)
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (plansError) throw plansError;

        setInstallmentPlans(plans || []);

        // Fetch payment records for all installment plans
        if (plans && plans.length > 0) {
          const installmentIds = plans.map((p) => p.id);
          const { data: records, error: recordsError } = await supabase
            .from("installment_payment_records")
            .select("*")
            .in("installment_id", installmentIds)
            .order("installment_number", { ascending: true });

          if (recordsError) throw recordsError;
          setPaymentRecords(records || []);
        }
      } catch (error: any) {
        console.error("Error fetching payment data:", error);
        toast.error("Failed to load payment information");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "completed":
        return "bg-blue-500";
      case "suspended":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "overdue":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const calculateProgress = (plan: InstallmentPlan) => {
    return (plan.total_paid / plan.total_amount) * 100;
  };

  const isUpcomingPayment = (nextDate: string | null) => {
    if (!nextDate) return false;
    const daysUntil = Math.ceil(
      (new Date(nextDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntil <= 7 && daysUntil >= 0;
  };

  if (authLoading || loading) {
    return (
      <>
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              My Payments
            </h1>
            <p className="text-muted-foreground">
              Track your installment plans and payment history
            </p>
          </div>

          {installmentPlans.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No Payment Plans</h3>
                <p className="text-muted-foreground mb-6">
                  You don't have any active installment plans yet.
                </p>
                <Button onClick={() => navigate("/")}>Browse Courses</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Active Installment Plans */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Active Plans</h2>
                {installmentPlans.map((plan) => {
                  const planRecords = paymentRecords.filter(
                    (r) => r.installment_id === plan.id
                  );
                  const progress = calculateProgress(plan);
                  const hasUpcomingPayment = isUpcomingPayment(plan.next_payment_date);

                  return (
                    <Card key={plan.id} className="overflow-hidden">
                      <CardHeader className="border-b bg-muted/30">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                          <div className="flex gap-4">
                            {plan.courses.thumbnail_url && (
                              <img
                                src={plan.courses.thumbnail_url}
                                alt={plan.courses.title}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                            )}
                            <div>
                              <CardTitle className="text-xl mb-1">
                                {plan.courses.title}
                              </CardTitle>
                              <CardDescription>
                                {plan.payment_plans?.plan_name || "Custom Plan"}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge className={getStatusColor(plan.status)}>
                            {plan.status.toUpperCase()}
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-6 space-y-6">
                        {/* Progress Bar */}
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-semibold">
                              {plan.current_installment} of {plan.total_installments} payments
                            </span>
                          </div>
                          <Progress value={progress} className="h-2" />
                          <div className="flex justify-between text-sm mt-2">
                            <span className="text-muted-foreground">
                              ₦{plan.total_paid.toLocaleString()} paid
                            </span>
                            <span className="text-muted-foreground">
                              ₦{plan.total_amount.toLocaleString()} total
                            </span>
                          </div>
                        </div>

                        {/* Payment Information */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                            <CreditCard className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">
                                Installment Amount
                              </p>
                              <p className="font-semibold">
                                ₦{plan.installment_amount.toLocaleString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                            <Calendar className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">
                                Next Payment
                              </p>
                              <p className="font-semibold">
                                {plan.next_payment_date
                                  ? format(new Date(plan.next_payment_date), "MMM dd, yyyy")
                                  : "N/A"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                            <Clock className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">
                                Started On
                              </p>
                              <p className="font-semibold">
                                {format(new Date(plan.created_at), "MMM dd, yyyy")}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Upcoming Payment Reminder */}
                        {hasUpcomingPayment && plan.next_payment_date && (
                          <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900 rounded-lg">
                            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
                            <div>
                              <p className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                                Payment Due Soon
                              </p>
                              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                Your next payment of ₦{plan.installment_amount.toLocaleString()}{" "}
                                is due on {format(new Date(plan.next_payment_date), "MMMM dd, yyyy")}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Payment History */}
                        <div>
                          <h4 className="font-semibold mb-3">Payment History</h4>
                          <div className="space-y-2">
                            {planRecords.length === 0 ? (
                              <p className="text-sm text-muted-foreground">
                                No payment records yet
                              </p>
                            ) : (
                              planRecords.map((record) => (
                                <div
                                  key={record.id}
                                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border"
                                >
                                  <div className="flex items-center gap-3">
                                    {getPaymentStatusIcon(record.status)}
                                    <div>
                                      <p className="font-medium">
                                        Payment #{record.installment_number}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {record.paid_at
                                          ? format(new Date(record.paid_at), "MMM dd, yyyy")
                                          : "Pending"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-semibold">
                                      ₦{record.amount.toLocaleString()}
                                    </p>
                                    <Badge
                                      variant={
                                        record.status === "paid"
                                          ? "default"
                                          : record.status === "overdue"
                                          ? "destructive"
                                          : "secondary"
                                      }
                                      className="text-xs"
                                    >
                                      {record.status}
                                    </Badge>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyPayments;
