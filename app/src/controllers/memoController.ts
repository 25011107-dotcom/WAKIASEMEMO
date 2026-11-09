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
  // TODO: 未削除のメモを1件取得して 200 で返す
  //       なければ throw new HttpError(404, "見つかりません")
  throw new HttpError(501, "未実装です");
}

// POST /api/memos（F-02）
export async function create(req: Request, res: Response) {
  // TODO: toMemoInput(req.body) の値で prisma.memo.create() する
  // TODO(F-08): broadcast({ type: "created", memo, originId: originIdOf(req) }) で配信する
  // TODO: res.status(201).json(memo) で返す
  throw new HttpError(501, "未実装です");
}

// PUT /api/memos/:id（F-03）
export async function update(req: Request, res: Response) {
  const id = parseId(req.params.id);
  // TODO: 未削除のメモを toMemoInput(req.body) の値で上書きする
  //       対象がない・削除済みなら throw new HttpError(404, "見つかりません")
  // TODO(F-08): "updated" イベントを配信して、200 で更新後のメモを返す
  throw new HttpError(501, "未実装です");
}

// DELETE /api/memos/:id（F-04）
export async function remove(req: Request, res: Response) {
  const id = parseId(req.params.id);
  // TODO: isDeleted を true にする（物理削除はしない。N-01）
  //       対象がない・削除済みなら throw new HttpError(404, "見つかりません")
  // TODO(F-08): "deleted" イベント（{ type, id, originId }）を配信して、res.status(204).end() で返す
  throw new HttpError(501, "未実装です");
}
