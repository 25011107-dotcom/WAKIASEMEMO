import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { HttpError } from "../lib/HttpError";
import { defaultTitle } from "../utils/defaultTitle";
import { broadcast } from "../realtime/broadcaster";

const TITLE_MAX_LENGTH = 100;
const CONTENT_MAX_LENGTH = 10000;

// :id が正の整数でなければ 400
function parseId(raw: string | string[] | undefined): number {
  if (typeof raw !== "string" || !/^[1-9]\d*$/.test(raw)) {
    throw new HttpError(400, "IDが不正です");
  }
  return Number(raw);
}

// POST・PUT のリクエストボディを、保存する値に整える
function toMemoInput(body: unknown): { title: string; content: string } {
  const { title, content } = (body ?? {}) as {
    title?: unknown;
    content?: unknown;
  };

  // F-09: 空なら「メモ(YYYY-MM-DD)」
  const memoTitle = defaultTitle(title);
  const memoContent = typeof content === "string" ? content : "";

  // N-02: DB と同じく絵文字も1文字と数える
  // 超えたら 500（T-API-05・06）
  if ([...memoTitle].length > TITLE_MAX_LENGTH) {
    throw new Error("タイトルが長すぎます");
  }
  if ([...memoContent].length > CONTENT_MAX_LENGTH) {
    throw new Error("本文が長すぎます");
  }

  return { title: memoTitle, content: memoContent };
}

// 変更を起こしたクライアントの X-Client-Id（イベントの originId になる）
function originIdOf(req: Request): string {
  return req.get("X-Client-Id") ?? "";
}

// GET /api/memos（F-01）
// お手本：Prisma で取得して res.json() で返す
export async function list(_req: Request, res: Response) {
  const memos = await prisma.memo.findMany({
    where: { isDeleted: false },
    orderBy: { updatedAt: "desc" },
  });
  res.json(memos);
}

// GET /api/memos/:id（F-01）
export async function show(req: Request, res: Response) {
  const id = parseId(req.params.id);
  const memo = await prisma.memo.findFirst({
    where: { id, isDeleted: false },
  });
  if (!memo) {
    throw new HttpError(404, "見つかりません");
  }
  res.json(memo);
}

// POST /api/memos（F-02）
export async function create(req: Request, res: Response) {
  const memo = await prisma.memo.create({ data: toMemoInput(req.body) });
  // F-08: 保存してから配信し、そのあと返す
  broadcast({ type: "created", memo, originId: originIdOf(req) });
  res.status(201).json(memo);
}

// PUT /api/memos/:id（F-03）
export async function update(req: Request, res: Response) {
  const id = parseId(req.params.id);
  const data = toMemoInput(req.body);
  const found = await prisma.memo.findFirst({
    where: { id, isDeleted: false },
  });
  if (!found) {
    throw new HttpError(404, "見つかりません");
  }

  const memo = await prisma.memo.update({ where: { id }, data });
  broadcast({ type: "updated", memo, originId: originIdOf(req) });
  res.json(memo);
}

// DELETE /api/memos/:id（F-04）
export async function remove(req: Request, res: Response) {
  const id = parseId(req.params.id);
  const found = await prisma.memo.findFirst({
    where: { id, isDeleted: false },
  });
  if (!found) {
    throw new HttpError(404, "見つかりません");
  }

  // N-01: 物理削除はしない
  await prisma.memo.update({ where: { id }, data: { isDeleted: true } });
  broadcast({ type: "deleted", id, originId: originIdOf(req) });
  res.status(204).end();
}
