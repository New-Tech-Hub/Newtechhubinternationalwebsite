import { useState } from "react";
import { ChevronDown, ChevronUp, Info } from "lucide-react";

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
}

export const VideoPlayer = ({ videoUrl, title }: VideoPlayerProps) => {
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  // Extract video ID; use youtube-nocookie + params that suppress branding & "Watch on YouTube" overlay
  const getSecureVideoUrl = (url: string) => {
    try {
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const videoId = url.includes('embed')
          ? url.split('embed/')[1]?.split('?')[0]
          : url.includes('youtu.be')
          ? url.split('youtu.be/')[1]?.split('?')[0]
          : url.split('v=')[1]?.split('&')[0];

        if (videoId) {
          // nocookie domain + modestbranding hides the YouTube logo/share/watch-on-youtube link
          return `https://www.youtube-nocookie.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0&fs=0&controls=1&iv_load_policy=3&disablekb=1`;
        }
      }
      return url;
    } catch (error) {
      return url;
    }
  };

  return (
    <div className="space-y-3">
      {/* Collapsible Video Disclaimer */}
      <div className="bg-muted/50 border border-border rounded-lg overflow-hidden">
        <button
          onClick={() => setShowDisclaimer(!showDisclaimer)}
          className="w-full flex items-center justify-between p-3 text-xs text-muted-foreground hover:bg-muted/70 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            <span className="font-semibold text-foreground">Video Disclaimer</span>
          </div>
          {showDisclaimer ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {showDisclaimer && (
          <div className="px-3 pb-3 text-xs text-muted-foreground">
            <p className="leading-relaxed">
              The following video is embedded from YouTube and remains the intellectual property of its original creator. This course includes original instructional materials and selected embedded third-party videos used for illustrative and educational purposes only. No ownership is claimed over third-party content.
            </p>
          </div>
        )}
      </div>
      
      {/* Video Player */}
      <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted shadow-lg">
        <iframe
          width="100%"
          height="100%"
          src={getSecureVideoUrl(videoUrl)}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
          loading="lazy"
        />
        {/* Overlay to prevent right-click */}
        <div 
          className="absolute inset-0 pointer-events-none"
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>
    </div>
  );
};
