"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface SocialActionsProps {
  videoId: string;
  initialLikes: number;
  initialShares: number;
  variant?: "card" | "modal";
}

const SHARE_TARGETS = [
  {
    key: "copy",
    label: "Copy Link",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16a3 3 0 11-2.83-4.24L8.46 9.3a3 3 0 014.24 0 3 3 0 010 4.24l-2.29 2.3A3 3 0 018 16zm8-12a3 3 0 11-2.83 4.24L15.54 10.7a3 3 0 014.24 0 3 3 0 010-4.24l-2.29-2.3A3 3 0 0116 4z" />
    ),
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    icon: (
      <path
        fill="currentColor"
        stroke="none"
        d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 004.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm5.8 14.13c-.24.68-1.42 1.3-1.95 1.34-.5.04-.98.23-3.32-.69-2.74-1.11-4.48-3.97-4.61-4.16-.13-.19-1.07-1.42-1.07-2.72 0-1.3.68-1.94.93-2.2.24-.27.53-.33.7-.33l.5.01c.16.01.38-.06.59.45.22.54.74 1.86.8 2 .06.14.1.3.02.48-.08.18-.12.29-.24.45-.12.16-.25.35-.36.47-.12.14-.24.29-.1.56.13.27.61 1.02 1.3 1.65.9.81 1.66 1.06 1.93 1.18.27.12.43.1.59-.06.16-.16.68-.79.86-1.06.18-.27.36-.22.61-.13.25.08 1.6.76 1.88.9.27.14.45.2.52.31.07.11.07.62-.17 1.3z"
      />
    ),
  },
  {
    key: "facebook",
    label: "Facebook",
    icon: (
      <path
        fill="currentColor"
        stroke="none"
        d="M14 9h3V6h-3c-1.66 0-3 1.34-3 3v2H8v3h3v6h3v-6h3l1-3h-4v-2c0-.55.45-1 1-1z"
      />
    ),
  },
  {
    key: "twitter",
    label: "X",
    icon: (
      <path
        fill="currentColor"
        stroke="none"
        d="M17.53 3H20l-5.6 6.4L21 21h-6.2l-4.8-6.3L4.7 21H2.2l6-6.9L2 3h6.4l4.4 5.8L17.53 3zm-2.2 16h1.7L7.8 4.8H6L15.33 19z"
      />
    ),
  },
  {
    key: "telegram",
    label: "Telegram",
    icon: (
      <path
        fill="currentColor"
        stroke="none"
        d="M21.9 4.3l-3.3 15.4c-.25 1.1-.9 1.37-1.83.85l-5.05-3.72-2.44 2.35c-.27.27-.5.5-1 .5l.36-5.06L17.9 5.9c.37-.33-.08-.51-.57-.18L6.1 13.1.83 11.3c-1.09-.34-1.11-1.09.23-1.61L20.5 2.9c.92-.34 1.72.2 1.4 1.4z"
      />
    ),
  },
];

export default function SocialActions({
  videoId,
  initialLikes,
  initialShares,
  variant = "card",
}: SocialActionsProps) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [shares, setShares] = useState(initialShares);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!shareOpen) return;
    const onClick = (e: MouseEvent) => {
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
        setShareOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [shareOpen]);

  const toggleLike = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setLiked((prev) => {
        const next = !prev;
        setLikes((count) => count + (next ? 1 : -1));
        return next;
      });
    },
    []
  );

  const handleShare = useCallback(
    (e: React.MouseEvent, key: string) => {
      e.stopPropagation();
      const url =
        typeof window !== "undefined"
          ? `${window.location.origin}/?v=${encodeURIComponent(videoId)}`
          : `https://pexels.com/video/${videoId}`;
      if (key === "copy") {
        navigator.clipboard?.writeText(url).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        });
        return;
      }
      const text = "Check out this video!";
      const map: Record<string, string> = {
        whatsapp: `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
        telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      };
      window.open(map[key], "_blank", "noopener,noreferrer");
      setShares((s) => s + 1);
      setShareOpen(false);
    },
    [videoId]
  );

  const formatCount = (n: number) =>
    n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `${(n / 1_000).toFixed(1)}K` : `${n}`;

  const isModal = variant === "modal";

  return (
    <div
      className={`flex items-center gap-4 ${isModal ? "text-zinc-300" : "text-zinc-400"}`}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={toggleLike}
        aria-pressed={liked}
        aria-label={liked ? "Unlike" : "Like"}
        className={`flex items-center gap-1.5 transition-colors ${
          liked ? "text-red-500" : "hover:text-red-400"
        }`}
      >
        <svg
          className={`${isModal ? "w-4 h-4" : "w-3 h-3"}`}
          fill={liked ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <span className={isModal ? "text-xs" : "text-[11px]"}>{formatCount(likes)}</span>
      </button>

      <div className="relative" ref={shareRef}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShareOpen((o) => !o);
          }}
          aria-label="Share"
          aria-expanded={shareOpen}
          className={`flex items-center gap-1.5 transition-colors hover:text-blue-400 ${
            shareOpen ? "text-blue-400" : ""
          }`}
        >
          <svg
            className={`${isModal ? "w-4 h-4" : "w-3 h-3"}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          <span className={isModal ? "text-xs" : "text-[11px]"}>{formatCount(shares)}</span>
        </button>

        {shareOpen && (
          <div
            className={`absolute z-40 bottom-full mb-2 left-0 ${
              isModal ? "w-44" : "w-36"
            } rounded-xl bg-zinc-900 border border-zinc-700 shadow-2xl p-1.5`}
          >
            {SHARE_TARGETS.map((t) => (
              <button
                key={t.key}
                onClick={(e) => handleShare(e, t.key)}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  {t.icon}
                </svg>
                <span className="text-sm">{t.key === "copy" && copied ? "Copied!" : t.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
