import { notFound } from "next/navigation";
import { PageHeader, GlassCard, CodeBlock, ScreenshotFrame, Pill } from "@/app/components/ui";
import { loadMarketplace, capabilities } from "@/lib/marketplace";

export async function generateStaticParams() {
  const { integrations } = await loadMarketplace();
  return integrations.map((i) => ({ id: i.id }));
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

  return (
    <>
      <section className="section">
        <PageHeader title={integration.name} subtitle={integration.description} />
        <div className="integration-badges">
          {integration.verified && <Pill variant="success" label="Verified" />}
          {integration.featured && <Pill variant="primary" label="Featured" />}
          {integration.trending_score > 0 && <Pill variant="warning" label="Trending" />}
          <Pill label={`v${integration.version}`} />
          <Pill label={`${integration.downloads} installs`} />
        </div>
      </section>

      <section className="section">
        <div className="grid cols-2">
          <div className="glass-card">
            <h3 className="card-title">Overview</h3>
            <p className="card-desc">{integration.description}</p>
            <p className="integration-publisher">
              Published by {integration.publisher}
              {integration.repo_url ? (
                <> · <a href={integration.repo_url} rel="external">Repository</a></>
              ) : null}
            </p>
          </div>
          {integration.assets?.icon ? (
            <ScreenshotFrame src={integration.assets.icon} alt={`${integration.name} icon`} />
          ) : null}
        </div>
      </section>

      {integration.images?.length ? (
        <section className="section">
          <h2 className="page-title">Screenshots</h2>
          <div className="grid cols-2">
            {integration.images.map((img) => (
              <ScreenshotFrame key={img} src={img} alt={`${integration.name} screenshot`} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="section">
        <div className="glass-card">
          <h3 className="card-title">Capabilities</h3>
          <div className="integration-badges">
            {capabilities(integration).map((c) => <Pill key={c} label={c} />)}
          </div>
          {integration.manifest?.widgets?.length ? (
            <p className="card-desc">
              Widgets: {integration.manifest.widgets.map((w) => w.type).join(", ")}
            </p>
          ) : null}
        </div>
      </section>

      <section className="section">
        <div className="glass-card">
          <h3 className="card-title">Install path</h3>
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
      </section>
    </>
  );
}
