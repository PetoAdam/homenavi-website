// Capture wide (>=1400px) screenshots so the side rails render.
// Run with: npm run build && node scripts/capture-wide.js
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const OUT_DIR = path.join(process.cwd(), "out");
const SHOT_DIR = path.join(process.cwd(), "qa-screenshots");
const PORT = 4175;
const BASE = `http://localhost:${PORT}`;

const MIME = {
  ".html": "text/html", ".css": "text/css", ".js": "application/javascript",
  ".png": "image/png", ".jpg": "image/jpeg", ".txt": "text/plain",
  ".svg": "image/svg+xml", ".ico": "image/x-icon",
};

function serveStatic() {
  const server = http.createServer((req, res) => {
    let urlPath = decodeURIComponent(req.url.split("?")[0]);
    if (urlPath.endsWith("/")) urlPath += "index.html";
    const filePath = path.join(OUT_DIR, urlPath);
    const serveFile = (file) => {
      res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream" });
      res.end(fs.readFileSync(file));
    };
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) return serveFile(filePath);
    const withHtml = filePath + ".html";
    if (fs.existsSync(withHtml)) return serveFile(withHtml);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory() && fs.existsSync(path.join(filePath, "index.html"))) {
      return serveFile(path.join(filePath, "index.html"));
    }
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end(fs.readFileSync(path.join(OUT_DIR, "404.html")));
  });
  server.listen(PORT);
  return server;
}

const PAGES = [
  { url: "/", name: "home-wide" },
  { url: "/features", name: "features-wide" },
  { url: "/integrations", name: "integrations-wide" },
  { url: "/marketplace", name: "marketplace-wide" },
  { url: "/guides", name: "guides-wide" },
  { url: "/about", name: "about-wide" },
];

async function main() {
  if (!fs.existsSync(OUT_DIR)) { console.error("Run npm run build first."); process.exit(1); }
  fs.mkdirSync(SHOT_DIR, { recursive: true });
  const server = serveStatic();
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1600, height: 1000 } });

  try {
    for (const { url, name } of PAGES) {
      const page = await context.newPage();
      await page.goto(BASE + url, { waitUntil: "networkidle" });
      // Let reveal-on-scroll animations settle so nothing is invisible.
      await page.evaluate(() => {
        document.querySelectorAll(".section:not(.reveal)").forEach((el) => el.classList.add("reveal"));
      });
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(SHOT_DIR, `${name}.png`) });
      await page.screenshot({ path: path.join(SHOT_DIR, `${name}-full.png`), fullPage: true });
      const rails = await page.evaluate(() => document.querySelectorAll(".side-rails .rail").length);
      const brand = await page.evaluate(() => {
        const el = document.querySelector(".brand-name");
        if (!el) return null;
        const cs = getComputedStyle(el);
        return { text: el.textContent, font: cs.fontFamily, weight: cs.fontWeight, spacing: cs.letterSpacing, color: cs.color };
      });
      console.log(`${name}: rails=${rails} brand=${JSON.stringify(brand)}`);
      await page.close();
    }
  } finally {
    await browser.close();
    server.close();
  }
}

main();
