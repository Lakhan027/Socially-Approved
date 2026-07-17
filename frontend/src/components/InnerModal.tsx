"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { Video } from "@/types";
import VideoPlayer from "./VideoPlayer";
import SocialActions from "./SocialActions";

interface InnerModalProps {
  videos: Video[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export default function InnerModal({
  videos,
  currentIndex,
  onClose,
  onNavigate,
}: InnerModalProps) {
  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);
  const [slideIn, setSlideIn] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const prevBtnRef = useRef<HTMLButtonElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);
  const currentVideo = videos[currentIndex];

  const goNext = useCallback(() => {
    if (currentIndex < videos.length - 1) {
      setSlideIn(false);
      setTimeout(() => { onNavigate(currentIndex + 1); setSlideIn(true); }, 200);
    }
  }, [currentIndex, videos.length, onNavigate]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setSlideIn(false);
      setTimeout(() => { onNavigate(currentIndex - 1); setSlideIn(true); }, 200);
    }
  }, [currentIndex, onNavigate]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    closeBtnRef.current?.focus();
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowLeft") { goPrev(); return; }
      if (e.key === "ArrowRight") { goNext(); return; }
      if (e.key === "Tab") {
        const modal = modalRef.current;
        if (!modal) return;
        const focusable = Array.from(
          modal.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => !el.hasAttribute("disabled"));
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, goPrev, goNext]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchEnd.current = null;
    touchStart.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (touchStart.current === null || touchEnd.current === null) return;
    const distance = touchStart.current - touchEnd.current;
    if (distance > 60) goNext();
    if (distance < -60) goPrev();
  };

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 bg-black/95 animate-in fade-in duration-200 flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Video player"
    >
      <div className="absolute inset-0 backdrop-blur-sm" onClick={onClose} />

      <button
        ref={closeBtnRef}
        onClick={onClose}
        className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-black/70 transition-all border border-white/10"
        aria-label="Close"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="flex-1 flex items-center justify-center px-2 sm:px-4 relative min-h-0">
        <button
          ref={prevBtnRef}
          onClick={goPrev}
          disabled={currentIndex === 0}
          className="hidden sm:flex absolute left-2 md:left-4 z-20 items-center justify-center w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white/60 hover:text-white hover:bg-black/60 disabled:opacity-0 disabled:cursor-default transition-all border border-white/5"
          aria-label="Previous video"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex flex-col items-center w-full max-w-[420px] mx-auto">
          <div
            className="relative w-full"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className={`relative w-full max-h-[72vh] sm:max-h-[78vh] rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 transition-all duration-300 ${
                slideIn ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
              style={{ aspectRatio: "9 / 16" }}
            >
              <VideoPlayer src={currentVideo.videoUrl} thumbnail={currentVideo.thumbnail} isActive={true} />

              {currentVideo.creatorUrl && (
                <a
                  href={currentVideo.creatorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-2 bottom-16 z-10 flex flex-col items-center gap-0.5 text-white/80 hover:text-white transition-colors group"
                  aria-label="Open on Pexels"
                >
                  {/* <div className="p-1.5 rounded-full bg-black/30 backdrop-blur-sm">
                    <svg className="w-6 h-6 drop-shadow-lg" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-semibold tabular-nums drop-shadow-lg">Pexels</span> */}
                </a>
              )}
            </div>
          </div>

          <div className="w-full mt-3 px-1">
            <h3 className="text-white text-sm sm:text-base font-bold leading-tight">{currentVideo.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-blue-400 text-xs sm:text-sm font-medium">{currentVideo.creator}</span>
              {currentVideo.creatorUrl && (
                <>
                  <span className="text-zinc-600 text-xs">•</span>
                  <a
                    href={currentVideo.creatorUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-500 text-xs hover:text-zinc-300 underline underline-offset-2 transition-colors"
                  >
                    {/* View on Pexels */}
                  </a>
                </>
              )}
            </div>
            <div className="flex items-center gap-4 mt-2 text-[11px] text-zinc-400">
              <SocialActions
                key={currentVideo.id}
                videoId={currentVideo.id}
                initialLikes={currentVideo.likes}
                initialShares={currentVideo.shares}
                variant="modal"
              />
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {formatCount(currentVideo.views)} views
              </span>
            </div>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1.5 line-clamp-2 leading-relaxed">{currentVideo.attribution}</p>
          </div>
        </div>

        <button
          ref={nextBtnRef}
          onClick={goNext}
          disabled={currentIndex === videos.length - 1}
          className="hidden sm:flex absolute right-2 md:right-4 z-20 items-center justify-center w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white/60 hover:text-white hover:bg-black/60 disabled:opacity-0 disabled:cursor-default transition-all border border-white/5"
          aria-label="Next video"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="shrink-0 flex justify-center gap-1.5 py-3">
        {videos.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setSlideIn(false);
              setTimeout(() => { onNavigate(i); setSlideIn(true); }, 200);
            }}
            className={`rounded-full transition-all duration-300 ${
              i === currentIndex ? "w-6 h-1.5 bg-white" : "w-1.5 h-1.5 bg-zinc-600 hover:bg-zinc-500"
            }`}
            aria-label={`Go to video ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
