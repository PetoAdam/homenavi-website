import { Metadata } from "next";
import { GlassCard, Pill } from "../components/ui";
import { loadMarketplace, formatVersion } from "../../lib/marketplace";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Recent releases across Homenavi and its integrations.",
};

export default async function ChangelogPage() {
  const { integrations, source } = await loadMarketplace();

  const entries = integrations
    .filter((i) => i.updated_at || i.created_at || i.version)
    .sort((a, b) => {
      const aDate = a.updated_at || a.created_at || "";
      const bDate = b.updated_at || b.created_at || "";
      return bDate < aDate ? -1 : 1;
    })
    .map((i) => ({
      name: i.name,
      version: i.version,
      date: i.updated_at || i.created_at,
      description: i.description,
      publisher: i.publisher,
    }));

  return (
    <>
      <section className="section hero reveal">
        <div className="hero-copy">
          <p className="eyebrow">Release feed</p>
          <h1 className="hero-title">
            What shipped <span className="accent">across the ecosystem</span>.
          </h1>
          <p className="hero-lede">
            Every integration publishes its own releases. This feed collects them in one place so you
            can see what is new in the platform and its marketplace.
          </p>
          <div className="hero-cta">
            <a className="btn primary" href="/marketplace">Browse the marketplace</a>
            <a className="btn secondary" href="/guides/integration-setup">
              Publish your own
            </a>
          </div>
          <div className="hero-meta">
            <span>{entries.length} tracked releases</span>
            <span className="meta-sep" aria-hidden="true">/</span>
            <span>per-service versioning</span>
            <span className="meta-sep" aria-hidden="true">/</span>
            <span>live marketplace feed</span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="demo-status-card">
            <div className="demo-status-head">
              <p className="eyebrow">Data source</p>
              <Pill variant={source === "live" ? "success" : "warning"} label={source === "live" ? "Live" : "Cached"} />
            </div>
            <p className="demo-status-note">
              {source === "live"
                ? "Release data is fetched live from the marketplace API."
                : "Showing cached marketplace data."}
            </p>
            <div className="arch-diagram">
              <div className="arch-node core">
                <strong>marketplace API</strong>
                integration registry
              </div>
              <div className="arch-node">
                <strong>integration repos</strong>
                release manifests
              </div>
              <div className="arch-node">
                <strong>this page</strong>
                sorted release feed
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section reveal">
        <h2 className="page-title">Latest releases</h2>
        <div className="changelog-list">
          {entries.map((entry) => (
            <div className="changelog-entry" key={`${entry.name}-${entry.version}`}>
              <div className="changelog-date">
                {entry.date ? new Date(entry.date).toLocaleDateString() : "—"}
              </div>
              <div>
                <div className="integration-card-head">
                  <h3>{entry.name}</h3>
                  <div className="integration-badges">
                    <Pill variant="primary" label={formatVersion(entry.version)} />
                  </div>
                </div>
                <p className="card-desc">{entry.description}</p>
                <p className="integration-publisher">{entry.publisher}</p>
              </div>
            </div>
          ))}
        </div>
        {entries.length === 0 && (
          <GlassCard>
            <p className="card-desc">No releases available right now.</p>
          </GlassCard>
        )}
      </section>
    </>
  );
}
