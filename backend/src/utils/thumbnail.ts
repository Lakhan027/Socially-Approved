import ffmpeg from "fluent-ffmpeg";
import path from "path";
import crypto from "crypto";
import fs from "fs";
import { promisify } from "util";

const pipeline = promisify(require("stream").pipeline);

/**
 * Extract a thumbnail frame from a video file.
 * Requires ffmpeg installed on the server.
 *
 * @param videoPath - Local path to the uploaded video
 * @param outputDir - Directory to write the thumbnail
 * @param atSeconds - Timestamp to grab the frame (default 2s)
 * @returns The thumbnail filename
 */
export function generateThumbnail(
  videoPath: string,
  outputDir: string,
  atSeconds: number = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const filename = `${crypto.randomUUID()}.jpg`;
    ffmpeg(videoPath)
      .on("end", () => resolve(filename))
      .on("error", (err: Error) => reject(err))
      .screenshots({
        timestamps: [atSeconds],
        filename,
        folder: outputDir,
        size: "480x854",
      });
  });
}

/**
 * Compute SHA-256 checksum for duplicate-video detection.
 */
export function fileChecksum(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha256");
    const stream = fs.createReadStream(filePath);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("end", () => resolve(hash.digest("hex")));
    stream.on("error", reject);
  });
}
