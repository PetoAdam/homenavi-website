import { GlassCard, CodeBlock, ScreenshotFrame, Pill } from "./components/ui";
import { loadMarketplace } from "../lib/marketplace";
import { checkDemoStatus } from "../lib/demo";

export default async function HomePage() {
  const marketplace = await loadMarketplace();
  const demo = await checkDemoStatus();

  return (
    <>
      {/* Hero */}
      <section className="section">
        <div className="glass-card hero">
          <p className="eyebrow">Self-hostable · Open source · Realtime</p>
          <h1>Your smart home, on your terms.</h1>
          <p className="card-desc">
            Homenavi combines realtime device control, dashboards, automation, and an
            integration marketplace in one self-hostable platform.
          </p>
          <div className="hero-cta">
            <a className="btn" href="/demo">Try the live demo</a>
            <a className="btn secondary" href="/guides/self-hosting">View deployment guide</a>
            <a className="btn ghost" href="/integrations">Browse integrations</a>
            <a className="btn ghost" href="/guides">Read the guides</a>
          </div>
        </div>
      </section>

      {/* Screenshot montage */}
      <section className="section">
        <div className="grid cols-2">
          <ScreenshotFrame src="/screenshots/dashboard.png" alt="Homenavi dashboard with weather and device widgets" />
          <ScreenshotFrame src="/screenshots/devices.png" alt="Device inventory in the Homenavi app" />
        </div>
      </section>

      {/* Value blocks */}
      <section className="section">
        <h2 className="page-title">What Homenavi does</h2>
        <div className="grid cols-4">
          <div className="glass-card">
            <h3 className="card-title">Realtime control</h3>
            <p className="card-desc">Devices stream state over the MQTT/HDP realtime plane, so lights, blinds, climate, and media respond instantly.</p>
          </div>
          <div className="glass-card">
            <h3 className="card-title">Visual dashboards</h3>
            <p className="card-desc">Compose widgets, resize them, and build a home overview that matches how you actually use your devices.</p>
          </div>
          <div className="glass-card">
            <h3 className="card-title">Automation workflows</h3>
            <p className="card-desc">Chain triggers and actions into workflows, from sensor-driven scenes to integration-powered routines.</p>
          </div>
          <div className="glass-card">
            <h3 className="card-title">Integration marketplace</h3>
            <p className="card-desc">Extend the platform with verified community integrations — Spotify, LG ThinQ, eModul, Motionblinds and more.</p>
          </div>
        </div>
      </section>

      {/* Proof section */}
      <section className="section">
        <h2 className="page-title">Built on a real platform</h2>
        <div className="grid cols-2">
          <div className="glass-card">
            <h3 className="card-title">Microservice architecture</h3>
            <p className="card-desc">API gateway, auth, device hub, dashboard service, automation service, and integration proxy — each deployable independently.</p>
          </div>
          <div className="glass-card">
            <h3 className="card-title">Realtime MQTT/HDP plane</h3>
            <p className="card-desc">EMQX-backed messaging with the Homenavi Device Protocol keeps device state consistent across the app.</p>
          </div>
          <div className="glass-card">
            <h3 className="card-title">Docker and Kubernetes paths</h3>
            <p className="card-desc">Run the full stack with Docker Compose in minutes, or deploy to Kubernetes with the official Helm chart.</p>
          </div>
          <div className="glass-card">
            <h3 className="card-title">Integration runtime & marketplace</h3>
            <p className="card-desc">Integrations ship as containers with manifests, widgets, and automation extensions, published through the marketplace.</p>
          </div>
        </div>
      </section>

      {/* Demo strip */}
      <section className="section">
        <div className="glass-card">
          <h3 className="card-title">Try it live — no setup</h3>
          <p className="card-desc">
            The hosted demo lets you explore the app immediately. Some actions are disabled and
            sessions are temporary, so it is ideal for evaluation rather than long-term use.
          </p>
          {demo.reachable ? (
            <p className="pill success">Demo available</p>
          ) : (
            <p className="pill warning">Demo currently unreachable — explore screenshots below</p>
          )}
          <div className="hero-cta">
            <a className="btn" href="/demo">Open the demo page</a>
          </div>
        </div>
      </section>

      {/* Self-hosting strip */}
      <section className="section">
        <div className="glass-card">
          <h3 className="card-title">Self-hosting quickstart</h3>
          <p className="card-desc">Get the full stack running locally with Docker Compose:</p>
          <CodeBlock
            code={`git clone https://github.com/PetoAdam/homenavi
cd homenavi
cp .env.example .env
docker compose pull
docker compose up -d`}
          />
          <p className="card-desc">Or deploy to Kubernetes:</p>
          <CodeBlock
            code={`helm upgrade --install homenavi ./helm/homenavi -n homenavi --create-namespace`}
          />
          <div className="hero-cta">
            <a className="btn secondary" href="/guides/self-hosting">Full deployment guide</a>
          </div>
        </div>
      </section>

      {/* Marketplace spotlight */}
      <section className="section">
        <h2 className="page-title">Marketplace spotlight</h2>
        <div className="grid cols-3">
          {marketplace.integrations.slice(0, 3).map((i) => (
            <a className="integration-card" href={`/marketplace/${i.id}`} key={i.id}>
              <div className="integration-card-head">
                <h3>{i.name}</h3>
                <span className="pill neutral">v{i.version}</span>
              </div>
              <p className="card-desc">{i.description}</p>
              <div className="integration-badges">
                {i.verified && <Pill variant="success" label="Verified" />}
                {i.trending_score > 0 && <Pill variant="warning" label="Trending" />}
              </div>
            </a>
          ))}
        </div>
        <div className="hero-cta">
          <a className="btn secondary" href="/marketplace">Browse all integrations</a>
        </div>
      </section>
    </>
  );
}
