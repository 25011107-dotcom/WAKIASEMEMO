import path from "node:path";
import express from "express";
import { memoRoutes } from "./routes/memoRoutes";
import { errorHandler } from "./middlewares/errorHandler";

export const app = express();

// リクエストボディは 1MB まで（N-02）
app.use(express.json({ limit: "1mb" }));
// SPA の静的ファイル（public/）も同じ Express から配信する
const publicDir = path.join(import.meta.dirname, "../public");
app.use(express.static(publicDir));

app.use("/api/memos", memoRoutes);

// 画面の URL（/memos/3 など）で直接開いたり再読み込みしたりしても、SPA の index.html を返す
// /api と、拡張子の付いたファイル（.js や .css）は対象外
app.use((req, res, next) => {
  if (req.method !== "GET" || req.path.startsWith("/api/") || path.extname(req.path)) {
    next();
    return;
  }
  res.sendFile(path.join(publicDir, "index.html"));
});

app.use(errorHandler);
