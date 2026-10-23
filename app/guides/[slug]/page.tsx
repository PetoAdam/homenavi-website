import { Metadata } from "next";
import { notFound } from "next/navigation";
import { GUIDE_SLUGS, loadGuide } from "@/lib/guides";

export function generateStaticParams() {
  return GUIDE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = loadGuide(slug);
  if (!guide) return { title: "Guide not found" };
  return {
    title: guide.title,
    description: `Homenavi guide: ${guide.title}`,
    alternates: { canonical: `/guides/${slug}` },
  };
}

export default async function GuideDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = loadGuide(slug);

  if (!guide) notFound();

  const index = GUIDE_SLUGS.indexOf(slug as (typeof GUIDE_SLUGS)[number]);
  const nextSlug = index >= 0 && index < GUIDE_SLUGS.length - 1 ? GUIDE_SLUGS[index + 1] : null;
  const nextGuide = nextSlug ? loadGuide(nextSlug) : null;

  return (
    <>
      <section className="section guide-layout">
        <aside className="guide-toc" aria-label="Table of contents">
          <p className="eyebrow">On this page</p>
          <ul>
            {guide.sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`}>{s.text}</a>
              </li>
            ))}
          </ul>
          <div className="guide-meta">
            <span>{guide.sections.length} sections</span>
            <span>{guide.readingMinutes} min read</span>
          </div>
        </aside>

        <div className="guide-main">
          <div className="guide-content">
            <div dangerouslySetInnerHTML={{ __html: guide.html }} />
          </div>

          <div className="guide-next">
            {nextGuide ? (
              <a className="btn secondary" href={`/guides/${nextGuide.slug}`}>
                Next guide: {nextGuide.title} →
              </a>
            ) : (
              <a className="btn secondary" href="/guides">All guides</a>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
