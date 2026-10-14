"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { media } from "@/lib/media";

// Muted, looping background video.
// Tries your own file in /public/videos first, then the stock clip. If neither plays, the poster photo stays visible.
// Loads the smaller file on phones and pauses for visitors who prefer reduced motion.
export function HeroVideo({ className }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const [sources, setSources] = useState<string[] | null>(null);

  // Pick the source list once on the client (phones get the lighter files)
  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const v = media.heroVideo;
    setSources(mobile ? [v.localMobile, v.local, v.srcMobile] : [v.local, v.src]);
  }, []);

  useEffect(() => {
    const video = ref.current;
    if (!video || !sources) return;
    video.muted = true; // React does not reliably set the muted attribute, which autoplay requires
    video.load();
    if (reduce) video.pause();
    else video.play().catch(() => {});
  }, [sources, reduce]);

  return (
    <video
      ref={ref}
      className={className}
      poster={media.heroVideo.poster}
      autoPlay={!reduce}
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden
    >
      {sources?.map((src) => <source key={src} src={src} type="video/mp4" />)}
    </video>
  );
}
