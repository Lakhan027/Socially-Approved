import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: number;
  PEXELS_API_KEY: string;
  PEXELS_BASE_URL: string;
  CLIENT_ORIGIN: string;
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX: number;
}

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env: EnvConfig = {
  PORT: parseInt(process.env.PORT || "3001", 10),
  PEXELS_API_KEY: required("PEXELS_API_KEY", process.env.PEXELS_API_KEY),
  PEXELS_BASE_URL:
    process.env.PEXELS_BASE_URL || "https://api.pexels.com/videos/search",
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  RATE_LIMIT_WINDOW_MS: parseInt(
    process.env.RATE_LIMIT_WINDOW_MS || "60000",
    10
  ),
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || "30", 10),
};
