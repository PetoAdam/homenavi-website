// Measure rendered nav-to-content gap on the built site.
import { chromium } from "playwright";
import http from "http";
import fs from "fs";
import path from "path";

const PORT = 4176;
const OUT_DIR = path.resolve("out");

const server = http.createServer((req, res) => {
  let url = req.url.split("?")[0];
  if (url === "/") url = "/index.html";
  let file = path.join(OUT_DIR, url);
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (fs.existsSync(file) && fs.statSync(file).isFile()) {
    res.writeHead(200);
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
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: "networkidle" });
  const result = await page.evaluate(() => {
    const nav = document.querySelector(".site-nav");
    const main = document.querySelector("main");
    const first = main.firstElementChild;
    const nr = nav.getBoundingClientRect();
    const fr = first.getBoundingClientRect();
    return {
      navBottom: nr.bottom,
      firstContentTop: fr.top,
      gap: fr.top - nr.bottom,
      mainPadding: getComputedStyle(main).paddingTop,
    };
  });
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
  server.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
