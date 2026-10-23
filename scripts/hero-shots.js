// Focused screenshots at a 27-inch 2K desktop viewport for design review.
import { chromium } from "playwright";
import http from "http";
import fs from "fs";
import path from "path";

const PORT = 4176;
const OUT_DIR = path.resolve("out");
const SHOT_DIR = path.resolve("qa-screenshots");

const isFile = (p) => fs.existsSync(p) && fs.statSync(p) && fs.statSync(p).isFile();

const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

const server = http.createServer((req, res) => {
  const url = req.url.split("?")[0];
  const base = path.join(OUT_DIR, url);
  const candidates = [base, base + ".html", path.join(base, "index.html")];
  const file = candidates.find(isFile);

  if (!file) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream" });
  res.end(fs.readFileSync(file));
});

(async () => {
  server.listen(PORT);
  const browser = await chromium.launch();

  const wide = await browser.newPage({ viewport: { width: 2560, height: 1440 } });
  await wide.goto(`http://localhost:${PORT}/`, { waitUntil: "networkidle" });
  // Let the reveal animations finish so captures show the settled page.
  await wide.waitForTimeout(900);

  // Hero band only, so the dashboard control desk is judged on its own.
  const hero = await wide.$(".home-stage");
  if (hero) {
    await hero.screenshot({ path: path.join(SHOT_DIR, "hero-dashboard.png") });
    console.log("saved hero-dashboard.png");
  }

  await wide.screenshot({ path: path.join(SHOT_DIR, "home-wide.png") });
  console.log("saved home-wide.png");

  await wide.screenshot({ path: path.join(SHOT_DIR, "home-wide-full.png"), fullPage: true });
  console.log("saved home-wide-full.png");

  // Mid-page: wait for lazy walkthrough images and entry motion before capture.
  const walkthrough = await wide.$(".walkthrough");
  if (walkthrough) {
    await wide.evaluate(() => {
      const section = document.querySelector(".walkthrough");
      const nav = document.querySelector(".site-nav");
      if (!section) return;
      const navHeight = nav?.getBoundingClientRect().height ?? 0;
      const top = section.getBoundingClientRect().top + window.scrollY - navHeight - 16;
      window.scrollTo({ top: Math.max(0, top) });
    });
    await wide.waitForTimeout(750);
    await walkthrough.screenshot({ path: path.join(SHOT_DIR, "walkthrough.png") });
    console.log("saved walkthrough.png");
  }
  await wide.screenshot({ path: path.join(SHOT_DIR, "home-mid.png") });
  console.log("saved home-mid.png");

  await wide.evaluate(() => window.scrollTo(0, 1800));
  await wide.screenshot({ path: path.join(SHOT_DIR, "home-lower.png") });
  console.log("saved home-lower.png");

  const explorePlatform = await wide.$(".explore-platform");
  if (explorePlatform) {
    await explorePlatform.scrollIntoViewIfNeeded();
    await wide.waitForTimeout(150);
    await explorePlatform.screenshot({ path: path.join(SHOT_DIR, "explore-platform.png") });
    console.log("saved explore-platform.png");
  }

  const helmTab = await wide.$('.deployment-tab-list button[role="tab"]:has-text("Helm")');
  const deploymentTabs = await wide.$(".deployment-tabs");
  if (deploymentTabs) {
    await deploymentTabs.scrollIntoViewIfNeeded();
    await wide.waitForTimeout(150);
    await deploymentTabs.screenshot({ path: path.join(SHOT_DIR, "deployment-compose.png") });
    console.log("saved deployment-compose.png");
  }
  if (helmTab && deploymentTabs) {
    await helmTab.click();
    await deploymentTabs.scrollIntoViewIfNeeded();
    await wide.waitForTimeout(150);
    await deploymentTabs.screenshot({ path: path.join(SHOT_DIR, "deployment-helm.png") });
    console.log("saved deployment-helm.png");
  }

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobile.goto(`http://localhost:${PORT}/`, { waitUntil: "networkidle" });
  await mobile.waitForTimeout(900);
  await mobile.screenshot({ path: path.join(SHOT_DIR, "home-mobile.png") });
  console.log("saved home-mobile.png");

  // Geometry checks: the intro and dashboard stay aligned to the content column.
  const geometry = await wide.evaluate(() => {
    const container = document.querySelector(".container");
    const containerBox = container.getBoundingClientRect();
    const measure = (selector) => {
      const el = document.querySelector(selector);
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return {
        left: Math.round(b.left),
        right: Math.round(b.right),
        width: Math.round(b.width),
        height: Math.round(b.height),
      };
    };
    return {
      container: { left: Math.round(containerBox.left), right: Math.round(containerBox.right) },
      hero: measure(".home-stage"),
      intro: measure(".hero-intro"),
      heading: measure(".hero-intro h1"),
      product: measure(".hero-product"),
      walkRows: Array.from(document.querySelectorAll(".walk-row")).map((r) => {
        const b = r.getBoundingClientRect();
        return { left: Math.round(b.left), right: Math.round(b.right) };
      }),
    };
  });

  console.log(JSON.stringify(geometry, null, 2));

  await browser.close();
  server.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
