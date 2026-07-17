import { PexelsVideo, PexelsSearchResponse } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function fetchPexelsVideos(
  query: string,
  page = 1,
  perPage = 15
): Promise<PexelsSearchResponse> {
  const params = new URLSearchParams({
    query,
    page: String(page),
    per_page: String(perPage),
  });
  const res = await fetch(`${API_BASE}/pexels/search?${params.toString()}`);
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to fetch videos from Pexels");
  }
  return res.json();
}

export function pexelsToVideo(p: PexelsVideo) {
  const seed = Number(p.id.replace("pexels-", "")) || 1;
  const rand = (min: number, max: number) =>
    min + (Math.abs(Math.sin(seed * 12.9898) * 43758.5453) % 1) * (max - min);
  const views = Math.floor(rand(1200, 980000));
  const likes = Math.floor(views * rand(0.02, 0.12));
  const shares = Math.floor(likes * rand(0.05, 0.3));
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    creator: p.creator,
    creatorUrl: p.creatorUrl,
    duration: p.duration,
    videoUrl: p.videoUrl,
    thumbnail: p.thumbnail,
    likes,
    shares,
    views,
    createdAt: new Date().toISOString(),
    comments: [],
    source: "pexels" as const,
    attribution: p.attribution,
  };
}

export { API_BASE };
