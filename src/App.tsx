import React, { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Index from "./pages/Index";
import { useCopyProtection } from "./hooks/useCopyProtection";

// Lazy load route components for better performance (Index is loaded normally as it uses router hooks)
const Auth = lazy(() => import("./pages/Auth"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));
const CourseDetail = lazy(() => import("./pages/CourseDetail"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const CoursesPreview = lazy(() => import("./pages/CoursesPreview"));
const Community = lazy(() => import("./pages/Community"));
const MyCertificates = lazy(() => import("./pages/MyCertificates"));
const RedeemAccessCode = lazy(() => import("./pages/RedeemAccessCode"));
const MyPayments = lazy(() => import("./pages/MyPayments"));
const Team = lazy(() => import("./pages/Team"));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const queryClient = new QueryClient();

const AppContent = () => {
  useCopyProtection();
  
  return (
    <>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/course/:id" element={<CourseDetail />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/courses-preview" element={<CoursesPreview />} />
            <Route path="/community" element={<Community />} />
            <Route path="/my-certificates" element={<MyCertificates />} />
            <Route path="/redeem-access/:courseId" element={<RedeemAccessCode />} />
            <Route path="/my-payments" element={<MyPayments />} />
            <Route path="/team" element={<Team />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
