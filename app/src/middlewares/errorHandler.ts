import type { ErrorRequestHandler } from "express";
import { HttpError } from "../lib/HttpError";

// 400・404 は HttpError のステータスで、それ以外はすべて 500 で返す（仕様書「エラーレスポンス」）
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ message: err.message });
    return;
  }

  console.error(err);
  res.status(500).json({ message: "サーバーエラーが発生しました" });
};
