import { chromium } from "playwright";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const MIME = {
  ".html": "text/html", ".css": "text/css", ".js": "application/javascript",
  ".png": "image/png", ".svg": "image/svg+xml", ".ico": "image/x-icon",
};

const server = http.createServer((req, res) => {
  const url = req.url.split("?")[0];
  const candidates = [
    path.join("out", url === "/" ? "index.html" : url),
    path.join("out", url + ".html"),
    path.join("out", url, "index.html"),
  ];
  const file = candidates.find((f) => fs.existsSync(f) && fs.statSync(f).isFile());
  if (!file) return res.writeHead(404).end();
  res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream" });
  res.end(fs.readFileSync(file));
});

(async () => {
  await new Promise((r) => server.listen(4178, r));
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto("http://localhost:4178/", { waitUntil: "networkidle" });
  const boxes = (sel) =>
    page.$$eval(sel, (els) =>
      els.map((e) => {
        const b = e.getBoundingClientRect();
        return { left: Math.round(b.left), right: Math.round(b.right), top: Math.round(b.top), bottom: Math.round(b.bottom), text: (e.textContent || "").trim().slice(0, 40) };
      })
    );
  console.log("flow", await boxes(".schematic-flow"));
  console.log("flowNodes", await boxes(".flow-node"));
  console.log("flowLines", await boxes(".flow-line"));
  console.log("flowPackets", await boxes(".flow-packet"));
  console.log("roomLabels", await boxes(".room-label"));
  console.log("rooms", await boxes(".schematic-rooms"));
  console.log("hub", await boxes(".local-hub"));
  console.log("output", await boxes(".schematic-output"));
  console.log("roomsEach", await boxes(".room"));
  console.log("kickerMobile", await boxes(".control-plane-kicker"));

  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desktop.goto("http://localhost:4178/", { waitUntil: "networkidle" });
  const dboxes = (sel) =>
    desktop.$$eval(sel, (els) =>
      els.map((e) => {
        const b = e.getBoundingClientRect();
        return { left: Math.round(b.left), right: Math.round(b.right), top: Math.round(b.top), bottom: Math.round(b.bottom), text: (e.textContent || "").trim().slice(0, 40) };
      })
    );
  console.log("desktopKicker", await dboxes(".control-plane-kicker"));
  console.log("desktopH1", await dboxes(".control-plane-heading h1"));
  console.log("desktopRooms", await dboxes(".room"));
  console.log("desktopWires", await dboxes(".schematic-wires"));
  console.log("desktopPackets", await dboxes(".signal-packet"));
  console.log("desktopHub", await dboxes(".local-hub"));
  console.log("viewport", await desktop.evaluate(() => ({ w: window.innerWidth, h: window.innerHeight })));

  await browser.close();
  server.close();
})();
