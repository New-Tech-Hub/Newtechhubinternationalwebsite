import React, { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Academy from "./pages/Index";
import { useCopyProtection } from "./hooks/useCopyProtection";
import { usePageTracking } from "./hooks/usePageTracking";
import CookieConsent from "./components/CookieConsent";

import SecurityHeaders from "./components/SecurityHeaders";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy load route components for better performance
const Home = lazy(() => import("./pages/Home"));
const AcademyCatalog = lazy(() => import("./pages/Academy"));
const Auth = lazy(() => import("./pages/Auth"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));
const CourseDetail = lazy(() => import("./pages/CourseDetail"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const Community = lazy(() => import("./pages/Community"));
const MyCertificates = lazy(() => import("./pages/MyCertificates"));
const RedeemAccessCode = lazy(() => import("./pages/RedeemAccessCode"));
const MyPayments = lazy(() => import("./pages/MyPayments"));
const Team = lazy(() => import("./pages/Team"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const News = lazy(() => import("./pages/News"));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const queryClient = new QueryClient();

const LegacyCourseRedirect = () => {
  const { id } = useParams();
  return <Navigate to={id ? `/academy/course/${id}` : '/academy'} replace />;
};

const RouteTracker = () => {
  usePageTracking();
  return null;
};

const AppContent = () => {
  useCopyProtection();

  return (
    <>
      <SecurityHeaders />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <RouteTracker />
        <CookieConsent />
        <Suspense fallback={<LoadingSpinner />}>

          <Routes>
            <Route path="/" element={<Academy />} />
            <Route path="/academy" element={<AcademyCatalog />} />
            <Route path="/founder" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/news" element={<News />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/academy/course/:id" element={<CourseDetail />} />
            <Route path="/course/:id" element={<LegacyCourseRedirect />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/courses-preview" element={<Navigate to="/academy" replace />} />
            <Route path="/community" element={<Community />} />
            <Route path="/my-certificates" element={<MyCertificates />} />
            <Route path="/redeem-access/:courseId" element={<RedeemAccessCode />} />
            <Route path="/my-payments" element={<MyPayments />} />
            <Route path="/team" element={<Team />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
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
