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

const RedeemAccessCode = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please sign in to redeem access code');
      navigate('/auth');
      return;
    }

    if (!courseId) {
      toast.error('Invalid course');
      return;
    }

    setLoading(true);

    try {
      // Verify the access code
      const { data: codeData, error: codeError } = await supabase
        .from('course_access_codes')
        .select('*')
        .eq('access_code', accessCode.trim().toUpperCase())
        .eq('course_id', courseId)
        .eq('is_active', true)
        .single();

      if (codeError || !codeData) {
        toast.error('Invalid or expired access code');
        setLoading(false);
        return;
      }

      // Check if code has reached max uses
      if (codeData.max_uses && codeData.current_uses >= codeData.max_uses) {
        toast.error('This access code has reached its maximum usage limit');
        setLoading(false);
        return;
      }

      // Check if code has expired
      if (codeData.expires_at && new Date(codeData.expires_at) < new Date()) {
        toast.error('This access code has expired');
        setLoading(false);
        return;
      }

      // Check if user already has access
      const { data: existingAccess } = await supabase
        .from('user_course_access')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single();

      if (existingAccess) {
        toast.info('You already have access to this course');
        navigate(`/course/${courseId}`);
        return;
      }

      // Grant access to user
      const { error: accessError } = await supabase
        .from('user_course_access')
        .insert({
          user_id: user.id,
          course_id: courseId,
          access_code_id: codeData.id,
        });

      if (accessError) throw accessError;

      // Update code usage count
      await supabase
        .from('course_access_codes')
        .update({ current_uses: codeData.current_uses + 1 })
        .eq('id', codeData.id);

      toast.success('Access code redeemed successfully! You now have access to the course.');
      navigate(`/course/${courseId}`);
    } catch (error: any) {
      console.error('Error redeeming access code:', error);
      toast.error(error.message || 'Failed to redeem access code');
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
