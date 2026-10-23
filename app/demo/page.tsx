import { Metadata } from "next";
import { GlassCard, CodeBlock, ScreenshotFrame, Pill } from "../components/ui";
import { checkDemoStatus, DEMO_URL } from "../../lib/demo";

export const metadata: Metadata = {
  title: "Live demo",
  description:
    "See Homenavi in action: the hosted demo instance, screenshots of the real product, and how to get a mock device world on a local stack.",
};

const EXPERIENCES = [
  {
    title: "Control devices",
    text: "Toggle lights, change scenes, and read live device state from the device list and the room map.",
    href: "/screenshots/devices.png",
  },
  {
    title: "Build a dashboard",
    text: "Add widgets from installed integrations and rearrange them on a self-hosted dashboard.",
    href: "/screenshots/dashboard-add-widget.png",
  },
  {
    title: "Compose an automation",
    text: "Chain triggers, conditions and actions in the workflow editor, then run it against the demo device world.",
    href: "/screenshots/automation-edit.png",
  },
  {
    title: "Group devices by room",
    text: "Assign a room for location, then use groups or tags for the controls and automations that span devices.",
    href: "/screenshots/groups.png",
  },
];

export default async function DemoPage() {
  const status = await checkDemoStatus();

  return (
    <>
      <section className="section hero reveal">
        <div className="hero-copy">
          <p className="eyebrow">Hosted demo</p>
          <h1 className="hero-title">
            The platform, running <span className="accent">without your hardware</span>.
          </h1>
          <p className="hero-lede">
            The demo instance is a real Homenavi deployment with simulated devices standing in for
            the ones you do not have yet. It is the fastest way to judge the product before you
            commit to self-hosting the full stack.
          </p>
          <div className="hero-cta">
            <a className="btn primary" href={DEMO_URL}>Launch the demo</a>
            <a className="btn secondary" href="/guides/quickstart">Run it locally instead</a>
          </div>
          <div className="hero-meta">
            <span>simulated device world</span>
            <span className="meta-sep" aria-hidden="true">/</span>
            <span>real MQTT and HDP plane</span>
            <span className="meta-sep" aria-hidden="true">/</span>
            <span>no physical devices required</span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="demo-status-card">
            <div className="demo-status-head">
              <span className="eyebrow">Demo endpoint</span>
              <Pill variant={status.reachable ? "success" : "warning"} label={status.reachable ? "Available" : "Not reachable right now"} />
            </div>
            <p className="demo-status-url">{DEMO_URL}</p>
            <p className="demo-status-note">
              {status.reachable
                ? "The demo instance responded when this page was generated. Use the launch button to open it."
                : "Availability can change between checks. The launch button remains available; use the local mock-adapter path if the hosted environment is unavailable."}
            </p>
            <div className="demo-status-frames">
              <ScreenshotFrame src="/screenshots/dashboard.png" alt="Homenavi dashboard in demo mode" />
            </div>
          </div>
        </div>
      </section>

      <section className="section reveal">
        <h2 className="page-title">What you can try</h2>
        <div className="grid cols-2">
          {EXPERIENCES.map((item) => (
            <GlassCard key={item.title}>
              <h3 className="card-title">{item.title}</h3>
              <p className="card-desc">{item.text}</p>
              <div className="hero-cta">
                <a className="btn ghost" href={item.href}>View screenshot</a>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="section reveal">
        <div className="feature-band">
          <div>
            <h2>Automations in the demo</h2>
            <p>
              The workflow editor is the same editor you get when self-hosting. Triggers, conditions
              and actions are validated against the device hub, so what you compose in the demo is
              what runs in production.
            </p>
            <div className="hero-cta">
              <a className="btn secondary" href="/guides/automations">Automation guide</a>
            </div>
          </div>
          <ScreenshotFrame src="/screenshots/automation-edit.png" alt="Automation workflow editor" />
        </div>
      </section>

      <section className="section reveal">
        <div className="glass-card">
          <h2 className="page-title">Prefer to run it yourself?</h2>
          <p className="page-subtitle">
            There is no seeded demo world in the open-source stack yet. What you can do locally is
            start the platform and attach the mock adapter, which publishes a fake device tree over
            MQTT so the dashboard has something to talk to.
          </p>
          <CodeBlock
            code={`git clone https://github.com/PetoAdam/homenavi.git
cd homenavi
cp .env.example .env
docker compose pull
docker compose up -d --profile mock-adapter`}
          />
          <p className="code-note">
            nginx is the ingress, so the platform is reachable at <code>http://localhost</code> once
            <code> docker compose ps</code> reports the edge services running.
          </p>
          <div className="hero-cta">
            <a className="btn primary" href="/guides/quickstart">Quickstart guide</a>
            <a className="btn secondary" href="/guides/self-hosting">Self-hosting guide</a>
          </div>
        </div>
      </section>
    </>
  );
}
