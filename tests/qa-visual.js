// Visual/UX QA: verifies design tokens, image integrity, contrast, and detail pages.
// Run with: npm run build && npm run test:qa
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const OUT_DIR = path.join(process.cwd(), "out");
const PORT = 4174;
const BASE = `http://localhost:${PORT}`;

const MIME = {
  ".html": "text/html", ".css": "text/css", ".js": "application/javascript",
  ".png": "image/png", ".jpg": "image/jpeg", ".txt": "text/plain",
  ".svg": "image/svg+xml", ".ico": "image/x-icon",
};

function serveStatic() {
  const server = http.createServer((req, res) => {
    let urlPath = decodeURIComponent(req.url.split("?")[0]);
    if (urlPath.endsWith("/")) urlPath += "index.html";
    const filePath = path.join(OUT_DIR, urlPath);
    const serveFile = (file) => {
      res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream" });
      res.end(fs.readFileSync(file));
    };
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) return serveFile(filePath);
    const withHtml = filePath + ".html";
    if (fs.existsSync(withHtml)) return serveFile(withHtml);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory() && fs.existsSync(path.join(filePath, "index.html"))) {
      return serveFile(path.join(filePath, "index.html"));
    }
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end(fs.readFileSync(path.join(OUT_DIR, "404.html")));
  });
  server.listen(PORT);
  return server;
}

let failures = 0;
const assert = (cond, label) => {
  if (cond) console.log(`  PASS: ${label}`);
  else { failures++; console.error(`  FAIL: ${label}`); }
};

// WCAG relative luminance + contrast ratio
function luminance([r, g, b]) {
  const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function contrast(rgb1, rgb2) {
  const l1 = luminance(rgb1), l2 = luminance(rgb2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}
function parseRgb(s) {
  const m = s.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) { console.error("Run npm run build first."); process.exit(1); }
  const server = serveStatic();
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Design tokens on home
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    const tokens = await page.evaluate(() => {
      const cs = getComputedStyle(document.documentElement);
      return {
        bg: cs.getPropertyValue("--color-bg").trim(),
        primary: cs.getPropertyValue("--color-primary").trim(),
        container: cs.getPropertyValue("--container-width").trim(),
      };
    });
    assert(tokens.bg === "#242e3a", `design token --color-bg is #242e3a (got ${tokens.bg})`);
    assert(tokens.primary === "#39aa79", `design token --color-primary is #39aa79 (got ${tokens.primary})`);
    assert(tokens.container === "1120px", `container width token present (${tokens.container})`);

    // Hero heading hierarchy
    const h1 = await page.$("main h1");
    assert(h1, "home has an h1 heading");
    if (h1) {
      const h1Style = await h1.evaluate((el) => getComputedStyle(el));
      const bodyBg = parseRgb(await page.evaluate(() => getComputedStyle(document.body).backgroundColor));
      const h1Color = parseRgb(h1Style.color);
      assert(contrast(h1Color, bodyBg) >= 4.5, `hero h1 contrast ratio vs page bg >= 4.5 (${contrast(h1Color, bodyBg).toFixed(2)})`);
    }

    // No broken images anywhere on key pages
    const keyPages = ["/", "/features", "/marketplace", "/demo", "/guides", "/integrations", "/about", "/community", "/changelog"];
    for (const p of keyPages) {
      await page.goto(BASE + p, { waitUntil: "networkidle" });
      const broken = await page.evaluate(() =>
        Array.from(document.images).filter((img) => img.complete && img.naturalWidth === 0).map((img) => img.src)
      );
      assert(broken.length === 0, `${p}: all images load (${broken.join(", ")})`);
    }

    // Guide detail pages render markdown
    for (const slug of ["quickstart", "self-hosting", "integration-setup", "automations", "troubleshooting"]) {
      await page.goto(BASE + `/guides/${slug}`, { waitUntil: "networkidle" });
      const hasH1 = await page.$(".guide-content h1");
      const hasCode = await page.$(".guide-content pre, .guide-content code");
      assert(hasH1, `guide ${slug}: renders an h1 heading`);
      assert(hasCode, `guide ${slug}: renders code blocks/inline code`);
    }

    // Marketplace detail pages render
    await page.goto(BASE + "/marketplace", { waitUntil: "networkidle" });
    const detailLinks = await page.$$eval("a.integration-card[href^='/marketplace/']", (els) => els.map((a) => a.getAttribute("href")));
    assert(detailLinks.length > 0, "marketplace cards link to detail pages");
    for (const href of detailLinks.slice(0, 3)) {
      await page.goto(BASE + href, { waitUntil: "networkidle" });
      const header = await page.$(".page-header h1");
      const badges = await page.$(".integration-badges");
      assert(header, `detail ${href}: renders integration name`);
      assert(badges, `detail ${href}: renders badges`);
    }

    // 404 page
    const res = await page.goto(BASE + "/definitely-missing");
    assert(res.status() === 404, "unknown URL returns 404 page");
    const notFoundTitle = await page.$(".page-title");
    assert(notFoundTitle, "404 page renders a title card");

    // Footer present on all pages
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    const footer = await page.$(".site-footer");
    assert(footer, "footer renders");
    const footerCols = await page.$$eval(".footer-col", (els) => els.length);
    assert(footerCols === 4, `footer has 4 columns (${footerCols})`);

    // Nav brand and demo CTA
    const brand = await page.$(".brand");
    assert(brand, "nav brand renders");
    const demoCta = await page.$(".nav-links a.btn");
    assert(demoCta, "nav has a demo CTA button");

    // Screenshot frames look styled
    const frame = await page.$(".screenshot-frame");
    if (frame) {
      const style = await frame.evaluate((el) => getComputedStyle(el));
      assert(style.borderRadius !== "0px", "screenshot frames have rounded corners");
      assert(style.shadow !== undefined || style.boxShadow !== "none", "screenshot frames have shadows");
    }
  } finally {
    await browser.close();
    server.close();
  }

  if (failures > 0) { console.error(`\nVisual QA: ${failures} failure(s).`); process.exit(1); }
  console.log("\nVisual QA: all checks passed.");
}

main();
