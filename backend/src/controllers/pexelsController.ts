import { Request, Response, NextFunction } from "express";
import { pexelsService, PexelsVideo } from "../services/pexelsService";
import { AppError } from "../middleware/errorHandler";

export interface FormattedVideo {
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

function formatVideo(video: PexelsVideo): FormattedVideo {
  const best = pexelsService.pickBestFile(video.video_files);
  const thumbnail = pexelsService.pickThumbnail(video);
  const creatorName = video.user?.name || "Unknown";
  const creatorHandle = `@${creatorName.replace(/\s+/g, "")}`;

  return {
    id: `pexels-${video.id}`,
    title: `Pexels — ${creatorName}`,
    description: `Free stock video from Pexels. Duration: ${video.duration}s.`,
    creator: creatorHandle,
    creatorUrl: video.user?.url || "",
    videoUrl: best?.link || "",
    thumbnail,
    duration: video.duration || 0,
    source: "pexels",
    attribution: `Video by ${creatorName} on Pexels`,
  };
}

export async function searchVideos(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const query = (req.query.query as string).trim();
    const page = parseInt((req.query.page as string) || "1", 10);
    const perPage = parseInt((req.query.per_page as string) || "15", 10);

    if (!query) {
      throw new AppError("'query' is required.", 400);
    }

    const result = await pexelsService.search(query, page, perPage);

    const videos: FormattedVideo[] = result.videos
      .filter((v) => pexelsService.pickBestFile(v.video_files))
      .map(formatVideo);

    const hasNext =
      result.total_results > 0 &&
      result.page * result.per_page < result.total_results;

    res.json({
      success: true,
      page: result.page,
      per_page: result.per_page,
      total_results: result.total_results,
      count: videos.length,
      videos,
      next_page: hasNext
        ? `/pexels/search?query=${encodeURIComponent(query)}&page=${result.page + 1}&per_page=${result.per_page}`
        : null,
      has_next: hasNext,
    });
  } catch (err) {
    next(err);
  }
}
