import { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler";

function isString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateSearchQuery(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const { query, page, per_page } = req.query;

  if (!isString(query)) {
    next(new AppError("Query parameter 'query' is required.", 400));
    return;
  }

  if (query.length > 100) {
    next(new AppError("Query is too long (max 100 characters).", 400));
    return;
  }

  const pageNum = page ? parseInt(page as string, 10) : 1;
  const perPage = per_page ? parseInt(per_page as string, 10) : 15;

  if (Number.isNaN(pageNum) || pageNum < 1 || pageNum > 50) {
    next(new AppError("'page' must be a number between 1 and 50.", 400));
    return;
  }

  if (
    Number.isNaN(perPage) ||
    perPage < 1 ||
    perPage > 80
  ) {
    next(new AppError("'per_page' must be a number between 1 and 80.", 400));
    return;
  }

  next();
}
