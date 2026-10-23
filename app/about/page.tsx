import { Metadata } from "next";
import { GlassCard, CodeBlock, ScreenshotFrame } from "../components/ui";

export const metadata: Metadata = {
  title: "About",
  description: "How Homenavi works: microservice core, realtime MQTT/HDP plane, and integrations.",
};

const SERVICES = [
  { name: "API Gateway", role: "Single entrypoint, authentication, rate limiting", core: true },
  { name: "Auth Service", role: "RS256 JWT sessions, email 2FA" },
  { name: "User Service", role: "Accounts, profiles, permissions" },
  { name: "Device Hub", role: "HDP device state and commands", core: true },
  { name: "Automation Service", role: "Workflow triggers and actions" },
  { name: "Dashboard Service", role: "Dashboards, widgets, groups" },
  { name: "Integration Proxy", role: "Deploys and hosts integrations" },
  { name: "Echo Service", role: "Realtime event fan-out" },
  { name: "EMQX", role: "MQTT broker" },
  { name: "PostgreSQL", role: "Primary datastore" },
  { name: "Redis", role: "Cache and rate limiting" },
  { name: "SeaweedFS", role: "Object storage" },
];

export default function AboutPage() {
  return (
    <>
      <section className="section hero reveal">
        <div className="hero-copy">
          <p className="eyebrow">Architecture</p>
          <h1 className="hero-title">
            A platform, not <span className="accent">a monolith</span>.
          </h1>
          <p className="hero-lede">
            Homenavi is a set of focused microservices around a realtime device plane. Each service
            can be deployed, scaled and observed on its own, and integrations plug into the plane
            rather than patching the core.
          </p>
          <div className="hero-cta">
            <a className="btn primary" href="/features">See what it does</a>
            <a className="btn secondary" href="https://github.com/PetoAdam/homenavi" rel="external">
              Source on GitHub
            </a>
          </div>
          <div className="hero-meta">
            <span>12 services</span>
            <span className="meta-sep" aria-hidden="true">/</span>
            <span>MQTT + HDP</span>
            <span className="meta-sep" aria-hidden="true">/</span>
            <span>RS256 JWT</span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="arch-diagram" aria-label="Core services of the Homenavi stack">
            {SERVICES.map((s) => (
              <div key={s.name} className={`arch-node${s.core ? " core" : ""}`}>
                <strong>{s.name}</strong>
                {s.role}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section reveal">
        <div className="feature-band">
          <div>
            <h2>Realtime device plane</h2>
            <p>
              Devices speak MQTT using the Homenavi Device Protocol. The device hub keeps
              authoritative state and streams updates, which is what makes dashboards, groups and
              automation triggers feel instant rather than polled.
            </p>
          </div>
          <ScreenshotFrame src="/screenshots/devices.png" alt="Device list with live state" />
        </div>

        <div className="feature-band reverse">
          <ScreenshotFrame src="/screenshots/map.png" alt="Room map view of devices" />
          <div>
            <h2>Integrations, not plugins</h2>
            <p>
              An integration is a self-contained service with a manifest declaring widgets, device
              extensions, automation extensions, auth and setup UI. The integration proxy deploys it
              from Compose or Helm artifacts and registers it with the platform.
            </p>
            <div className="hero-cta">
              <a className="btn secondary" href="/integrations">How integrations work</a>
            </div>
          </div>
        </div>

        <div className="feature-band">
          <div>
            <h2>Self-hosted by design</h2>
            <p>
              The whole stack runs on your own hardware with Docker Compose or Helm. Your data stays
              on your infrastructure, and the mock adapter profile stands in for real devices so
              you can try the platform without any hardware.
            </p>
            <div className="hero-cta">
              <a className="btn secondary" href="/guides/self-hosting">Self-hosting guide</a>
            </div>
          </div>
          <ScreenshotFrame src="/screenshots/dashboard.png" alt="Self-hosted Homenavi dashboard" />
        </div>
      </section>

      <section className="section reveal">
        <h2 className="page-title">Observability and security</h2>
        <div className="grid cols-3">
          <GlassCard>
            <h3 className="card-title">Metrics and tracing</h3>
            <p className="card-desc">
              Prometheus metrics, Jaeger traces and correlation IDs flow across every service, so a
              slow request can be traced end to end.
            </p>
          </GlassCard>
          <GlassCard>
            <h3 className="card-title">Authentication</h3>
            <p className="card-desc">
              RS256 JWT sessions with optional email 2FA. Redis-backed rate limiting protects the API
              surface.
            </p>
          </GlassCard>
          <GlassCard>
            <h3 className="card-title">Isolation</h3>
            <p className="card-desc">
              Integrations run as their own services behind the proxy. A misbehaving integration
              cannot reach the core datastore directly.
            </p>
          </GlassCard>
        </div>
        <CodeBlock
          code={`docker compose up -d
# nginx       :80     the ingress — open http://localhost
# frontend    :5173   the app, proxied through nginx
# api-gateway :8080   the API entrypoint
# grafana     :3000   platform metrics`}
        />
      </section>
    </>
  );
}
