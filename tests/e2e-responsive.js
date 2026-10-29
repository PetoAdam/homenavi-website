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
  { name: "deploy", path: "/deploy" },
  { name: "architecture", path: "/architecture" },
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
      ["/demo", "/deploy", "/guides/mcp", "/features", "/marketplace", "/integrations", "/architecture", "/guides"].every((href) => exploreLinks.includes(href)),
      "home discovery section links to demo, deployment, MCP, and product pages"
    );
    const exploreGrid = await desktop.$(".explore-links");
    if (exploreGrid) {
      const columns = await exploreGrid.evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(" ").length);
      const linkCount = await desktop.$$(".explore-links a");
      assert(columns === 3 && linkCount.length % columns === 0, `home discovery links fill complete rows (${linkCount.length} links / ${columns} columns)`);
    }

    const deployCta = await desktop.$('.hero-actions a[href="/deploy"]');
    assert(deployCta, "home hero links to the deployment planner");

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
      ["/features", "/guides/integration-setup", "/guides/automations", "/integrations", "/guides/mcp", "/architecture", "/deploy"].every((href) => walkthroughLinks.includes(href)),
      "walkthrough chapters lead to the relevant product documentation"
    );

    await desktop.goto(BASE + "/features", { waitUntil: "networkidle" });
    const featureItems = await desktop.$$(".feature-band, .feature-reveal-row");
    assert(
      featureItems.length >= walkthroughRows.length,
      `features catalogue covers at least the walkthrough scope (${featureItems.length} items)`
    );
    const pairingFlow = await desktop.$$(".feature-pairing li");
    assert(pairingFlow.length === 3, "features explains the three-step pairing flow");
    const microserviceAdvantages = await desktop.$$(".feature-microservices dl > div");
    assert(microserviceAdvantages.length === 3, "features lists three Go microservice advantages");

    await desktop.goto(BASE + "/architecture", { waitUntil: "networkidle" });
    const architectureFlows = await desktop.$$(".architecture-react-flow .react-flow");
    assert(architectureFlows.length === 2, "architecture renders React Flow diagrams for runtime and state paths");
    const architectureText = await desktop.$eval(".architecture-system .architecture-react-flow.runtime", (flow) => flow.textContent || "");
    assert(
      ["Client plane", "Core / control plane", "Edge / device plane", "Integration runtime plane", "Marketplace plane", "REST API services", "Device Hub", "Entity Registry", "History Service", "Automation Service", "Integration Proxy", "HDP integrations", "Marketplace"].every((label) => architectureText.includes(label)),
      "detailed architecture map includes Mermaid-aligned planes and all connected core services"
    );
    assert(!architectureText.includes("EMQX"), "desktop runtime shows direct HDP/MQTT relationships without an EMQX node");
    const mcpToNginx = await desktop.$('.architecture-react-flow.runtime [aria-label="Edge from mcp-client to nginx"]');
    const mcpToGateway = await desktop.$('.architecture-react-flow.runtime [aria-label="Edge from mcp-client to edge"]');
    assert(mcpToNginx && !mcpToGateway, "MCP client enters through Nginx rather than connecting directly to the gateway");
    const requiredRuntimeEdges = await desktop.$$('.architecture-react-flow.runtime [aria-label="Edge from nginx to edge"], .architecture-react-flow.runtime [aria-label="Edge from api-services to support-services"], .architecture-react-flow.runtime [aria-label="Edge from adapters to device-hub"], .architecture-react-flow.runtime [aria-label="Edge from nginx to integrations"], .architecture-react-flow.runtime [aria-label="Edge from integrations to hdp-integrations"], .architecture-react-flow.runtime [aria-label="Edge from hdp-integrations to device-hub"], .architecture-react-flow.runtime [aria-label="Edge from hdp-integrations to integration-devices"]');
    assert(requiredRuntimeEdges.length === 7, "runtime graph preserves verified gateway, REST support, adapter, integration, and device connections");
    const invalidRuntimeEdges = await desktop.$$('.architecture-react-flow.runtime [aria-label="Edge from devices to integrations"], .architecture-react-flow.runtime [aria-label="Edge from nginx to adapters"], .architecture-react-flow.runtime [aria-label="Edge from edge to adapters"]');
    assert(invalidRuntimeEdges.length === 0, "runtime graph omits unsupported physical-device-to-proxy, Nginx-to-adapter, and gateway-to-adapter connections");

    await desktop.goto(BASE + "/deploy", { waitUntil: "networkidle" });
    const wizard = await desktop.$(".deployment-wizard");
    assert(wizard, "deployment guide renders an interactive wizard");
    const continueButton = await desktop.$('.deployment-wizard button:has-text("Continue")');
    assert(continueButton, "deployment wizard has a continue control");
    if (continueButton) {
      await continueButton.click();
      const backButton = await desktop.$('.deployment-wizard button:has-text("Back")');
      assert(backButton, "deployment wizard preserves a back path after advancing");
      if (backButton) {
        await backButton.click();
        const selectedHosting = await desktop.$('.wizard-choice input[value="self-hosted"]:checked');
        assert(selectedHosting, "wizard keeps answers after navigating back");
      }
    }
    for (let index = 0; index < 5; index++) {
      const next = await desktop.$('.deployment-wizard button:has-text("Continue")');
      if (next) await next.click();
    }
    const hardwareRecommendations = await desktop.$$(".wizard-hardware a");
    assert(hardwareRecommendations.length > 0, "wizard renders conditional hardware recommendations");
    const topologyRecommendation = await desktop.$('.wizard-hardware a:has-text("No separate edge node")');
    assert(topologyRecommendation, "wizard explains when no local edge node is needed");
    const remoteAccess = await desktop.$$(".wizard-remote-access a");
    assert(remoteAccess.length === 2, "wizard offers two optional remote access approaches");
    const selectedHardwareMap = await desktop.$(".deployment-wizard .hardware-architecture-map");
    assert(selectedHardwareMap, "wizard renders the animated hardware communication map");
    const staticHardwareMaps = await desktop.$$(".deployment-architectures .hardware-architecture-map");
    assert(staticHardwareMaps.length === 4, "deployment references render a map for each profile");
    await desktop.waitForTimeout(300);
    for (const [index, graph] of staticHardwareMaps.entries()) {
      await graph.screenshot({ path: path.join(SHOT_DIR, `deploy-graph-${index + 1}-desktop.png`) });
    }
    const graphContents = await desktop.$$eval(".deployment-architectures .hardware-flow", (graphs) => graphs.map((graph) => graph.textContent || ""));
    assert(graphContents.every((content) => content.includes("PWA / mobile / MCP") && content.includes("Voice assistant (MCP)")), "each deployment graph includes clients and the MCP voice client");
    assert(graphContents[0]?.includes("Mock adapter") && graphContents[0]?.includes("Simulated devices"), "tryout graph presents simulated adapter data without home hardware");
    assert(graphContents.slice(1).every((content) => content.includes("Integrations") && content.includes("Core Devices")), "production deployment graphs identify integrations and core devices");
    assert(graphContents.slice(1).every((content) => content.includes("Zigbee edge") && content.includes("Matter / Thread")), "production deployment graphs present Zigbee and the future Matter path");
    assert(graphContents.filter((content) => content.includes("Cloud / remote")).length === 1, "only hybrid adds a cloud boundary");
    const hybridGraph = graphContents.find((content) => content.includes("Cloud Homenavi core"));
    assert(hybridGraph?.includes("SBC adapter host"), "hybrid graph keeps the core in cloud with adapters on the SBC");
    assert(hybridGraph?.includes("Client today; device role planned"), "hybrid graph distinguishes the current MCP voice client from the future device role");
    const verifiedProfiles = await desktop.$$eval(".deployment-architectures .hardware-architecture-map > header > span", (labels) => labels.map((label) => label.textContent));
    assert(verifiedProfiles.filter((label) => label === "Verified").length === 3 && verifiedProfiles.filter((label) => label === "In progress").length === 1, "deployment maps distinguish verified and in-progress profiles");
    const zigbeeMap = await desktop.$('.deployment-architectures .flow-entity:has-text("Zigbee edge")');
    assert(zigbeeMap, "deployment maps present Zigbee as a supported coordinator path");
    if (selectedHardwareMap) {
      await selectedHardwareMap.scrollIntoViewIfNeeded();
      const selectedFlow = await desktop.$(".deployment-wizard .hardware-flow");
      const graphBox = selectedFlow ? await selectedFlow.boundingBox() : null;
      const scrollBefore = await desktop.evaluate(() => window.scrollY);
      if (graphBox) {
        await desktop.mouse.move(graphBox.x + graphBox.width / 2, graphBox.y + graphBox.height / 2);
        await desktop.mouse.wheel(0, 360);
        await desktop.waitForTimeout(120);
      }
      const scrollAfter = await desktop.evaluate(() => window.scrollY);
      assert(scrollAfter > scrollBefore, "page scrolls while the pointer is over a deployment graph");
    }
    const downloadButton = await desktop.$('.wizard-download');
    assert(downloadButton, "wizard offers a Markdown setup-plan download");
    if (downloadButton) {
      const downloadPromise = desktop.waitForEvent("download");
      await downloadButton.click();
      const download = await downloadPromise;
      assert(download.suggestedFilename() === "homenavi-setup-plan.md", "wizard downloads the selected setup plan as Markdown");
    }
    const restartTryout = await desktop.$('.deployment-wizard button:has-text("Start over")');
    if (restartTryout) {
      await restartTryout.click();
      const tryoutOption = await desktop.$('.wizard-choice input[value="tryout"]');
      assert(tryoutOption, "wizard offers the local mock-adapter tryout");
      if (tryoutOption) await tryoutOption.click();
      for (let index = 0; index < 5; index++) {
        const next = await desktop.$('.deployment-wizard button:has-text("Continue")');
        if (next) await next.click();
      }
      const tryoutProfile = await desktop.$('.wizard-recommendation:has-text("Tryout with Compose and mock adapter")');
      const mockCommand = await desktop.$('.wizard-walkthrough code:has-text("--profile mock-adapter up -d")');
      assert(tryoutProfile && mockCommand, "tryout recommendation requires no device configuration and provides the mock-adapter command");
    }

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

    await desktop.goto(BASE + "/guides", { waitUntil: "networkidle" });
    const wizardGuide = await desktop.$('.guide-row-featured[href="/deploy"]');
    assert(wizardGuide, "guides index links to the deployment setup wizard");

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

    await mobile.goto(BASE + "/deploy", { waitUntil: "networkidle" });
    await mobile.waitForTimeout(300);
    const mobileGraphs = await mobile.$$(".deployment-architectures .hardware-architecture-map");
    for (const [index, graph] of mobileGraphs.entries()) {
      await graph.scrollIntoViewIfNeeded();
      await mobile.waitForTimeout(120);
      await graph.screenshot({ path: path.join(SHOT_DIR, `deploy-graph-${index + 1}-mobile.png`) });
    }

    for (const guidePath of ["/guides/quickstart", "/guides/deployment", "/guides/self-hosting", "/guides/integration-setup", "/guides/automations", "/guides/mcp", "/guides/troubleshooting"]) {
      await mobile.goto(BASE + guidePath, { waitUntil: "networkidle" });
      const guideOverflow = await mobile.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
      assert(!guideOverflow, `${guidePath} has no horizontal overflow on mobile`);
    }
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
