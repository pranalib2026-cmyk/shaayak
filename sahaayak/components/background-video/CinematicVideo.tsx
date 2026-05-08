'use client';

import React, { useEffect, useRef, useState } from 'react';

interface CinematicVideoProps {
  src: string;
}

const CinematicVideo: React.FC<CinematicVideoProps> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [opacity, setOpacity] = useState(0);
  const hasFadedIn = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let frameId: number;

    const checkLoop = () => {
      if (video.duration && !video.paused) {
        const currentTime = video.currentTime;

        if (!hasFadedIn.current) {
          if (currentTime < 0.5) {
            setOpacity(currentTime / 0.5);
          } else {
            setOpacity(1);
            hasFadedIn.current = true;
          }
        } else {
          setOpacity(1);
        }
      }
      frameId = requestAnimationFrame(checkLoop);
    };

    const handlePlay = () => {
      frameId = requestAnimationFrame(checkLoop);
    };

    video.addEventListener('play', handlePlay);
    video.play().catch(e => console.warn("Initial play failed:", e));

    return () => {
      video.removeEventListener('play', handlePlay);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        loop
        className="w-full h-full object-cover"
        style={{ opacity }}
      />
      {/* Cinematic Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 pointer-events-none" />
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />
    </div>
  );
};

export default CinematicVideo;
