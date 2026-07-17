import axios from "axios";
import { env } from "../config/env";
import { AppError } from "../middleware/errorHandler";

export interface PexelsVideoFile {
  id: number;
  quality: string;
  width: number;
  height: number;
  link: string;
  file_type?: string;
}

export interface PexelsVideoPicture {
  id: number;
  picture: string;
  nr: number;
}

export interface PexelsUser {
  id: number;
  name: string;
  url: string;
}

export interface PexelsVideo {
  id: number;
  url: string;
  duration: number;
  user: PexelsUser;
  image: string;
  video_files: PexelsVideoFile[];
  video_pictures: PexelsVideoPicture[];
}

export interface PexelsSearchResult {
  page: number;
  per_page: number;
  total_results: number;
  videos: PexelsVideo[];
  next_page?: string;
}

async function request(
  query: string,
  page: number,
  perPage: number
): Promise<PexelsSearchResult> {
  try {
    const response = await axios.get<PexelsSearchResult>(env.PEXELS_BASE_URL, {
      headers: {
        Authorization: env.PEXELS_API_KEY,
      },
      params: {
        query,
        page,
        per_page: perPage,
      },
      timeout: 10000,
    });
    return response.data;
  } catch (err: any) {
    if (err.response?.status === 401) {
      throw new AppError("Pexels API unauthorized — check PEXELS_API_KEY.", 502);
    }
    if (err.response?.status === 429) {
      throw new AppError("Pexels API rate limit exceeded.", 502);
    }
    throw new AppError(
      err.response?.data?.message || "Failed to fetch videos from Pexels.",
      502
    );
  }
}

function pickBestFile(files: PexelsVideoFile[]): PexelsVideoFile | null {
  if (!files || files.length === 0) return null;
  const hd = files.find((f) => f.quality === "hd" && f.width <= 1920);
  if (hd) return hd;
  const sd = files.find((f) => f.quality === "sd");
  if (sd) return sd;
  return (
    files.find((f) => f.file_type === "video/mp4") || files[0]
  );
}

function pickThumbnail(video: PexelsVideo): string {
  if (video.video_pictures?.length) return video.video_pictures[0].picture;
  return video.image || "";
}

export const pexelsService = {
  async search(
    query: string,
    page: number,
    perPage: number
  ): Promise<PexelsSearchResult> {
    const data = await request(query, page, perPage);

    const normalized: PexelsVideo[] = data.videos.map((video) => {
      const best = pickBestFile(video.video_files);
      return {
        ...video,
        video_files: best ? [best] : [],
        video_pictures: [{ id: 0, nr: 0, picture: pickThumbnail(video) }],
      };
    });

    return {
      page: data.page,
      per_page: data.per_page,
      total_results: data.total_results,
      videos: normalized,
      next_page: data.next_page,
    };
  },

  pickBestFile,
  pickThumbnail,
};
