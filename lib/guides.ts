import fs from "fs";
import path from "path";
import { marked } from "marked";

const GUIDES_DIR = path.join(process.cwd(), "content", "guides");

export const GUIDE_SLUGS = [
  "quickstart",
  "self-hosting",
  "integration-setup",
  "automations",
  "mcp",
  "troubleshooting",
] as const;

export type GuideSlug = (typeof GUIDE_SLUGS)[number];

export interface Guide {
  slug: GuideSlug;
  title: string;
  html: string;
  sections: { text: string; id: string }[];
  readingMinutes: number;
}

const guideRenderer = new marked.Renderer();

// Guides are rendered with inner HTML, so raw HTML in Markdown is intentionally discarded.
guideRenderer.html = () => "";

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function renderGuideMarkdown(raw: string): Pick<Guide, "html" | "sections" | "readingMinutes"> {
  const sections: { text: string; id: string }[] = [];
  const withIds = raw.replace(/^(##)\s+(.+)$/gm, (_match, hash, text) => {
    const id = slugifyHeading(text);
    sections.push({ text: text.trim(), id });
    return `${hash} ${text.trim()}`;
  });
  const html = (marked.parse(withIds, { renderer: guideRenderer }) as string).replace(
    /<h2>(.*?)<\/h2>/g,
    (_match, text) => `<h2 id="${slugifyHeading(text)}">${text}</h2>`
  );
  const words = raw.split(/\s+/).filter(Boolean).length;

  return {
    html,
    sections,
    readingMinutes: Math.max(1, Math.round(words / 200)),
  };
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
  const titleMatch = raw.match(/^#\s+(.+)$/m);

  const rendered = renderGuideMarkdown(raw);

  return {
    slug: slug as GuideSlug,
    title: titleMatch ? titleMatch[1] : slug,
    ...rendered,
  };
}

export function listGuides(): { slug: GuideSlug; title: string }[] {
  return GUIDE_SLUGS.map((slug) => {
    const guide = loadGuide(slug);
    return { slug, title: guide?.title ?? slug };
  });
}
