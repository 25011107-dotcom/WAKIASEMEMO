import { createServer } from "node:http";
import { app } from "./app";
import { setupRealtime } from "./realtime/broadcaster";

const port = Number(process.env.PORT ?? 3000);

// Express と WebSocket（/ws）で同じ HTTP サーバーを使う
const server = createServer(app);
setupRealtime(server);

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
