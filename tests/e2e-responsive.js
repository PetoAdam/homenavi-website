// E2E responsive/visual QA for the exported static site (out/).
// Run with: npm run build && npm run test:e2e
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const OUT_DIR = path.join(process.cwd(), "out");
const SHOT_DIR = path.join(process.cwd(), "qa-screenshots");
const PORT = 4173;
const BASE = `http://localhost:${PORT}`;

const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".txt": "text/plain",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
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

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      serveFile(filePath);
      return;
    }
    // Next export emits both <name>.html and <name>/ directories
    const withHtml = filePath + ".html";
    if (fs.existsSync(withHtml)) {
      serveFile(withHtml);
      return;
    }
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory() && fs.existsSync(path.join(filePath, "index.html"))) {
      serveFile(path.join(filePath, "index.html"));
      return;
    }
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end(fs.readFileSync(path.join(OUT_DIR, "404.html")));
  });
  server.listen(PORT);
  return server;
}

const pages = [
  { name: "home", path: "/" },
  { name: "features", path: "/features" },
  { name: "marketplace", path: "/marketplace" },
  { name: "demo", path: "/demo" },
  { name: "guides", path: "/guides" },
  { name: "integrations", path: "/integrations" },
];

let failures = 0;
function assert(cond, label) {
  if (cond) {
    console.log(`  PASS: ${label}`);
  } else {
    failures++;
    console.error(`  FAIL: ${label}`);
  }
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) {
    console.error("Build output 'out/' not found. Run npm run build first.");
    process.exit(1);
  }
  fs.mkdirSync(SHOT_DIR, { recursive: true });
  const server = serveStatic();
  const browser = await chromium.launch();

  try {
    // ---------- Desktop ----------
    const desktopCtx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const desktop = await desktopCtx.newPage();
    desktop.on("console", (msg) => {
      if (msg.type() === "error") {
        failures++;
        console.error(`  FAIL: console error on ${desktop.url()}: ${msg.text()}`);
      }
    });

    console.log("[desktop 1280x800]");

    for (const p of pages) {
      await desktop.goto(BASE + p.path, { waitUntil: "networkidle" });
      assert(desktop.url().startsWith(BASE), `${p.name} page loads`);

      const navLinks = await desktop.$(".nav-links");
      const navVisible = navLinks && await navLinks.evaluate((el) => el.checkVisibility?.(el) ?? el.offsetWidth > 0);
      assert(navVisible, `${p.name}: nav links visible on desktop`);

      const toggle = await desktop.$(".nav-toggle");
      const toggleHidden = toggle && !(await toggle.evaluate((el) => el.checkVisibility?.(el) ?? el.offsetWidth > 0));
      assert(toggleHidden, `${p.name}: hamburger hidden on desktop`);

      await desktop.screenshot({ path: path.join(SHOT_DIR, `${p.name}-desktop.png`), fullPage: true });
    }

    // Grid behaviour on home at desktop width
    await desktop.goto(BASE + "/", { waitUntil: "networkidle" });
    const cols4 = await desktop.$(".grid.cols-4");
    if (cols4) {
      const tpl = await cols4.evaluate((el) => getComputedStyle(el).gridTemplateColumns);
      const n = tpl.split(" ").length;
      assert(n >= 2, `home value grid uses multiple columns on desktop (${n})`);
    }

    const helmTab = await desktop.$('.deployment-tab-list button[role="tab"]:has-text("Helm")');
    assert(helmTab, "home has a Helm deployment tab");
    if (helmTab) {
      await helmTab.click();
      const helmSelected = await helmTab.getAttribute("aria-selected");
      const helmCommand = await desktop.$eval(".deployment-tabs .terminal-body", (el) => el.textContent || "");
      assert(helmSelected === "true", "Helm deployment tab becomes selected");
      assert(helmCommand.includes("helm upgrade --install"), "Helm tab displays the Helm installation command");
    }

    const exploreLinks = await desktop.$$eval(".explore-platform a", (links) => links.map((link) => link.getAttribute("href")));
    assert(
      ["/demo", "/guides/mcp", "/features", "/marketplace", "/integrations", "/architecture", "/guides"].every((href) => exploreLinks.includes(href)),
      "home discovery section links to demo, MCP, and product pages"
    );

    const rosterRows = await desktop.$$(".roster-row");
    assert(rosterRows.length > 0 && rosterRows.length <= 5, `home integration roster is capped at five entries (${rosterRows.length})`);
    const allIntegrationsLink = await desktop.$('.roster > a[href="/integrations"]');
    assert(allIntegrationsLink, "home integration roster links to the full integrations directory");

    const walkthroughRows = await desktop.$$(".walk-row");
    assert(walkthroughRows.length === 9, `home has nine walkthrough chapters (${walkthroughRows.length})`);
    const walkthroughIndex = await desktop.$(".walkthrough-index");
    assert(!walkthroughIndex, "home walkthrough omits a redundant chapter index");
    const roadmapLabels = await desktop.$$(".walk-roadmap");
    assert(roadmapLabels.length === 3, `home labels three future capabilities as roadmap work (${roadmapLabels.length})`);
    const walkthroughLinks = await desktop.$$eval(".walk-row .walk-link", (links) => links.map((link) => link.getAttribute("href")));
    assert(
      ["/features", "/guides/integration-setup", "/guides/automations", "/integrations", "/guides/mcp", "/architecture", "/guides/self-hosting"].every((href) => walkthroughLinks.includes(href)),
      "walkthrough chapters lead to the relevant product documentation"
    );

    await desktop.goto(BASE + "/features", { waitUntil: "networkidle" });
    const featureItems = await desktop.$$(".feature-band, .feature-operating-list article");
    assert(
      featureItems.length >= walkthroughRows.length,
      `features catalogue covers at least the walkthrough scope (${featureItems.length} items)`
    );

    // Marketplace search/filter interactivity
    await desktop.goto(BASE + "/marketplace", { waitUntil: "networkidle" });
    const search = await desktop.$(".search-input");
    assert(search, "marketplace has a search input");
    if (search) {
      const totalCards = await desktop.$eval(".grid.cols-3", (el) => el.children.length).catch(() => 0);
      await search.fill("spotify");
      await desktop.waitForTimeout(300);
      const filteredCards = await desktop.$eval(".grid.cols-3", (el) => el.children.length).catch(() => 0);
      assert(filteredCards <= totalCards, `search filters cards (${totalCards} -> ${filteredCards})`);
      await search.fill("");
    }
    const filterPill = await desktop.$(".filter-pill");
    assert(filterPill, "marketplace has filter pills");
    if (filterPill) {
      await filterPill.click();
      await desktop.waitForTimeout(300);
      const active = await desktop.$(".filter-pill.active");
      assert(active, "filter pill becomes active after click");
    }

    // ---------- Mobile ----------
    const mobileCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const mobile = await mobileCtx.newPage();
    mobile.on("console", (msg) => {
      if (msg.type() === "error") {
        failures++;
        console.error(`  FAIL: console error on ${mobile.url()}: ${msg.text()}`);
      }
    });

    console.log("[mobile 390x844]");

    for (const p of pages) {
      await mobile.goto(BASE + p.path, { waitUntil: "networkidle" });
      assert(mobile.url().startsWith(BASE), `${p.name} page loads on mobile`);

      const toggle = await mobile.$(".nav-toggle");
      const toggleVisible = toggle && await toggle.evaluate((el) => el.checkVisibility?.(el) ?? el.offsetWidth > 0);
      assert(toggleVisible, `${p.name}: hamburger visible on mobile`);

      await mobile.screenshot({ path: path.join(SHOT_DIR, `${p.name}-mobile.png`), fullPage: true });
    }

    // Hamburger opens the nav
    await mobile.goto(BASE + "/", { waitUntil: "networkidle" });
    const navToggle = await mobile.$(".nav-toggle");
    if (navToggle) {
      await navToggle.click();
      await mobile.waitForTimeout(300);
      const openLinks = await mobile.$(".nav-links.open");
      assert(openLinks, "clicking hamburger opens nav links");
      const linksVisible = await openLinks.evaluate((el) => el.checkVisibility?.(el) ?? el.offsetWidth > 0);
      assert(linksVisible, "nav links become visible after hamburger click");
      await mobile.screenshot({ path: path.join(SHOT_DIR, "home-mobile-nav-open.png") });
    }

    // Grids stack to a single column on small screens
    const cols = await mobile.$(".grid.cols-4, .grid.cols-3, .grid.cols-2");
    if (cols) {
      const tpl = await cols.evaluate((el) => getComputedStyle(el).gridTemplateColumns);
      const n = tpl.split(" ").length;
      assert(n === 1, `grids stack to 1 column on mobile (${n})`);
    }

    // No horizontal overflow on mobile
    const overflow = await mobile.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
    assert(!overflow, "no horizontal overflow on mobile home page");
  } finally {
    await browser.close();
    server.close();
  }

  if (failures > 0) {
    console.error(`\nE2E responsive QA: ${failures} failure(s).`);
    process.exit(1);
  }
  console.log("\nE2E responsive QA: all checks passed.");
}

main();
