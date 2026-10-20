import { PageHeader, GlassCard, CodeBlock } from "../components/ui";
import { loadMarketplace, capabilities } from "../../lib/marketplace";

export default async function IntegrationsPage() {
  const marketplace = await loadMarketplace();

  return (
    <>
      <section className="section">
        <PageHeader
          title="Integrations"
          subtitle="Extend Homenavi with device support, dashboards, and automations from the community."
        />
      </section>

      <section className="section">
        <div className="grid cols-3">
          {marketplace.integrations.map((i) => (
            <a key={i.id} className="integration-card" href={`/marketplace/${i.id}`}>
              <div className="integration-card-head">
                <h3>{i.name}</h3>
                <span className="pill neutral">v{i.version}</span>
              </div>
              <p className="card-desc">{i.description}</p>
              <div className="integration-badges">
                {i.verified && <span className="pill success">Verified</span>}
                {capabilities(i).slice(0, 2).map((c) => (
                  <span key={c} className="pill">{c}</span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="glass-card">
          <h3 className="card-title">Build your own integration</h3>
          <p className="card-desc">
            Homenavi integrations are containers with a manifest. The integration template repo
            gives you a working scaffold: Go service, manifest, widget assets, Helm chart, and
            marketplace publishing hooks.
          </p>
          <CodeBlock
            code={`git clone https://github.com/PetoAdam/homenavi-integration-template
cd homenavi-integration-template
docker compose -f compose/docker-compose.dev.yml up`}
          />
          <div className="hero-cta">
            <a className="btn secondary" href="/guides/integration-setup">Integration setup guide</a>
            <a className="btn ghost" href="https://github.com/PetoAdam/homenavi-integration-template" rel="external">
              Template repository
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
