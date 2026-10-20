import fs from "node:fs";
import path from "node:path";
import { Integration, normalize } from "./integrations";

export type { Integration } from "./integrations";
export { normalize, capabilities } from "./integrations";

export interface MarketplaceResult {
  integrations: Integration[];
  source: "live" | "cache";
  fetched_at: string;
}

const MARKETPLACE_URL = "https://marketplace.homenavi.org/api/integrations";

export async function loadMarketplace(): Promise<MarketplaceResult> {
  try {
    const res = await fetch(MARKETPLACE_URL, {
      next: { revalidate: 3600 },
      signal: new AbortController().signal,
    });
    if (!res.ok) throw new Error(`marketplace responded ${res.status}`);
    const json = await res.json();
    const integrations = normalize(json);
    if (!integrations.length) throw new Error("empty marketplace payload");
    return { integrations, source: "live", fetched_at: new Date().toISOString() };
  } catch (err) {
    // Graceful fallback: build-time cached snapshot so the site never depends
    // on the marketplace API being online.
    void err;
    try {
      const cachePath = path.join(process.cwd(), "data", "marketplace-cache.json");
      const cache = JSON.parse(fs.readFileSync(cachePath, "utf8"));
      return {
        integrations: normalize(cache),
        source: "cache",
        fetched_at: new Date().toISOString(),
      };
    } catch {
      return { integrations: [], source: "cache", fetched_at: new Date().toISOString() };
    }
  }
}
