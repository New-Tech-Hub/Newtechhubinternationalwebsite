interface VideoPlayerProps {
  videoUrl: string;
  title: string;
}

export const VideoPlayer = ({ videoUrl, title }: VideoPlayerProps) => {
  // Extract video ID and add parameters to disable share button
  const getSecureVideoUrl = (url: string) => {
    try {
      // Handle YouTube URLs
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const videoId = url.includes('embed') 
          ? url.split('embed/')[1]?.split('?')[0]
          : url.includes('youtu.be')
          ? url.split('youtu.be/')[1]?.split('?')[0]
          : url.split('v=')[1]?.split('&')[0];
        
        if (videoId) {
          // Disable controls that allow sharing and external viewing
          return `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0&fs=0&controls=1`;
        }
      }
      return url;
    } catch (error) {
      return url;
    }
  };

  return (
    <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted">
      <iframe
        width="100%"
        height="100%"
        src={getSecureVideoUrl(videoUrl)}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        className="w-full h-full"
        loading="lazy"
      />
      {/* Overlay to prevent right-click */}
      <div 
        className="absolute inset-0 pointer-events-none"
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  );
};
