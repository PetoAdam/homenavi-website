import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1240, height: 1017 } });
await page.goto("http://localhost:4176/", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1200);

const data = await page.evaluate(() => {
  const rect = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      left: Math.round(r.left),
      top: Math.round(r.top),
      right: Math.round(r.right),
      bottom: Math.round(r.bottom),
      width: Math.round(r.width),
      height: Math.round(r.height),
      color: cs.color,
      opacity: cs.opacity,
      visibility: cs.visibility,
      fontSize: cs.fontSize,
    };
  };
  return {
    kicker: rect(".control-plane-kicker"),
    h1: rect(".control-plane-heading h1"),
    subline: rect(".control-plane-subline"),
    schematic: rect(".home-schematic"),
    actions: rect(".control-plane-actions"),
    note: rect(".control-plane-note"),
    viewport: { w: window.innerWidth, h: window.innerHeight },
  };
});

console.log(JSON.stringify(data, null, 2));
await browser.close();
