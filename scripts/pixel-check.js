import { chromium } from "playwright";
import fs from "node:fs";

const browser = await chromium.launch();
const page = await browser.newPage();

async function scan(file, y0, y1, x0, x1) {
  const data = fs.readFileSync(file).toString("base64");
  return page.evaluate(async ({ b64, y0, y1, x0, x1 }) => {
    const img = new Image();
    img.src = "data:image/png;base64," + b64;
    await new Promise(r => img.onload = r);
    const c = document.createElement("canvas");
    c.width = img.width; c.height = img.height;
    const ctx = c.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const px = ctx.getImageData(x0, y0, x1 - x0, y1 - y0).data;
    let green = 0, bright = 0;
    for (let i = 0; i < px.length; i += 4) {
      const r = px[i], g = px[i + 1], b = px[i + 2];
      // primary-soft #57c394 -> g dominant, r mid, b low-ish
      if (g > 140 && g > r + 20 && g > b + 20) green++;
      if (r > 200 && g > 200 && b > 200) bright++;
    }
    return { imgW: img.width, imgH: img.height, greenPixels: green, brightPixels: bright };
  }, { b64: data, y0, y1, x0, x1 });
}

// hero-control-plane.png: element capture; kicker measured at page y 185-205, element top ~130?
// Just scan the whole top half band-by-band to find where green text sits.
const results = {};
results.hero = await scan("qa-screenshots/hero-control-plane.png", 0, 260, 150, 960);
results.heroBand0 = await scan("qa-screenshots/hero-control-plane.png", 0, 40, 150, 960);
results.heroBand40 = await scan("qa-screenshots/hero-control-plane.png", 40, 80, 150, 960);
results.heroBand80 = await scan("qa-screenshots/hero-control-plane.png", 80, 120, 150, 960);
results.wide = await scan("qa-screenshots/home-wide.png", 150, 230, 150, 960);
results.wideTop = await scan("qa-screenshots/home-wide.png", 0, 150, 150, 960);
console.log(JSON.stringify(results, null, 2));
await browser.close();
