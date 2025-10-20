import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { Analytics } from "@/lib/analytics";
import UpsellOffer from "@/components/UpsellOffer";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [courseId, setCourseId] = useState("");
  const [showUpsell, setShowUpsell] = useState(true);

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    const reference = searchParams.get('reference');
    
    if (!reference) {
      setError('Invalid payment reference');
      setVerifying(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { reference },
      });

      if (error) throw error;

      setSuccess(true);
      setCourseId(data.courseId);
      
      // Track successful payment
      Analytics.paymentCompleted(data.courseId, data.amount || 0, reference);
      Analytics.courseAccessGranted(data.courseId);
      
      // Redirect to auth after 10 seconds (time to see upsell)
      setTimeout(() => {
        navigate('/auth');
      }, 10000);
    } catch (error: any) {
      console.error('Payment verification error:', error);
      setError(error.message || 'Failed to verify payment');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        <Card className="p-8 text-center">
          {verifying ? (
            <>
              <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Verifying Payment...</h2>
              <p className="text-muted-foreground">Please wait while we confirm your enrollment</p>
            </>
          ) : success ? (
            <>
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Payment Successful! 🎉</h2>
              <p className="text-muted-foreground mb-6">
                You have been successfully enrolled in the course. Check your email for login credentials.
              </p>
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-sm mb-2">What happens next?</h3>
                <ul className="text-sm text-muted-foreground space-y-1 text-left">
                  <li>✓ You'll receive a confirmation email with login details</li>
                  <li>✓ Access all course materials immediately</li>
                  <li>✓ Join our exclusive community of learners</li>
                  <li>✓ Start learning at your own pace</li>
                </ul>
              </div>
              <Button onClick={() => navigate('/auth')} className="w-full" size="lg">
                Go to Dashboard
              </Button>
              <p className="text-xs text-muted-foreground mt-3">
                Redirecting automatically in 10 seconds...
              </p>
            </>
          ) : (
            <>
              <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Payment Verification Failed</h2>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button onClick={() => navigate('/')} variant="outline" className="w-full">
                Return Home
              </Button>
            </>
          )}
        </Card>

        {/* Upsell Offer - Only show on successful payment */}
        {success && showUpsell && courseId && (
          <UpsellOffer 
            currentCourseId={courseId} 
            onDismiss={() => setShowUpsell(false)}
          />
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
