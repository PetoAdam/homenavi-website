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
  return { title: guide.title, description: `Homenavi guide: ${guide.title}` };
}

export default async function GuideDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = loadGuide(slug);

  if (!guide) notFound();

  return (
    <>
      <section className="section">
        <div className="glass-card guide-content">
          <div dangerouslySetInnerHTML={{ __html: guide.html }} />
        </div>
        <div className="hero-cta" style={{ marginTop: "1rem" }}>
          <a className="btn ghost" href="/guides">All guides</a>
        </div>
      </section>
    </>
  );
}
