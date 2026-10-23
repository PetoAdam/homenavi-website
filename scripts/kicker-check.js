// Verify the hero kicker renders and capture it as its own image for review.
import { chromium } from "playwright";
import http from "http";
import fs from "fs";
import path from "path";

const PORT = 4177;
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

  const info = await page.evaluate(() => {
    const el = document.querySelector(".control-plane-kicker");
    if (!el) return { present: false };
    const box = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const atPoint = document.getElementById("__probe") ? null : (() => {
      const x = box.left + 10, y = box.top + box.height / 2;
      const hit = document.elementFromPoint(x, y);
      return hit ? hit.className || hit.tagName : null;
    })();
    return {
      present: true,
      text: el.textContent,
      box: { x: Math.round(box.x), y: Math.round(box.y), w: Math.round(box.width), h: Math.round(box.height) },
      color: cs.color,
      fontSize: cs.fontSize,
      opacity: cs.opacity,
      visibility: cs.visibility,
      elementAtMidline: atPoint,
    };
  });

  console.log(JSON.stringify(info, null, 2));

  const heading = await page.$(".control-plane-heading");
  if (heading) {
    await heading.screenshot({ path: path.join(SHOT_DIR, "hero-heading-only.png") });
    console.log("saved hero-heading-only.png");
  }

  await browser.close();
  server.close();
})();
