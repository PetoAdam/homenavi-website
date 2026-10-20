import fs from "fs";
import path from "path";
import { marked } from "marked";

const GUIDES_DIR = path.join(process.cwd(), "content", "guides");

export const GUIDE_SLUGS = [
  "quickstart",
  "self-hosting",
  "integration-setup",
  "automations",
  "troubleshooting",
] as const;

export type GuideSlug = (typeof GUIDE_SLUGS)[number];

export interface Guide {
  slug: GuideSlug;
  title: string;
  html: string;
}

export function loadGuide(slug: string): Guide | null {
  if (!GUIDE_SLUGS.includes(slug as GuideSlug)) return null;
  const file = path.join(GUIDES_DIR, `${slug}.md`);
  let raw: string;
  try {
    raw = fs.readFileSync(file, "utf8");
  } catch {
    return null;
  }
  const html = marked.parse(raw) as string;
  const titleMatch = raw.match(/^#\s+(.+)$/m);
  return {
    slug: slug as GuideSlug,
    title: titleMatch ? titleMatch[1] : slug,
    html,
  };
}

export function listGuides(): { slug: GuideSlug; title: string }[] {
  return GUIDE_SLUGS.map((slug) => {
    const guide = loadGuide(slug);
    return { slug, title: guide?.title ?? slug };
  });
}
