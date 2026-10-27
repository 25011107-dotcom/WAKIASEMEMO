import type { Server } from "node:http";
import { WebSocket, WebSocketServer } from "ws";
import type { Memo } from "../generated/prisma/client";

// WebSocket で配信するイベント（仕様書「WebSocket /ws」）
export type MemoEvent =
  | { type: "created" | "updated"; memo: Memo; originId: string }
  | { type: "deleted"; id: number; originId: string };

let wss: WebSocketServer | undefined;

export function setupRealtime(server: Server) {
  wss = new WebSocketServer({ server, path: "/ws" });

  wss.on("connection", (ws) => {
    ws.on("error", console.error);
  });

  // TODO(N-03): 30秒ごとに ping を送り、pong が返ってこない接続を terminate() する
}

// 接続中の全クライアントへイベントを送る（ブロードキャスト）
export function broadcast(event: MemoEvent) {
  if (!wss) {
    return;
  }

  const data = JSON.stringify(event);
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  }
}
