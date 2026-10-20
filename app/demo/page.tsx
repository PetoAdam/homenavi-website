import { PageHeader, GlassCard, ScreenshotFrame, Pill } from "../components/ui";
import { checkDemoStatus, DEMO_URL } from "../../lib/demo";

export default async function DemoPage() {
  const status = await checkDemoStatus();

  return (
    <>
      <section className="section">
        <PageHeader
          title="Live demo"
          subtitle="Explore Homenavi in the browser — no account setup, no hardware required."
        />
      </section>

      <section className="section">
        <div className="glass-card hero">
          {status.reachable ? (
            <>
              <p className="pill success">Demo available</p>
              <h3 className="card-title">Open the demo instance</h3>
              <p className="card-desc">
                The demo runs the full platform with seeded mock devices. Sessions are temporary
                and some actions are disabled, but dashboards, devices, groups, and automations
                are all explorable.
              </p>
              <div className="hero-cta">
                <a className="btn" href={DEMO_URL} rel="external">Launch the demo</a>
              </div>
            </>
          ) : (
            <>
              <p className="pill warning">Demo currently unreachable</p>
              <h3 className="card-title">The demo is offline right now</h3>
              <p className="card-desc">
                The hosted demo instance is not responding. You can still evaluate the product
                through the screenshots below, or run the self-hosted stack yourself in a few
                minutes.
              </p>
              <div className="hero-cta">
                <a className="btn secondary" href="/guides/quickstart">Run it locally instead</a>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="section">
        <div className="grid cols-2">
          <ScreenshotFrame src="/screenshots/dashboard.png" alt="Demo dashboard with weather and device widgets" />
          <ScreenshotFrame src="/screenshots/automation-edit.png" alt="Automation workflow editing in the demo" />
        </div>
      </section>

      <section className="section">
        <div className="grid cols-3">
          <div className="glass-card">
            <h3 className="card-title">What you can explore</h3>
            <ul>
              <li>Device control with seeded mock devices</li>
              <li>Dashboard widgets and resizing</li>
              <li>Groups and the floor map</li>
              <li>Automation workflows</li>
              <li>The integrations marketplace</li>
            </ul>
          </div>
          <div className="glass-card">
            <h3 className="card-title">What is limited</h3>
            <ul>
              <li>Some actions are intentionally disabled</li>
              <li>Sessions are temporary and reset periodically</li>
              <li>No real hardware connection</li>
            </ul>
          </div>
          <div className="glass-card">
            <h3 className="card-title">Ready for more?</h3>
            <p className="card-desc">
              Self-hosting takes minutes and gives you the full platform with your own devices.
            </p>
            <div className="hero-cta">
              <a className="btn secondary" href="/guides/self-hosting">Deployment guide</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
