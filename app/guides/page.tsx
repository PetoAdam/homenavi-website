import { Metadata } from "next";
import { PageHeader, GlassCard } from "../components/ui";
import { listGuides } from "../../lib/guides";

export const metadata: Metadata = {
  title: "Guides",
  description: "Quickstart, self-hosting, integration setup, automations, and troubleshooting guides for Homenavi.",
};

const descriptions: Record<string, string> = {
  quickstart: "Run Homenavi locally with Docker Compose in minutes.",
  "self-hosting": "Deploy Homenavi on your own infrastructure with Compose or Helm.",
  "integration-setup": "Install, run, and extend integrations in the Homenavi runtime.",
  automations: "Build workflow automations with triggers, branches, and device actions.",
  troubleshooting: "Fix common deployment, MQTT, auth, and integration issues.",
};

export default function GuidesPage() {
  const guides = listGuides();

  return (
    <>
      <section className="section">
        <PageHeader
          title="Guides"
          subtitle="Everything you need to run, extend, and debug Homenavi."
        />
        <div className="grid cols-2">
          {guides.map((g) => (
            <GlassCard key={g.slug}>
              <h3 className="card-title">{g.title}</h3>
              <p className="card-desc">{descriptions[g.slug] ?? `Guide: ${g.title}`}</p>
              <div className="hero-cta">
                <a className="btn secondary" href={`/guides/${g.slug}`}>Read guide</a>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>
    </>
  );
}
