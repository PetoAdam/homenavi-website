import { describe, it, expect } from "vitest";
import { normalize, capabilities, Integration } from "../lib/marketplace";
import { loadGuide, listGuides, GUIDE_SLUGS } from "../lib/guides";
import { DEMO_URL } from "../lib/demo";

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
  it("exposes the five planned guide slugs", () => {
    expect([...GUIDE_SLUGS]).toEqual([
      "quickstart",
      "self-hosting",
      "integration-setup",
      "automations",
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
});

describe("demo", () => {
  it("uses the documented demo URL", () => {
    expect(DEMO_URL).toBe("https://demo.homenavi.org");
  });
});
