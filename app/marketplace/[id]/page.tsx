import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GlassCard, CodeBlock, ScreenshotFrame, Pill } from "@/app/components/ui";
import { loadMarketplace, capabilities, formatVersion } from "@/lib/marketplace";

export async function generateStaticParams() {
  const { integrations } = await loadMarketplace();
  return integrations.map((i) => ({ id: i.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const { integrations } = await loadMarketplace();
  const integration = integrations.find((item) => item.id === id);

  if (!integration) return { title: "Integration not found" };

  return {
    title: `${integration.name} integration`,
    description: integration.description,
    alternates: { canonical: `/marketplace/${integration.id}` },
  };
}

export default async function MarketplaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { integrations } = await loadMarketplace();
  const integration = integrations.find((i) => i.id === id);

  if (!integration) notFound();

  const artifacts = integration.deployment_artifacts ?? {};
  const installLines: string[] = [];
  if (artifacts.compose?.file) installLines.push(`docker compose -f ${artifacts.compose.file} up -d`);
  if (artifacts.helm?.chart_ref) {
    installLines.push(
      `helm upgrade --install ${integration.id} ${artifacts.helm.chart_ref}${artifacts.helm.version ? ` --version ${artifacts.helm.version}` : ""}`
    );
  }

  const caps = capabilities(integration);

  return (
    <>
      <section className="section integration-detail">
        <header className="page-header integration-identity">
              {integration.assets?.icon ? (
            <img className="integration-icon" src={integration.assets.icon} alt={`${integration.name} icon`} />
          ) : (
            <div className="integration-icon fallback">{integration.name.charAt(0)}</div>
          )}
          <div className="integration-identity-copy">
            <div className="integration-badges">
              {integration.verified && <Pill variant="success" label="Verified" />}
              {integration.featured && <Pill variant="primary" label="Featured" />}
              {integration.trending_score > 0 && <Pill variant="warning" label="Trending" />}
            </div>
            <h1 className="page-title">{integration.name}</h1>
            <p className="page-subtitle">{integration.description}</p>
            <p className="integration-meta-line">
              <span>{integration.publisher}</span>
              <span>{formatVersion(integration.version)}</span>
              <span>{integration.downloads} installs</span>
            </p>
          </div>
        </header>

        <div className="integration-capability-strip">
          {caps.map((c) => (
            <span key={c} className="capability-tag">{c}</span>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="feature-band">
          <div>
            <h2 className="card-title">What it connects</h2>
            <p className="card-desc">
              {integration.description} The integration registers devices on the Homenavi device hub,
              exposes dashboard widgets, and plugs into the automation engine.
            </p>
            <div className="hero-cta">
              {integration.homepage ? (
                <a className="btn secondary" href={integration.homepage} rel="external">Open integration</a>
              ) : null}
              {integration.repo_url ? (
                <a className="btn ghost" href={integration.repo_url} rel="external">Repository</a>
              ) : null}
            </div>
          </div>
          {integration.images?.length ? (
            <ScreenshotFrame src={integration.images[0]} alt={`${integration.name} screenshot`} />
          ) : null}
        </div>
      </section>

      {integration.images && integration.images.length > 1 ? (
        <section className="section">
          <h2 className="page-title">More previews</h2>
          <div className="grid cols-2">
            {integration.images.slice(1).map((img) => (
              <ScreenshotFrame key={img} src={img} alt={`${integration.name} screenshot`} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="section">
        <div className="grid cols-2">
          <div className="glass-card">
            <h3 className="card-title">Capabilities</h3>
            <div className="integration-badges">
              {caps.map((c) => <Pill key={c} label={c} />)}
            </div>
            {integration.manifest?.widgets?.length ? (
              <p className="card-desc">
                Dashboard widgets: {integration.manifest.widgets.map((w) => w.name || w.type).join(", ")}
              </p>
            ) : null}
          </div>

          <div className="glass-card">
            <h3 className="card-title">Install readiness</h3>
            {installLines.length ? (
              <CodeBlock code={installLines.join("\n")} />
            ) : (
              <p className="card-desc">Install this integration from the marketplace inside the Homenavi app.</p>
            )}
            <div className="hero-cta">
              <a className="btn secondary" href="/guides/integration-setup">Setup guide</a>
              <a className="btn ghost" href="/guides/troubleshooting">Troubleshooting</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
