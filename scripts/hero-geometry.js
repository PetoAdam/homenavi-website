// Print exact geometry of the hero heading and kicker, then capture the kicker alone.
import { chromium } from "playwright";
import http from "http";
import fs from "fs";
import path from "path";

const PORT = 4178;
const OUT_DIR = path.resolve("out");
const SHOT_DIR = path.resolve("qa-screenshots");

const isFile = (p) => fs.existsSync(p) && fs.statSync(p).isFile();
const MIME = { ".html": "text/html", ".css": "text/css", ".js": "application/javascript", ".png": "image/png", ".svg": "image/svg+xml" };

const server = http.createServer((req, res) => {
  const url = req.url.split("?")[0];
  const base = path.join(OUT_DIR, url);
  const file = [base, base + ".html", path.join(base, "index.html")].find(isFile);
  if (!file) { res.writeHead(404); res.end("Not found"); return; }
  res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream" });
  res.end(fs.readFileSync(file));
});

(async () => {
  server.listen(PORT);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(900);

  const geo = await page.evaluate(() => {
    const box = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
    };
    return {
      plane: box(".home-control-plane"),
      heading: box(".control-plane-heading"),
      kicker: box(".control-plane-kicker"),
      h1: box(".control-plane-heading h1"),
      subline: box(".control-plane-subline"),
      schematic: box(".home-schematic"),
    };
  });
  console.log(JSON.stringify(geo, null, 2));

  const kicker = await page.$(".control-plane-kicker");
  await kicker.screenshot({ path: path.join(SHOT_DIR, "kicker-only.png") });

  await browser.close();
  server.close();
})();
