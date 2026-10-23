import { Metadata } from "next";
import { GlassCard, CodeBlock, ScreenshotFrame, Pill } from "../components/ui";
import { loadMarketplace, formatVersion } from "../../lib/marketplace";
import { capabilities } from "../../lib/integrations";

export const metadata: Metadata = {
  title: "Integrations",
  description:
    "Homenavi integrations are standalone services with a manifest. Declare widgets, device extensions, automations and auth, and the platform deploys them.",
};

const MANIFEST_EXAMPLE = `{
  "id": "homenavi-spotify",
  "name": "Spotify",
  "version": "1.4.2",
  "listen_path": "/spotify",
  "homepage": "https://spotify.homenavi.org",
  "widgets": [
    { "type": "now-playing", "name": "Now playing" },
    { "type": "playlist", "name": "Playlists" }
  ],
  "device_extension": true,
  "automation_extension": true,
  "auth": { "type": "oauth2", "provider": "spotify" },
  "ui": true,
  "deployment": {
    "compose": "compose/docker-compose.dev.yml",
    "helm": "helm/homenavi-spotify"
  }
}`;

const MANIFEST_FIELDS = [
  ["listen_path", "Where the integration is mounted inside the platform."],
  ["widgets", "Dashboard widgets the integration contributes, with types."],
  ["device_extension", "Adds real devices to the device hub, as HDP devices."],
  ["automation_extension", "Adds triggers and actions usable in automation workflows."],
  ["auth", "How the integration authenticates with the external service."],
  ["ui", "Whether the integration ships its own setup and configuration screens."],
  ["deployment", "Compose and Helm artifacts the proxy uses to deploy the service."],
];

export default async function IntegrationsPage() {
  const { integrations } = await loadMarketplace();

  return (
    <>
      <section className="section hero reveal">
        <div className="hero-copy">
          <p className="eyebrow">Integration layer</p>
          <h1 className="hero-title">
            Integrations are <span className="accent">services</span>, not plugins.
          </h1>
          <p className="hero-lede">
            An integration is a standalone service with a manifest. It declares the widgets it
            contributes, the devices it adds, the automations it can trigger, and how it
            authenticates. The integration proxy deploys it from your Compose or Helm artifacts and
            registers it with the platform.
          </p>
          <div className="hero-cta">
            <a className="btn primary" href="/marketplace">Browse the marketplace</a>
            <a
              className="btn secondary"
              href="https://github.com/PetoAdam/homenavi-integration-template"
              rel="external"
            >
              Integration template
            </a>
          </div>
          <div className="hero-meta">
            <span>{integrations.length} integrations registered</span>
            <span className="meta-sep" aria-hidden="true">/</span>
            <span>7 manifest contract fields</span>
            <span className="meta-sep" aria-hidden="true">/</span>
            <span>Compose · Helm targets</span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="manifest-panel">
            <div className="manifest-panel-head">
              <span className="eyebrow">Example manifest</span>
              <span className="manifest-panel-name">manifest/manifest.json</span>
            </div>
            <CodeBlock code={MANIFEST_EXAMPLE} />
          </div>
        </div>
      </section>

      <section className="section reveal">
        <h2 className="page-title">What the manifest declares</h2>
        <p className="page-subtitle">
          Every field in the manifest is a contract with the platform. The proxy reads it, the
          dashboard consumes it, and the marketplace publishes it.
        </p>
        <div className="field-table">
          <div className="field-row">
            <code>listen_path</code>
            <p>Where the integration is mounted inside the platform, and its public URL.</p>
          </div>
          <div className="field-row">
            <code>widgets</code>
            <p>Dashboard widgets the integration contributes, declared by type.</p>
          </div>
          <div className="field-row">
            <code>device_extension</code>
            <p>Adds real devices to the device hub as HDP devices, with state and commands.</p>
          </div>
          <div className="field-row">
            <code>automation_extension</code>
            <p>Adds triggers and actions that automation workflows can use.</p>
          </div>
          <div className="field-row">
            <code>auth</code>
            <p>How the integration authenticates with the external service.</p>
          </div>
          <div className="field-row">
            <code>ui</code>
            <p>Whether the integration ships its own setup and configuration screens.</p>
          </div>
          <div className="field-row">
            <code>deployment</code>
            <p>Compose and Helm artifacts the integration proxy uses to deploy the service.</p>
          </div>
        </div>
      </section>

      <section className="section reveal">
        <div className="feature-band">
          <div>
            <h2>Installed integrations appear as first-class features</h2>
            <p>
              Once an integration is installed, its widgets appear in the dashboard editor, its
              devices appear in the device list, and its automation actions appear in the workflow
              builder. There is no separate plugin panel to learn.
            </p>
            <div className="hero-cta">
              <a className="btn secondary" href="/features">See the feature tour</a>
            </div>
          </div>
          <ScreenshotFrame
            src="/screenshots/integrations-installed.png"
            alt="Installed integrations in the Homenavi dashboard"
          />
        </div>

        <div className="feature-band reverse">
          <ScreenshotFrame
            src="/screenshots/integrations-marketplace.png"
            alt="The Homenavi integration marketplace"
          />
          <div>
            <h2>The marketplace is the discovery surface</h2>
            <p>
              Verified integrations are published to the marketplace with their manifest, previews,
              publisher, and deployment artifacts. Install one from the marketplace and the proxy
              handles the rest.
            </p>
            <div className="hero-cta">
              <a className="btn secondary" href="/marketplace">Open the marketplace</a>
            </div>
          </div>
        </div>
      </section>

      <section className="section reveal">
        <h2 className="page-title">Registered integrations</h2>
        <p className="page-subtitle">
          Each entry links to its marketplace detail page with manifest, previews and install
          instructions.
        </p>
        <div className="integration-grid">
          {integrations.map((integration) => (
            <a
              key={integration.id}
              className="integration-card"
              href={`/marketplace/${integration.id}`}
            >
              <div className="integration-card-head">
                <h3>{integration.name}</h3>
                <div className="integration-badges">
                  {integration.verified && <Pill variant="success" label="Verified" />}
                  <Pill variant="primary" label={formatVersion(integration.version)} />
                </div>
              </div>
              <p className="card-desc">{integration.description}</p>
              <div className="integration-meta">
                <span>{integration.publisher}</span>
                <div className="caps">
                  {capabilities(integration).slice(0, 3).map((c) => (
                    <span key={c}>{c}</span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="section reveal">
        <div className="glass-card">
          <h2 className="page-title">Build your own integration</h2>
          <p className="page-subtitle">
            Start from the official template. It already wires the manifest, the proxy contract, the
            marketplace metadata, and the Compose and Helm artifacts.
          </p>
          <CodeBlock
            code={`git clone https://github.com/PetoAdam/homenavi-integration-template
cd homenavi-integration-template
npm install && npm run dev`}
          />
          <div className="hero-cta">
            <a className="btn primary" href="/guides/integration-setup">Integration guide</a>
            <a
              className="btn secondary"
              href="https://github.com/PetoAdam/homenavi-integration-template"
              rel="external"
            >
              Template repository
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
