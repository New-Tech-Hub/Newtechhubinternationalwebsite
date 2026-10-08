import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Lock } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { sanitizeInput, checkRateLimit } from '@/lib/security';

const RedeemAccessCode = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!checkRateLimit('redeem-code', 5, 60000)) {
      toast.error('Too many attempts. Please wait a minute.');
      return;
    }
    
    if (!user) {
      toast.error('Please sign in to redeem access code');
      navigate('/auth');
      return;
    }

    if (!courseId) {
      toast.error('Invalid course');
      return;
    }

    const cleanCode = sanitizeInput(accessCode, 50).toUpperCase();

    setLoading(true);

    try {
      const { error } = await supabase.rpc('redeem_course_access_code', {
        _course_id: courseId,
        _access_code: cleanCode,
      });
      if (error) throw error;

      toast.success('Access code redeemed successfully! You now have access to the course.');
      navigate(`/academy/course/${courseId}`);
    } catch (error: any) {
      console.error('Error redeeming access code:', error);
      toast.error('Unable to redeem this code. Check that it is valid for this course and tier.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-12 mt-20 flex items-center justify-center min-h-[70vh]">
        <Card className="w-full max-w-md p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Redeem Access Code</h1>
            <p className="text-muted-foreground text-center">
              Enter the access code provided by the admin to unlock your course
            </p>
          </div>

          <form onSubmit={handleRedeem} className="space-y-4">
            <div>
              <Label htmlFor="accessCode">Access Code</Label>
              <Input
                id="accessCode"
                type="text"
                required
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                placeholder="Enter your access code"
                className="uppercase"
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading || !accessCode.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Redeem Code'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an access code?{' '}
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() => navigate(`/course/${courseId}`)}
              >
                Complete payment first
              </Button>
            </p>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default RedeemAccessCode;
