import { Metadata } from "next";
import { PageHeader } from "../components/ui";
import { GUIDE_SLUGS, loadGuide } from "../../lib/guides";

export const metadata: Metadata = {
  title: "Guides",
  description: "Quickstart, self-hosting, integration setup, automations, and troubleshooting guides for Homenavi.",
  alternates: { canonical: "/guides" },
};

const descriptions: Record<string, string> = {
  quickstart: "Run Homenavi locally with Docker Compose in minutes.",
  deployment: "Choose a supported deployment profile, hardware path, and verified setup steps.",
  "self-hosting": "Deploy Homenavi on your own infrastructure with Compose or Helm.",
  "integration-setup": "Install, run, and extend integrations in the Homenavi runtime.",
  automations: "Build workflow automations with triggers, branches, and device actions.",
  mcp: "Connect a compatible assistant through Homenavi's scoped MCP endpoint.",
  troubleshooting: "Fix common deployment, MQTT, auth, and integration issues.",
};

export default function GuidesPage() {
  const guides = GUIDE_SLUGS.map((slug) => {
    const guide = loadGuide(slug);
    return {
      slug,
      title: guide?.title ?? slug,
      sections: guide?.sections.length ?? 0,
      readingMinutes: guide?.readingMinutes ?? 1,
    };
  });

  return (
    <>
      <section className="section">
        <PageHeader
          title="Guides"
          subtitle="Everything you need to run, extend, and debug Homenavi."
        />
        <div className="guide-list">
          <a className="guide-row guide-row-featured" href="/deploy">
            <div>
              <h3>Deployment setup wizard</h3>
              <p className="card-desc">Choose a supported profile, see the hardware communication map, and download a setup plan.</p>
            </div>
            <div className="guide-row-meta"><span>Interactive</span><span>Start planning</span></div>
          </a>
          {guides.map((g) => (
            <a key={g.slug} className="guide-row" href={`/guides/${g.slug}`}>
              <div>
                <h3>{g.title}</h3>
                <p className="card-desc">{descriptions[g.slug] ?? `Guide: ${g.title}`}</p>
              </div>
              <div className="guide-row-meta">
                <span>{g.sections} sections</span>
                <span>{g.readingMinutes} min read</span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
