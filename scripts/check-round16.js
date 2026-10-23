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
server.listen(4177);

const browser = await chromium.launch();
const out = {};

// mobile: terminal must not overflow the viewport
const m = await browser.newPage({ viewport: { width: 390, height: 844 } });
await m.goto("http://localhost:4177/", { waitUntil: "domcontentloaded" });
await m.waitForTimeout(900);
const t = await m.$(".terminal-body");
const tb = await t.boundingBox();
const text = await t.evaluate(el => ({ sw: el.scrollWidth, cw: el.clientWidth, lines: el.innerText.split("\n").length }));
out.mobileTerminal = { box: tb, ...text, viewport: 390, overflow: text.sw > text.cw + 2 };
const notice = await m.$(".demo-notice");
out.mobileNotice = await notice.evaluate(el => el.innerText.replace(/\s+/g, " ").trim());
out.mobileOverflowX = await m.evaluate(() => document.documentElement.scrollWidth);
await m.close();

// desktop: kicker visible in element capture of the control plane
const w = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
await w.goto("http://localhost:4177/", { waitUntil: "domcontentloaded" });
await w.waitForTimeout(900);
const cp = await w.$(".home-control-plane");
const cpBox = await cp.boundingBox();
const k = await w.$(".control-plane-kicker");
const kBox = await k.boundingBox();
out.desktopKicker = { box: kBox, insidePlane: kBox.y >= cpBox.y && kBox.y < cpBox.y + cpBox.height };
out.desktopNotice = await (await w.$(".demo-notice")).evaluate(el => el.innerText.replace(/\s+/g, " ").trim());
await w.close();

console.log(JSON.stringify(out, null, 2));
await browser.close();
server.close();
