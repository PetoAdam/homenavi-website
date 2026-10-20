import { Metadata } from "next";
import { PageHeader, GlassCard, Pill } from "../components/ui";
import { loadMarketplace } from "../../lib/marketplace";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Recent releases across Homenavi and its integrations.",
};

export default async function ChangelogPage() {
  const { integrations, source } = await loadMarketplace();

  const entries = integrations
    .filter((i) => i.updated_at || i.created_at || i.version)
    .map((i) => ({
      name: i.name,
      version: i.version,
      date: i.updated_at || i.created_at,
      description: i.description,
    }));

  return (
    <>
      <section className="section">
        <PageHeader
          title="Changelog"
          subtitle="Latest releases from the Homenavi platform and integration ecosystem."
        />
        <div className="marketplace-source">
          {source === "live"
            ? "Release data is fetched live from the marketplace API."
            : "Showing cached marketplace data."}
        </div>
        <div className="grid cols-2">
          {entries.map((entry) => (
            <GlassCard key={`${entry.name}-${entry.version}`}>
              <div className="integration-card-head">
                <h3 className="card-title">{entry.name}</h3>
                <Pill variant="primary" label={`v${entry.version}`} />
              </div>
              <p className="card-desc">{entry.description}</p>
              {entry.date && (
                <p className="integration-publisher">
                  Updated {new Date(entry.date).toLocaleDateString()}
                </p>
              )}
            </GlassCard>
          ))}
        </div>
      </section>
    </>
  );
}
