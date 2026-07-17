"use client";

import { memo, useState } from "react";
import { Video } from "@/types";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

interface VideoCardProps {
  video: Video;
  onClick: () => void;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

function VideoCardInner({ video, onClick }: VideoCardProps) {
  const { ref, isVisible } = useIntersectionObserver({ rootMargin: "200px", once: true });
  const [imgError, setImgError] = useState(false);

  return (
    <div
      ref={ref}
      className="group relative w-[180px] sm:w-[200px] md:w-[220px] lg:w-[240px] aspect-[9/16] rounded-2xl overflow-hidden bg-zinc-900 cursor-pointer snap-center shrink-0 select-none
        ring-1 ring-white/5 hover:ring-blue-500/40 transition-all duration-300
        hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]
        hover:scale-[1.02] hover:-translate-y-1"
      onClick={onClick}
    >
      {isVisible ? (
        <>
          {imgError ? (
            <div className="w-full h-full flex items-center justify-center bg-zinc-800">
              <svg className="w-8 h-8 text-zinc-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
              </svg>
            </div>
          ) : (
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
            <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-xl backdrop-blur-sm">
              <svg className="w-7 h-7 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>

          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="bg-black/70 backdrop-blur-sm text-white text-[11px] font-medium px-2 py-0.5 rounded-md">
              {formatDuration(video.duration)}
            </span>
            {video.source === "pexels" && (
              <span className="bg-black/70 backdrop-blur-sm text-blue-300 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-blue-400/30">
                Pexels
              </span>
            )}
          </div>

          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="bg-black/70 backdrop-blur-sm text-white text-[11px] px-2 py-0.5 rounded-md flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
              Sound
            </span>
          </div>

           <div className="absolute bottom-0 left-0 right-0 p-3 space-y-1.5">
            <h3 className="text-white text-sm font-semibold leading-tight truncate drop-shadow-sm">
              {video.title}
            </h3>
            {video.creatorUrl ? (
              <a
                href={video.creatorUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-zinc-300 text-xs truncate drop-shadow-sm hover:text-blue-300 hover:underline transition-colors"
              >
                {video.creator}
              </a>
            ) : (
              <p className="text-zinc-300 text-xs truncate drop-shadow-sm">{video.creator}</p>
            )}
             <div className="flex items-center gap-3 text-[11px] text-zinc-400">
               <span className="flex items-center gap-1" title="Likes">
                 <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                 </svg>
                 {formatCount(video.likes)}
               </span>
               <span className="flex items-center gap-1" title="Comments">
                 <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                 </svg>
                 {formatCount(video.comments.length)}
               </span>
               <span className="flex items-center gap-1" title="Shares">
                 <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                 </svg>
                 {formatCount(video.shares)}
               </span>
               <span className="flex items-center gap-1" title="Views">
                 <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                   <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                 </svg>
                 {formatCount(video.views)}
               </span>
             </div>
          </div>
        </>
      ) : (
        <div className="w-full h-full bg-zinc-800 animate-pulse">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-zinc-600 border-t-zinc-400 rounded-full animate-spin" />
          </div>
        </div>
      )}
    </div>
  );
}

const VideoCard = memo(VideoCardInner);
export default VideoCard;
