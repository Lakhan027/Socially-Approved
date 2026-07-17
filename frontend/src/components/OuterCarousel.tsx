"use client";

import { useState, useCallback, useRef, useEffect, lazy, Suspense } from "react";
import { Video } from "@/types";
import VideoCard from "./VideoCard";

const InnerModal = lazy(() => import("./InnerModal"));

interface OuterCarouselProps {
  videos: Video[];
}

export default function OuterCarousel({ videos }: OuterCarouselProps) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [activePage, setActivePage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const dragStart = useRef(0);
  const scrollStart = useRef(0);
  const touchStart = useRef(0);
  const touchScrollStart = useRef(0);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
    const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-card]"));
    if (cards.length === 0) return;
    const step = cards[0].offsetWidth + 16;
    if (step <= 0) return;
    const cardsPerView = Math.max(1, Math.round(el.clientWidth / step));
    const lastVisible = Math.min(cards.length - 1, Math.floor(el.scrollLeft / step) + cardsPerView - 1);
    const page = Math.floor(cards[lastVisible].offsetLeft / (step * cardsPerView));
    const pages = Math.max(1, Math.ceil(cards.length / cardsPerView));
    setActivePage(Math.min(page, pages - 1));
    setTotalPages(pages);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    updateScrollState();
    return () => el.removeEventListener("scroll", updateScrollState);
  }, [updateScrollState, videos.length]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    touchStart.current = e.touches[0].clientX;
    touchScrollStart.current = el.scrollLeft;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    const dx = e.touches[0].clientX - touchStart.current;
    el.scrollLeft = touchScrollStart.current - dx;
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") { el.scrollBy({ left: -300, behavior: "smooth" }); }
      if (e.key === "ArrowRight") { el.scrollBy({ left: 300, behavior: "smooth" }); }
    };
    el.addEventListener("keydown", handleKey);
    el.setAttribute("tabindex", "0");
    return () => el.removeEventListener("keydown", handleKey);
  }, []);

  const scrollToPage = useCallback((page: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-card]"));
    if (cards.length === 0) return;
    const step = cards[0].offsetWidth + 16;
    if (step <= 0) return;
    const cardsPerView = Math.max(1, Math.round(el.clientWidth / step));
    const targetIndex = Math.max(0, Math.min(cards.length - 1, page * cardsPerView));
    el.scrollTo({ left: cards[targetIndex].offsetLeft - 16, behavior: "smooth" });
  }, []);

  const scrollByPage = useCallback(
    (direction: "left" | "right") => {
      const next = direction === "right" ? activePage + 1 : activePage - 1;
      scrollToPage(next);
    },
    [activePage, scrollToPage]
  );

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = e.clientX;
    if (scrollRef.current) scrollStart.current = scrollRef.current.scrollLeft;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    const dx = e.clientX - dragStart.current;
    scrollRef.current.scrollLeft = scrollStart.current - dx;
  }, [isDragging]);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  const openModal = useCallback((video: Video, index: number) => {
    setSelectedVideo(video);
    setSelectedIndex(index);
  }, []);

  const closeModal = useCallback(() => setSelectedVideo(null), []);

  const goToVideo = useCallback((index: number) => {
    if (index < 0 || index >= videos.length) return;
    setSelectedVideo(videos[index]);
    setSelectedIndex(index);
  }, [videos]);

  return (
    <section className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Socially Approved</h2>
            <p className="text-zinc-500 text-xs sm:text-sm mt-0.5">Trending videos you&apos;ll love</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollByPage("left")}
              disabled={!canScrollLeft}
              className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-zinc-700/50"
              aria-label="Scroll left"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scrollByPage("right")}
              disabled={!canScrollRight}
              className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-zinc-700/50"
              aria-label="Scroll right"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        className="flex gap-4 overflow-x-auto px-4 sm:px-6 pb-4 snap-x snap-mandatory scrollbar-hide cursor-grab active:cursor-grabbing select-none outline-none"
        style={{ WebkitOverflowScrolling: "touch" }}
        role="listbox"
        aria-label="Video carousel"
      >
        {videos.map((video, index) => (
          <div data-card key={video.id} className="snap-start">
            <VideoCard video={video} onClick={() => openModal(video, index)} />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-1.5 mt-1" aria-hidden="true">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToPage(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === activePage ? "w-6 bg-white" : "w-1.5 bg-zinc-600 hover:bg-zinc-500"
            }`}
            aria-label={`Go to slide group ${i + 1}`}
          />
        ))}
      </div>

      {selectedVideo && (
        <Suspense fallback={null}>
          <InnerModal videos={videos} currentIndex={selectedIndex} onClose={closeModal} onNavigate={goToVideo} />
        </Suspense>
      )}

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}
