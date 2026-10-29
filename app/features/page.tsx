import type { Metadata } from "next";
import { PageHeader, ScreenshotFrame } from "../components/ui";

const OPERATING_MODEL_ITEMS = [
  ["01", "MCP, scoped by design", "Connect compatible assistants with OAuth 2.1 and PKCE-scoped tools for inventory, history, device control, groups, and workflow runs. The device role for voice is under development.", "ASSISTANT ACCESS"],
  ["02", "Explicit access boundaries", "Authentication, session validation, and role-based access control protect service boundaries before a device command reaches the runtime.", "TRUST BOUNDARY"],
  ["03", "Small hardware to HA", "Run a local or small instance with Compose, including capable Pi-class homelab hardware, or use Helm and the HA profile when Kubernetes fits your operating model.", "DEPLOYMENT RANGE"],
  ["04", "Mobile-friendly PWA today", "Use the responsive interface on a phone and install it directly from a supported browser. Native mobile and Matter support are planned.", "CONTROL SURFACE"],
  ["05", "Realtime state without polling", "Device changes travel through the Homenavi Device Protocol over MQTT, so dashboards, automations, and connected clients react to the same live event stream.", "EVENT STREAM"],
  ["06", "History that stays useful", "History consumers record HDP state changes for charts and queries without making the dashboard poll the device runtime for a stale answer.", "DURABLE RECORD"],
  ["07", "Marketplace to contributor path", "Find installable integrations in the marketplace, then use the public integration template when your home needs a capability that does not exist yet.", "EXTENSIBILITY"],
  ["08", "A shared device contract", "Adapters translate vendor-specific behavior into HDP messages, allowing the rest of Homenavi to work with a consistent model instead of a separate API for every brand.", "HDP CONTRACT"],
] as const;

export const metadata: Metadata = {
  title: "Features",
  description: "Explore Homenavi's realtime device control, dashboards, maps, automation workflows, and integration runtime.",
  alternates: { canonical: "/features" },
};

export default function FeaturesPage() {
  return (
    <>
      <section className="section">
        <PageHeader
          title="Features"
          subtitle="Everything Homenavi does, organized by capability."
        />
      </section>

      <section className="section">
        <div className="feature-band">
          <div>
            <h3 className="card-title">Pair once, organize everywhere</h3>
            <p className="card-desc">
              The Device Hub brings supported integrations into one inventory. Give a device a
              room, tags, and groups so it can be found by place, purpose, or collection, while
              realtime HDP state keeps every connected control surface current.
            </p>
          </div>
          <ScreenshotFrame src="/screenshots/devices.png" alt="Device inventory view" />
        </div>

        <div className="feature-band reverse">
          <ScreenshotFrame src="/screenshots/dashboard.png" alt="Dashboard with resizable widgets" />
          <div>
            <h3 className="card-title">Dashboards for every household member</h3>
            <p className="card-desc">
              Each person can create a control surface built around their own routines. Add
              weather, devices, integrations, and maps; then resize and rearrange widgets until
              the dashboard fits the way they use their home.
            </p>
          </div>
        </div>

        <div className="feature-band">
          <div>
            <h3 className="card-title">See the home as a place</h3>
            <p className="card-desc">
              Place devices on an interactive floor map, inspect room-level state, and move into
              the room-filtered device inventory without losing spatial context. Groups still make
              whole-home actions simple when a room is not the right target.
            </p>
          </div>
          <ScreenshotFrame src="/screenshots/map.png" alt="Floor map editor with device placement" />
        </div>

        <div className="feature-band reverse">
          <ScreenshotFrame src="/screenshots/automation-edit.png" alt="Automation workflow editor" />
          <div>
            <h3 className="card-title">Automation workflows</h3>
            <p className="card-desc">
              Build workflows from triggers, conditions, branches, and actions. Sensor events,
              schedules, and integration events can drive scenes, device commands, and
              notifications, with command acknowledgement data available to the workflow.
            </p>
          </div>
        </div>

        <div className="feature-band">
          <div>
            <h3 className="card-title">Integration runtime</h3>
            <p className="card-desc">
              Install an integration quickly, then use its setup UI to configure it. Behind the
              Integration Proxy, manifests declare device extensions, custom widgets, automation
              steps, and auth so each integration feels native to Homenavi.
            </p>
          </div>
          <ScreenshotFrame src="/screenshots/integrations-installed.png" alt="Installed integrations view" />
        </div>
      </section>

      <section className="section feature-pairing reveal" aria-labelledby="pairing-title">
        <div>
          <p className="eyebrow">Easy pairing flows</p>
          <h2 id="pairing-title">Pair, place, and use the device immediately.</h2>
          <p>Start from an integration setup surface, then keep the device useful in the home model from its first live state update.</p>
        </div>
        <ol>
          <li><span>01</span><strong>Connect</strong><small>Use the integration's setup UI and validate its credential or local discovery path.</small></li>
          <li><span>02</span><strong>Organize</strong><small>Assign rooms, tags, groups, and optional map placement while the device is fresh in context.</small></li>
          <li><span>03</span><strong>Control</strong><small>Use the same capability model across dashboards, automations, and scoped MCP tools.</small></li>
        </ol>
      </section>

      <section className="section feature-microservices reveal" aria-labelledby="microservices-title">
        <div>
          <p className="eyebrow">Modern Go microservices</p>
          <h2 id="microservices-title">Services that scale by responsibility, not by accident.</h2>
          <p>Go services keep the realtime device runtime, automation, history, identity, and dashboard workloads explicit. HDP over MQTT carries shared events without forcing every consumer into a shared database.</p>
        </div>
        <dl>
          <div><dt>Clear ownership</dt><dd>Each service owns a focused part of the home model and communicates through contracts.</dd></div>
          <div><dt>Realtime by default</dt><dd>HDP events let dashboards, automations, and history react to the same device change.</dd></div>
          <div><dt>Independent operations</dt><dd>Deploy, observe, and scale service workloads according to their actual responsibilities.</dd></div>
        </dl>
      </section>

      <section className="section feature-operating-model" aria-labelledby="operating-model-title">
        <p className="eyebrow">Operate and extend</p>
        <h2 id="operating-model-title">A control plane you can keep.</h2>
        <div className="feature-reveal-list">
          {OPERATING_MODEL_ITEMS.map(([index, title, detail, label], itemIndex) => <article className={`walk-row feature-reveal-row${itemIndex % 2 ? " reverse" : ""}`} key={title}>
            <span className="walk-index">{index}</span>
            <div className="walk-text" data-reveal-part><p className="feature-reveal-label">{label}</p><h3>{title}</h3><p>{detail}</p></div>
            <div className="walk-media feature-reveal-panel" data-reveal-part><span>{index}</span><strong>{label}</strong><i /></div>
          </article>)}
        </div>
      </section>

      <section className="section feature-architecture-cta">
        <p className="eyebrow">For technical readers</p>
        <h2>Want to know more?</h2>
        <p>
          Follow the data paths, service boundaries, device protocol, integration runtime, and
          deployment choices behind these capabilities.
        </p>
        <a className="btn secondary" href="/architecture">Explore the architecture</a>
      </section>
    </>
  );
}
