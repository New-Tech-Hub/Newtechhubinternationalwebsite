import { Lock } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useNavigate } from 'react-router-dom';

interface LockedVideoPlayerProps {
  courseId: string;
  courseTitle: string;
  thumbnailUrl?: string;
  isLoggedIn: boolean;
}

export const LockedVideoPlayer = ({ 
  courseId, 
  courseTitle, 
  thumbnailUrl,
  isLoggedIn 
}: LockedVideoPlayerProps) => {
  const navigate = useNavigate();

  const handleUnlock = () => {
    if (!isLoggedIn) {
      navigate('/auth', { state: { returnTo: `/course/${courseId}` } });
    } else {
      navigate(`/course/${courseId}#enrollment`);
    }
  };

  return (
    <Card className="relative aspect-video w-full overflow-hidden bg-muted">
      {thumbnailUrl && (
        <img 
          src={thumbnailUrl} 
          alt={courseTitle}
          className="absolute inset-0 w-full h-full object-cover blur-sm opacity-50"
        />
      )}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-primary/10 p-6 rounded-full mb-4">
          <Lock className="h-12 w-12 text-primary" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Course Content Locked</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          {isLoggedIn 
            ? "Complete your payment and receive your access code from the admin to unlock this course."
            : "Please sign in and complete payment to access this course content."}
        </p>
        <Button 
          size="lg" 
          onClick={handleUnlock}
          className="bg-gradient-to-r from-[hsl(17,100%,60%)] to-[hsl(5,85%,58%)] hover:shadow-lg transition-all duration-300"
        >
          {isLoggedIn ? 'Complete Payment' : 'Sign In to Access'}
        </Button>
      </div>
    </Card>
  );
};
