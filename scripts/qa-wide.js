// Wide-viewport screenshots (1600x1000) to verify side rails and layout.
import { chromium } from "playwright";
import http from "http";
import fs from "fs";
import path from "path";

const PORT = 4175;
const OUT_DIR = path.resolve("out");
const SHOT_DIR = path.resolve("qa-screenshots");

const isFile = (p) => fs.existsSync(p) && fs.statSync(p).isFile();

const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".txt": "text/plain",
  ".ico": "image/x-icon",
};

const server = http.createServer((req, res) => {
  const url = req.url.split("?")[0];

  // Next static export emits both <name>.html and a <name>/ metadata directory,
  // so resolve a route against several candidate paths.
  const base = path.join(OUT_DIR, url);
  const candidates = [
    base,
    base + ".html",
    path.join(base, "index.html"),
  ];

  const file = candidates.find(isFile);
  if (file) {
    res.writeHead(200, {
      "Content-Type": MIME[path.extname(file)] || "application/octet-stream",
    });
    res.end(fs.readFileSync(file));
  } else {
    res.writeHead(404);
    res.end("Not found");
  }
});

(async () => {
  server.listen(PORT);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });

  const pages = [
    ["home-wide", "/"],
    ["features-wide", "/features"],
    ["marketplace-wide", "/marketplace"],
    ["integrations-wide", "/integrations"],
  ];

  for (const [name, route] of pages) {
    await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: "networkidle" });
    await page.screenshot({ path: path.join(SHOT_DIR, `${name}.png`), fullPage: false });
    console.log(`saved ${name}.png`);
  }

  // Full-page home shot for scroll context
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(SHOT_DIR, "home-wide-full.png"), fullPage: true });
  console.log("saved home-wide-full.png");

  await browser.close();
  server.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
