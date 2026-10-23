// Pure marketplace data helpers — no Node APIs, safe for client components.

export interface Integration {
  id: string;
  name: string;
  version: string;
  description: string;
  publisher: string;
  verified: boolean;
  featured: boolean;
  trending_score: number;
  downloads: number;
  repo_url?: string;
  homepage?: string;
  listen_path?: string;
  release_tag?: string;
  created_at?: string;
  updated_at?: string;
  assets?: { icon?: string };
  images?: string[];
  manifest?: {
    homepage?: string;
    widgets?: { type: string; name?: string }[];
    device_extension?: boolean;
    automation_extension?: boolean;
    auth?: boolean;
    ui?: boolean;
  };
  deployment_artifacts?: {
    compose?: { file?: string };
    helm?: { chart_ref?: string; version?: string };
  };
}

export function normalize(raw: unknown): Integration[] {
  if (!raw) return [];
  const list = Array.isArray(raw) ? raw : (raw as { integrations?: unknown[] }).integrations ?? [];
  return list
    .filter((i): i is Integration => !!i && typeof (i as Integration).id === "string")
    .map((i) => ({
      id: String(i.id),
      name: String(i.name ?? i.id),
      version: String(i.version ?? ""),
      description: String(i.description ?? ""),
      publisher: String(i.publisher ?? "Homenavi Community"),
      verified: Boolean(i.verified),
      featured: Boolean(i.featured),
      trending_score: Number(i.trending_score ?? 0),
      downloads: Number(i.downloads ?? 0),
      repo_url: i.repo_url,
      homepage: i.manifest?.homepage ?? i.homepage,
      listen_path: i.listen_path,
      release_tag: i.release_tag,
      created_at: i.created_at,
      updated_at: i.updated_at,
      assets: i.assets,
      images: i.images ?? [],
      manifest: i.manifest,
      deployment_artifacts: i.deployment_artifacts,
    }));
}

// Some marketplace feeds return versions already prefixed with "v" (e.g. "v0.1.5"),
// others return bare semver ("1.4.2"). Normalize so renderers never emit "vv1.0.0".
export function formatVersion(version: string): string {
  const v = String(version ?? "").trim();
  if (!v) return "";
  return v.startsWith("v") || v.startsWith("V") ? v : `v${v}`;
}

export function capabilities(i: Integration): string[] {
  const caps: string[] = [];
  if (i.manifest?.device_extension) caps.push("Device support");
  if (i.manifest?.automation_extension) caps.push("Automations");
  if (i.manifest?.widgets?.length) caps.push("Dashboard widgets");
  if (i.manifest?.auth) caps.push("Account auth");
  if (i.manifest?.ui) caps.push("Setup UI");
  return caps;
}
