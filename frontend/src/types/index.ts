export type SortFilter = "trending" | "recent" | "popular";

export type VideoSource = "local" | "pexels";

export interface Video {
  id: string;
  title: string;
  description: string;
  creator: string;
  creatorUrl?: string;
  duration: number;
  videoUrl: string;
  thumbnail: string;
  checksum?: string;
  likes: number;
  shares: number;
  views: number;
  createdAt: string;
  comments: Comment[];
  source?: VideoSource;
  attribution?: string;
}

export interface PexelsVideo {
  id: string;
  title: string;
  description: string;
  creator: string;
  creatorUrl: string;
  videoUrl: string;
  thumbnail: string;
  duration: number;
  source: "pexels";
  attribution: string;
}

export interface PexelsSearchResponse {
  success: boolean;
  page: number;
  per_page: number;
  total_results: number;
  count: number;
  videos: PexelsVideo[];
  next_page: string | null;
}

export interface Comment {
  id: string;
  username: string;
  text: string;
  createdAt: string;
}
