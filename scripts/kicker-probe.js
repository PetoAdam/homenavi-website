import { chromium } from "playwright";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const MIME = { ".html": "text/html", ".css": "text/css", ".js": "application/javascript", ".png": "image/png", ".svg": "image/svg+xml", ".ico": "image/x-icon" };
const server = http.createServer((req, res) => {
  const url = req.url.split("?")[0];
  const base = path.join("out", url === "/" ? "index.html" : url);
  const file = [base, base + ".html", path.join(base, "index.html")].find(f => fs.existsSync(f) && fs.statSync(f).isFile());
  if (!file) return res.writeHead(404).end();
  res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream" });
  res.end(fs.readFileSync(file));
});
server.listen(4178);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
await page.goto("http://localhost:4178/", { waitUntil: "networkidle" });
await page.waitForTimeout(1200);

const info = await page.evaluate(() => {
  const k = document.querySelector(".control-plane-kicker");
  if (!k) return { missing: true };
  const cs = getComputedStyle(k);
  const r = k.getBoundingClientRect();
  return {
    text: k.textContent,
    color: cs.color,
    fontSize: cs.fontSize,
    opacity: cs.opacity,
    visibility: cs.visibility,
    animation: cs.animation,
    rect: { x: r.x, y: r.y, w: r.width, h: r.height },
    html: k.outerHTML,
    pseudo: (() => {
      const p = getComputedStyle(k, "::before");
      return { content: p.content, width: p.width, height: p.height, background: p.background };
    })(),
    headingRect: (() => { const h = document.querySelector(".control-plane-heading"); const b = h.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; })(),
    planeRect: (() => { const b = document.querySelector(".home-control-plane").getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; })(),
  };
});
console.log(JSON.stringify(info, null, 2));

// capture just the heading block and analyse its pixels
const heading = await page.$(".control-plane-heading");
await heading.screenshot({ path: "qa-screenshots/_kicker-probe.png" });
const data = fs.readFileSync("qa-screenshots/_kicker-probe.png").toString("base64");
const colors = await page.evaluate(async (b64) => {
  const img = new Image(); img.src = "data:image/png;base64," + b64;
  await new Promise(r => img.onload = r);
  const c = document.createElement("canvas"); c.width = img.width; c.height = img.height;
  const ctx = c.getContext("2d"); ctx.drawImage(img, 0, 0);
  const px = ctx.getImageData(0, 0, img.width, img.height).data;
  const hist = {};
  for (let i = 0; i < px.length; i += 4) {
    const key = `${px[i]},${px[i+1]},${px[i+2]}`;
    hist[key] = (hist[key] || 0) + 1;
  }
  const top = Object.entries(hist).sort((a, b) => b[1] - a[1]).slice(0, 15);
  const greenish = Object.entries(hist).filter(([k, n]) => { const [r, g, b] = k.split(",").map(Number); return g > 120 && g > r + 15 && g > b + 15 && n > 5; }).sort((a,b)=>b[1]-a[1]).slice(0, 10);
  return { imgW: img.width, imgH: img.height, top, greenish };
}, data);
console.log(JSON.stringify(colors, null, 2));
await browser.close();
server.close();
