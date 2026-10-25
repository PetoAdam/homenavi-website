import type { Metadata } from "next";
import { PageHeader, ScreenshotFrame } from "../components/ui";

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

      <section className="section feature-operating-model" aria-labelledby="operating-model-title">
        <p className="eyebrow">Operate and extend</p>
        <h2 id="operating-model-title">A control plane you can keep.</h2>
        <div className="feature-operating-list">
          <article>
            <h3>MCP, scoped by design</h3>
            <p>Connect compatible assistants with OAuth 2.1 and PKCE-scoped tools for inventory, history, device control, groups, and workflow runs. A DIY voice assistant is in development.</p>
          </article>
          <article>
            <h3>Explicit access boundaries</h3>
            <p>Authentication, session validation, and role-based access control protect service boundaries before a device command reaches the runtime.</p>
          </article>
          <article>
            <h3>Small hardware to HA</h3>
            <p>Run a local or small instance with Compose, including capable Pi-class homelab hardware, or use Helm and the HA profile when Kubernetes fits your operating model.</p>
          </article>
          <article>
            <h3>Mobile-friendly PWA today</h3>
            <p>Use the responsive interface on a phone and install it directly from a supported browser. Native mobile and Matter support are planned.</p>
          </article>
          <article>
            <h3>Realtime state without polling</h3>
            <p>Device changes travel through the Homenavi Device Protocol over MQTT, so dashboards, automations, and other connected clients react to the same live event stream.</p>
          </article>
          <article>
            <h3>History that stays useful</h3>
            <p>History consumers record HDP state changes for charts and queries without making the dashboard poll the device runtime for a stale answer.</p>
          </article>
          <article>
            <h3>Marketplace to contributor path</h3>
            <p>Find installable integrations in the marketplace, then use the public integration template when your home needs a capability that does not exist yet.</p>
          </article>
          <article>
            <h3>A shared device contract</h3>
            <p>Adapters translate vendor-specific behavior into HDP messages, allowing the rest of Homenavi to work with a consistent model instead of a separate API for every brand.</p>
          </article>
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
