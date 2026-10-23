import { chromium } from "playwright";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const types = { ".html": "text/html", ".css": "text/css", ".js": "application/javascript", ".png": "image/png", ".svg": "image/svg+xml" };

const server = http.createServer((req, res) => {
  const f = path.join("out", req.url === "/" ? "index.html" : req.url);
  if (!fs.existsSync(f)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { "Content-Type": types[path.extname(f)] ?? "application/octet-stream" });
  res.end(fs.readFileSync(f));
});
await new Promise(r => server.listen(4179, r));

const browser = await chromium.launch();

for (const w of [1440, 1280, 1024]) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 } });
  await page.goto("http://localhost:4179/", { waitUntil: "networkidle" });
  const info = await page.evaluate(() => {
    const m = document.querySelector("main.container");
    const cs = getComputedStyle(m);
    return {
      maxWidth: cs.maxWidth,
      padding: cs.padding,
      rectWidth: m.getBoundingClientRect().width,
      rectLeft: m.getBoundingClientRect().left,
    };
  });
  console.log(`viewport ${w}:`, info);
  await page.close();
}

await browser.close();
server.close();
