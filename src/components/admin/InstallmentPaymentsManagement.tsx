import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  CreditCard,
  Search,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Users,
  DollarSign,
  AlertTriangle,
} from "lucide-react";

interface InstallmentPlan {
  id: string;
  user_id: string;
  course_id: string;
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
  };
  user_email?: string;
  user_name?: string;
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

export const InstallmentPaymentsManagement = () => {
  const [installmentPlans, setInstallmentPlans] = useState<InstallmentPlan[]>([]);
  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedPlan, setSelectedPlan] = useState<InstallmentPlan | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    fetchInstallmentPlans();
  }, []);

  const fetchInstallmentPlans = async () => {
    try {
      // Fetch installment plans with courses
      const { data: plansData, error: plansError } = await supabase
        .from("payment_installments")
        .select(`
          *,
          courses(title)
        `)
        .order("created_at", { ascending: false });

      if (plansError) throw plansError;

      // Fetch profiles for all user_ids
      const userIds = [...new Set((plansData || []).map((p) => p.user_id))];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, email, full_name")
        .in("id", userIds);

      // Map profiles to plans
      const plansWithProfiles = (plansData || []).map((plan) => {
        const profile = profilesData?.find((p) => p.id === plan.user_id);
        return {
          ...plan,
          user_email: profile?.email,
          user_name: profile?.full_name,
        };
      });

      setInstallmentPlans(plansWithProfiles as InstallmentPlan[]);
    } catch (error: any) {
      console.error("Error fetching installment plans:", error);
      toast.error("Failed to load installment plans");
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentRecords = async (installmentId: string) => {
    try {
      const { data, error } = await supabase
        .from("installment_payment_records")
        .select("*")
        .eq("installment_id", installmentId)
        .order("installment_number", { ascending: true });

      if (error) throw error;
      setPaymentRecords(data || []);
    } catch (error: any) {
      console.error("Error fetching payment records:", error);
      toast.error("Failed to load payment records");
    }
  };

  const updatePlanStatus = async (planId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("payment_installments")
        .update({ status: newStatus })
        .eq("id", planId);

      if (error) throw error;
      toast.success("Plan status updated");
      fetchInstallmentPlans();
    } catch (error: any) {
      console.error("Error updating plan status:", error);
      toast.error("Failed to update status");
    }
  };

  const updatePaymentRecordStatus = async (recordId: string, newStatus: string) => {
    try {
      const updateData: { status: string; paid_at?: string } = { status: newStatus };
      if (newStatus === "paid") {
        updateData.paid_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from("installment_payment_records")
        .update(updateData)
        .eq("id", recordId);

      if (error) throw error;
      toast.success("Payment record updated");
      if (selectedPlan) {
        fetchPaymentRecords(selectedPlan.id);
      }
      fetchInstallmentPlans();
    } catch (error: any) {
      console.error("Error updating payment record:", error);
      toast.error("Failed to update payment record");
    }
  };

  const handleViewDetails = (plan: InstallmentPlan) => {
    setSelectedPlan(plan);
    fetchPaymentRecords(plan.id);
    setIsDetailsOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
      case "completed":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Completed</Badge>;
      case "suspended":
        return <Badge className="bg-red-500 hover:bg-red-600">Suspended</Badge>;
      case "overdue":
        return <Badge className="bg-orange-500 hover:bg-orange-600">Overdue</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
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
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  // Calculate statistics
  const stats = {
    totalPlans: installmentPlans.length,
    activePlans: installmentPlans.filter((p) => p.status === "active").length,
    completedPlans: installmentPlans.filter((p) => p.status === "completed").length,
    totalExpectedRevenue: installmentPlans.reduce((acc, p) => acc + p.total_amount, 0),
    totalCollected: installmentPlans.reduce((acc, p) => acc + p.total_paid, 0),
    overduePlans: installmentPlans.filter((p) => {
      if (!p.next_payment_date || p.status === "completed") return false;
      return new Date(p.next_payment_date) < new Date();
    }).length,
  };

  // Filter plans
  const filteredPlans = installmentPlans.filter((plan) => {
    const matchesSearch =
      searchTerm === "" ||
      plan.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.courses?.title?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || plan.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activePlans}</div>
            <p className="text-xs text-muted-foreground">
              of {stats.totalPlans} total plans
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedPlans}</div>
            <p className="text-xs text-muted-foreground">fully paid plans</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Collected</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{stats.totalCollected.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              of ₦{stats.totalExpectedRevenue.toLocaleString()} expected
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {stats.overduePlans}
            </div>
            <p className="text-xs text-muted-foreground">require attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Installment Payments
              </CardTitle>
              <CardDescription>
                Manage all user installment payment plans
              </CardDescription>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by student or course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Next Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No installment plans found
                  </TableCell>
                </TableRow>
              ) : (
                filteredPlans.map((plan) => {
                  const progress = (plan.total_paid / plan.total_amount) * 100;
                  const isOverdue =
                    plan.next_payment_date &&
                    new Date(plan.next_payment_date) < new Date() &&
                    plan.status !== "completed";

                  return (
                    <TableRow key={plan.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {plan.user_name || "Unknown"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {plan.user_email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {plan.courses?.title}
                      </TableCell>
                      <TableCell>
                        <div className="w-24">
                          <div className="flex justify-between text-xs mb-1">
                            <span>
                              {plan.current_installment}/{plan.total_installments}
                            </span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <Progress value={progress} className="h-1.5" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            ₦{plan.total_paid.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            of ₦{plan.total_amount.toLocaleString()}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {plan.next_payment_date ? (
                          <div className={isOverdue ? "text-destructive" : ""}>
                            {format(new Date(plan.next_payment_date), "MMM dd, yyyy")}
                            {isOverdue && (
                              <AlertCircle className="h-3 w-3 inline ml-1" />
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(plan.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(plan)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Select
                            value={plan.status}
                            onValueChange={(value) => updatePlanStatus(plan.id, value)}
                          >
                            <SelectTrigger className="w-[110px] h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="suspended">Suspend</SelectItem>
                              <SelectItem value="completed">Complete</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Payment Plan Details</DialogTitle>
          </DialogHeader>

          {selectedPlan && (
            <div className="space-y-6">
              {/* Plan Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Student</p>
                  <p className="font-medium">
                    {selectedPlan.user_name || "Unknown"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedPlan.user_email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Course</p>
                  <p className="font-medium">{selectedPlan.courses?.title}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="font-medium">
                    ₦{selectedPlan.total_amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount Paid</p>
                  <p className="font-medium">
                    ₦{selectedPlan.total_paid.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Progress */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Payment Progress</span>
                  <span>
                    {selectedPlan.current_installment} of{" "}
                    {selectedPlan.total_installments} payments
                  </span>
                </div>
                <Progress
                  value={(selectedPlan.total_paid / selectedPlan.total_amount) * 100}
                  className="h-2"
                />
              </div>

              {/* Payment Records */}
              <div>
                <h4 className="font-semibold mb-3">Payment Records</h4>
                <div className="space-y-2">
                  {paymentRecords.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No payment records found
                    </p>
                  ) : (
                    paymentRecords.map((record) => (
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
                                : "Not paid"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="font-semibold">
                            ₦{record.amount.toLocaleString()}
                          </p>
                          <Select
                            value={record.status}
                            onValueChange={(value) =>
                              updatePaymentRecordStatus(record.id, value)
                            }
                          >
                            <SelectTrigger className="w-[100px] h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="paid">Paid</SelectItem>
                              <SelectItem value="overdue">Overdue</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
