import type { Server } from "bun";
import client from "./client.html";

export function startTestServer(): Server {
  return Bun.serve({
    port: 0,
    routes: {
      "/health": new Response("ok"),
      "/:caseName": client,
    },
  });
}
