// Measure hero geometry/visibility at desktop and mobile.
import { chromium } from "playwright";
import http from "http";
import fs from "fs";
import path from "path";

const PORT = 4177;
const OUT_DIR = path.resolve("out");
const MIME = { ".html": "text/html", ".css": "text/css", ".js": "application/javascript", ".png": "image/png", ".svg": "image/svg+xml" };

const isFile = (p) => fs.existsSync(p) && fs.statSync(p).isFile();

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

  for (const [label, viewport] of [["desktop", { width: 1600, height: 1000 }], ["mobile", { width: 390, height: 844 }]]) {
    const page = await browser.newPage({ viewport });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: "networkidle" });

    const data = await page.evaluate(() => {
      const box = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const b = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return {
          left: Math.round(b.left), right: Math.round(b.right),
          top: Math.round(b.top), bottom: Math.round(b.bottom),
          display: cs.display, opacity: cs.opacity, visibility: cs.visibility,
          text: (el.textContent || "").trim().slice(0, 40),
        };
      };
      return {
        nav: box(".site-nav"),
        kicker: box(".control-plane-kicker"),
        h1: box(".control-plane-heading h1"),
        subline: box(".control-plane-subline"),
        schematic: box(".home-schematic"),
        rooms: box(".schematic-rooms"),
        wires: box(".schematic-wires"),
        hub: box(".local-hub"),
        output: box(".schematic-output"),
        actions: box(".control-plane-actions"),
        heroBottom: Math.round(document.querySelector(".home-control-plane").getBoundingClientRect().bottom),
        firstSectionTop: Math.round(document.querySelector(".circuits").getBoundingClientRect().top),
      };
    });

    console.log(label, JSON.stringify(data, null, 2));
    await page.close();
  }

  await browser.close();
  server.close();
})().catch((e) => { console.error(e); process.exit(1); });
