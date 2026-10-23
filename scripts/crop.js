import { chromium } from "playwright";
import fs from "node:fs";

const browser = await chromium.launch();
const page = await browser.newPage();
const data = fs.readFileSync(process.argv[2]).toString("base64");
const [x, y, w, h] = process.argv.slice(3).map(Number);
const out = await page.evaluate(async ({ b64, x, y, w, h }) => {
  const img = new Image(); img.src = "data:image/png;base64," + b64;
  await new Promise(r => img.onload = r);
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const ctx = c.getContext("2d");
  ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
  const c2 = document.createElement("canvas"); c2.width = w * 2; c2.height = h * 2;
  const ctx2 = c2.getContext("2d");
  ctx2.drawImage(c, 0, 0, w * 2, h * 2);
  return c2.toDataURL("image/png").split(",")[1];
}, { b64: data, x, y, w, h });
fs.writeFileSync(process.argv[7], Buffer.from(out, "base64"));
console.log("wrote", process.argv[7]);
await browser.close();
