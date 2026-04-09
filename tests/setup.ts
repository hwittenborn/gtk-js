import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { Server } from "bun";
import { type Browser, chromium, firefox, type Page } from "playwright";
import { startTestServer } from "./server";

declare global {
  var __testBrowsers: Record<string, Browser>;
  var __testPages: Record<string, Page>;
  var __testServer: Server;
  var __nativeServerPort: number;
  var __nativeServerProcess: Bun.Subprocess;
}

function debugEnabled(): boolean {
  return Bun.env.GTK_JS_TEST_DEBUG != null;
}

function debugLog(message: string): void {
  if (debugEnabled()) {
    console.error(`[setup] ${message}`);
  }
}

async function waitForNativeReady(port: number): Promise<void> {
  const startedAt = Date.now();

  while (Date.now() - startedAt < 15000) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/ready`, {
        signal: AbortSignal.timeout(1000),
      });

      if (response.ok) {
        debugLog(`native server ready on ${port}`);
        return;
      }
    } catch {
      // Keep polling until the server is ready or times out.
    }

    await Bun.sleep(100);
  }

  throw new Error(`Native server on port ${port} did not become ready within 15s`);
}

async function waitForPortFile(path: string): Promise<number> {
  const startedAt = Date.now();

  while (Date.now() - startedAt < 15000) {
    try {
      const text = (await readFile(path, "utf8")).trim();
      const port = Number(text);
      if (Number.isInteger(port) && port > 0) {
        return port;
      }
    } catch {
      // Keep polling until the port file exists and contains a port.
    }

    await Bun.sleep(100);
  }

  throw new Error(`Native server did not write a port file within 15s: ${path}`);
}

async function createHostPage(browser: Browser): Promise<Page> {
  const page = await browser.newPage({
    viewport: { width: 1600, height: 1200 },
    deviceScaleFactor: 1,
  });
  return page;
}

// Start the test server (non-blocking, port 0 = OS picks a free port)
const server = startTestServer();
debugLog(`web test server listening on ${server.port}`);

// Build native binary, launch browsers concurrently
const cargoBuild = Bun.spawn(["cargo", "build", "--manifest-path", "tests/native/Cargo.toml"], {
  stdout: "inherit",
  stderr: "inherit",
});

const [cargoBuildExit, chromiumBrowser, firefoxBrowser] = await Promise.all([
  cargoBuild.exited,
  chromium.launch({ headless: true }),
  firefox.launch({ headless: true }),
]);

if (cargoBuildExit !== 0) {
  throw new Error(`cargo build failed (exit ${cargoBuildExit})`);
}
debugLog("native binary build finished");

const nativeServerDir = await mkdtemp(join(tmpdir(), "gtk-js-native-"));
const nativePortFile = join(nativeServerDir, "port");
const nativeServer = Bun.spawn(
  [
    "xvfb-run",
    "-a",
    "tests/native/target/debug/gtk-js-test",
    "serve",
    "--port-file",
    nativePortFile,
  ],
  { stdout: "pipe", stderr: "inherit" },
);
debugLog(`spawned native server pid=${nativeServer.pid ?? "unknown"}`);

const nativeServerPort = await waitForPortFile(nativePortFile);
debugLog(`native server listening on ${nativeServerPort}`);

const [chromiumHostPage, firefoxHostPage] = await Promise.all([
  createHostPage(chromiumBrowser),
  createHostPage(firefoxBrowser),
]);
await Promise.all([
  chromiumHostPage.goto(`http://localhost:${server.port}/gallery`),
  firefoxHostPage.goto(`http://localhost:${server.port}/gallery`),
]);
await Promise.all([
  chromiumHostPage.waitForSelector(`[data-case="button-text-default"] [data-testid="target"]`),
  firefoxHostPage.waitForSelector(`[data-case="button-text-default"] [data-testid="target"]`),
]);

globalThis.__testBrowsers = {
  chromium: chromiumBrowser,
  firefox: firefoxBrowser,
};
globalThis.__testPages = {
  chromium: chromiumHostPage,
  firefox: firefoxHostPage,
};
globalThis.__testServer = server;
globalThis.__nativeServerPort = nativeServerPort;
globalThis.__nativeServerProcess = nativeServer;

await waitForNativeReady(globalThis.__nativeServerPort);

process.on("exit", () => {
  debugLog("process exit; stopping native server and web server");
  nativeServer.kill();
  server.stop();
  void rm(nativeServerDir, { recursive: true, force: true });
});

// Browsers must be closed async — use beforeExit which fires before final exit
process.on("beforeExit", async () => {
  await Promise.all([chromiumBrowser.close(), firefoxBrowser.close()]);
});
