import { describe, it, expect } from "vitest";
import { normalize, capabilities, Integration } from "../lib/marketplace";
import { loadGuide, listGuides, GUIDE_SLUGS, renderGuideMarkdown } from "../lib/guides";
import { DEMO_URL } from "../lib/demo";
import { DEFAULT_ANSWERS, getRecommendation, chooseProfile, renderSetupPlanMarkdown } from "../lib/deployment";

describe("marketplace normalize", () => {
  it("returns an empty array for null/undefined input", () => {
    expect(normalize(null)).toEqual([]);
    expect(normalize(undefined)).toEqual([]);
  });

  it("accepts a bare array payload", () => {
    const raw = [
      { id: "spotify", name: "Spotify", version: "1.0.9", verified: true },
    ];
    const out = normalize(raw);
    expect(out).toHaveLength(1);
    expect(out[0].id).toBe("spotify");
    expect(out[0].name).toBe("Spotify");
    expect(out[0].publisher).toBe("Homenavi Community");
    expect(out[0].images).toEqual([]);
  });

  it("accepts an object with an integrations key", () => {
    const raw = { integrations: [{ id: "connector" }] };
    const out = normalize(raw);
    expect(out).toHaveLength(1);
    expect(out[0].id).toBe("connector");
  });

  it("drops entries without a string id", () => {
    const raw = [{ id: 123 }, { name: "no id" }, { id: "ok" }];
    const out = normalize(raw);
    expect(out).toHaveLength(1);
    expect(out[0].id).toBe("ok");
  });

  it("coerces missing numeric fields to 0 and booleans to false", () => {
    const out = normalize([{ id: "x" }]);
    expect(out[0].verified).toBe(false);
    expect(out[0].trending_score).toBe(0);
    expect(out[0].downloads).toBe(0);
    expect(out[0].version).toBe("");
  });
});

describe("capabilities", () => {
  const make = (manifest: Integration["manifest"]): Integration => ({
    id: "test",
    name: "Test",
    version: "1.0.0",
    description: "",
    publisher: "Homenavi Community",
    verified: false,
    featured: false,
    trending_score: 0,
    downloads: 0,
    manifest,
  });

  it("derives capability labels from manifest flags", () => {
    const caps = capabilities(
      make({
        device_extension: true,
        automation_extension: true,
        widgets: [{ type: "integration.test.overview" }],
        auth: true,
        ui: true,
      })
    );
    expect(caps).toEqual([
      "Device support",
      "Automations",
      "Dashboard widgets",
      "Account auth",
      "Setup UI",
    ]);
  });

  it("returns an empty list when the manifest is missing", () => {
    expect(capabilities(make(undefined))).toEqual([]);
  });

  it("does not report widgets for an empty widget array", () => {
    expect(capabilities(make({ widgets: [] }))).toEqual([]);
  });
});

describe("guides", () => {
  it("exposes the planned guide slugs", () => {
    expect([...GUIDE_SLUGS]).toEqual([
      "quickstart",
      "deployment",
      "self-hosting",
      "integration-setup",
      "automations",
      "mcp",
      "troubleshooting",
    ]);
  });

  it("loads every guide with a title and html body", () => {
    for (const slug of GUIDE_SLUGS) {
      const guide = loadGuide(slug);
      expect(guide, `guide ${slug} should exist`).not.toBeNull();
      expect(guide!.title.length).toBeGreaterThan(0);
      expect(guide!.html).toContain("<h1");
    }
  });

  it("returns null for an unknown slug", () => {
    expect(loadGuide("does-not-exist")).toBeNull();
  });

  it("lists guides with resolved titles", () => {
    const list = listGuides();
    expect(list).toHaveLength(GUIDE_SLUGS.length);
    expect(list.every((g) => g.title.length > 0)).toBe(true);
  });

  it("strips raw HTML before guide content reaches the page", () => {
    const rendered = renderGuideMarkdown("# Safe guide\n\n<script>alert('xss')</script>\n\n## Overview");
    expect(rendered.html).not.toContain("<script");
    expect(rendered.sections).toEqual([{ text: "Overview", id: "overview" }]);
  });
});

describe("deployment recommendations", () => {
  it("reuses an existing local server for the self-hosted path", () => {
    const recommendation = getRecommendation(DEFAULT_ANSWERS);
    expect(recommendation.profile.id).toBe("compose");
    expect(recommendation.requiredHardware.join(" ")).toContain("selected existing host");
    expect(recommendation.requiredHardware.join(" ")).not.toContain("buy");
  });

  it("does not require a separate gateway for hybrid hosting", () => {
    const recommendation = getRecommendation({ ...DEFAULT_ANSWERS, hosting: "hybrid" });
    expect(recommendation.profile.id).toBe("hybrid");
    expect(recommendation.requiredHardware.join(" ")).toContain("optional");
  });

  it("includes the coordinator and supported integration path for Zigbee", () => {
    const recommendation = getRecommendation({ ...DEFAULT_ANSWERS, connectivity: ["zigbee"] });
    expect(recommendation.requiredHardware.join(" ")).toContain("Zigbee coordinator");
    expect(recommendation.services.join(" ")).toContain("Zigbee2MQTT");
    expect(recommendation.hardwareRecommendations.find((item) => item.name === "Compatible Zigbee coordinator")?.reason).toContain("Prefer Ethernet or Wi-Fi coordinators over USB");
    expect(recommendation.hardwareRecommendations.find((item) => item.name === "Compatible Zigbee coordinator")?.reason).toContain("SLZB-MR3U");
    expect(recommendation.hardwareRecommendations.find((item) => item.role === "Topology")?.name).toBe("No separate edge node for a local deployment");
  });

  it("does not present Thread as a complete Matter installation", () => {
    const recommendation = getRecommendation({ ...DEFAULT_ANSWERS, connectivity: ["matter-thread"] });
    expect(recommendation.limitations.join(" ")).toContain("not a complete Matter controller");
    expect(recommendation.limitations.join(" ")).toContain("no validated Thread Border Router");
  });

  it("explains additional local compute for offline voice", () => {
    const recommendation = getRecommendation({ ...DEFAULT_ANSWERS, voice: "offline" });
    expect(recommendation.optionalHardware.join(" ")).toContain("CPU, memory, storage");
  });

  it("offers advanced homelab as a standard hosting option", () => {
    expect(chooseProfile({ ...DEFAULT_ANSWERS, hosting: "homelab" }).id).toBe("kubernetes");
  });

  it("uses the mock-adapter profile for a local tryout", () => {
    const recommendation = getRecommendation({ ...DEFAULT_ANSWERS, hosting: "tryout", hardware: "none", connectivity: ["unsure"] });
    expect(recommendation.profile.id).toBe("tryout");
    expect(recommendation.services.join(" ")).toContain("Mock adapter");
    expect(recommendation.walkthrough.map((item) => item.command).join(" ")).toContain("--profile mock-adapter up -d");
  });

  it("renders the selected plan as reusable Markdown", () => {
    const markdown = renderSetupPlanMarkdown({ ...DEFAULT_ANSWERS, connectivity: ["zigbee"] });
    expect(markdown).toContain("# Homenavi setup plan");
    expect(markdown).toContain("Compatible Zigbee coordinator");
    expect(markdown).toContain("Optional remote access");
    expect(markdown).toContain("Cloudflare Tunnel");
    expect(markdown).toContain("Core compute");
    expect(markdown).toContain("docker compose up -d");
  });
});

describe("demo", () => {
  it("uses the documented demo URL", () => {
    expect(DEMO_URL).toBe("https://demo.homenavi.org");
  });
});
