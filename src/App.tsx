import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import CourseDetail from "./pages/CourseDetail";
import PaymentSuccess from "./pages/PaymentSuccess";
import CoursesPreview from "./pages/CoursesPreview";
import Community from "./pages/Community";
import MyCertificates from "./pages/MyCertificates";
import RedeemAccessCode from "./pages/RedeemAccessCode";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
