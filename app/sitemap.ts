import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const BASE_URL = "https://www.homenavi.org";

const routes = [
  "",
  "/features",
  "/architecture",
  "/integrations",
  "/marketplace",
  "/demo",
  "/deploy",
  "/guides",
  "/guides/quickstart",
  "/guides/deployment",
  "/guides/self-hosting",
  "/guides/integration-setup",
  "/guides/automations",
  "/guides/mcp",
  "/guides/troubleshooting",
  "/about",
  "/community",
  "/changelog",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route.startsWith("/guides/") ? "monthly" : "weekly",
    priority: route === "" ? 1 : route === "/features" || route === "/architecture" ? 0.9 : 0.7,
  }));
}
