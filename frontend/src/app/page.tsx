"use client";

import { useState, useEffect, useCallback } from "react";
import { Video } from "@/types";
import { fetchPexelsVideos, pexelsToVideo } from "@/lib/api";
import OuterCarousel from "@/components/OuterCarousel";
import LoadingSpinner from "@/components/LoadingSpinner";

const DEFAULT_QUERY = "nature";

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search] = useState(DEFAULT_QUERY);
  const [searching, setSearching] = useState(false);
  const [searchPage, setSearchPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const runSearch = useCallback(
    async (query: string, page: number, append = false) => {
      setSearching(true);
      setError(null);
      try {
        const result = await fetchPexelsVideos(query, page, 40);
        const mapped = result.videos.map(pexelsToVideo);
        setVideos((prev) =>
          append
            ? [...prev, ...mapped.filter((v) => !prev.some((p) => p.id === v.id))]
            : mapped
        );
        setHasMore(Boolean(result.next_page));
        setSearchPage(page);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load Pexels videos. Make sure the backend is running on port 3001 with a valid PEXELS_API_KEY."
        );
      }
      setSearching(false);
      setLoading(false);
    },
    []
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    runSearch(DEFAULT_QUERY, 1);
  }, [runSearch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md px-6 py-12 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-300 font-medium mb-2">Connection Error</p>
          <p className="text-zinc-400 text-sm mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-white/10 hover:bg-white/15 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-all border border-white/10"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <header className="border-b border-zinc-800/60 backdrop-blur-xl bg-black/50 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <h1 className="text-lg font-bold text-white tracking-tight">Socially Approved</h1>
          </div>
          {/* <span className="text-[11px] text-zinc-500 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Powered by Pexels
          </span> */}
        </div>
      </header>

      <main className="pt-6 pb-12">
        <OuterCarousel videos={videos} />
        {hasMore && (
          <div className="flex justify-center mt-6">
            {/* <button
              onClick={handleLoadMore}
              disabled={searching}
              className="bg-zinc-800/80 hover:bg-zinc-700 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-all border border-zinc-700/50 disabled:opacity-50"
            >
              {searching ? "Loading..." : "Load More"}
            </button> */}
          </div>
        )}
      </main>

      <footer className="border-t border-zinc-800/60 py-6">
        <p className="text-center text-zinc-600 text-xs">
          Socially Approved &copy; 2026 &mdash; Videos from Pexels, used for browsing per Pexels Terms.
        </p>
      </footer>
    </div>
  );
}
