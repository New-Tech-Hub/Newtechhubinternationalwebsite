import { useEffect, useRef, useState } from "react";

/**
 * Thin gradient reading-progress bar pinned to the bottom edge of the
 * sticky navigation. Updates on rAF-throttled scroll events only.
 */
const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  const frame = useRef(0);

  useEffect(() => {
    const update = () => {
      frame.current = 0;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 0);
    };
    const onScroll = () => {
      if (!frame.current) frame.current = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-transparent pointer-events-none" aria-hidden="true">
      <div
        className="h-full bg-gradient-to-r from-accent to-[hsl(5,85%,58%)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ScrollProgress;
