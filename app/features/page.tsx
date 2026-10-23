import type { Metadata } from "next";
import { PageHeader, GlassCard, ScreenshotFrame } from "../components/ui";

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
            <h3 className="card-title">Realtime device control</h3>
            <p className="card-desc">
              Devices connect through the device hub and EMQX broker using the Homenavi Device
              Protocol (HDP) over MQTT. State changes propagate instantly to every connected
              client, so toggling a light or reading a sensor feels immediate.
            </p>
          </div>
          <ScreenshotFrame src="/screenshots/devices.png" alt="Device inventory view" />
        </div>

        <div className="feature-band reverse">
          <ScreenshotFrame src="/screenshots/dashboard.png" alt="Dashboard with resizable widgets" />
          <div>
            <h3 className="card-title">Visual dashboards</h3>
            <p className="card-desc">
              Build a home overview with widgets for weather, devices, integrations, and maps.
              Widgets are resizable and rearrangeable, and integrations can contribute their own
              widgets to any dashboard.
            </p>
          </div>
        </div>

        <div className="feature-band">
          <div>
            <h3 className="card-title">Groups and floor maps</h3>
            <p className="card-desc">
              Organize devices into groups and place them on an interactive floor map. Groups let
              you act on many devices at once — turn off every light in the bedroom with one action.
            </p>
          </div>
          <ScreenshotFrame src="/screenshots/map.png" alt="Floor map editor with device placement" />
        </div>

        <div className="feature-band reverse">
          <ScreenshotFrame src="/screenshots/automation-edit.png" alt="Automation workflow editor" />
          <div>
            <h3 className="card-title">Automation workflows</h3>
            <p className="card-desc">
              The automation service chains triggers and actions into workflows. Sensor events,
              schedules, and integration events can all drive scenes, device commands, and
              notifications.
            </p>
          </div>
        </div>

        <div className="feature-band">
          <div>
            <h3 className="card-title">Integration runtime</h3>
            <p className="card-desc">
              Integrations run as containerized services behind the integration proxy. They declare
              a manifest with capabilities — device extensions, widgets, automations, and auth —
              and Homenavi surfaces them automatically in the app.
            </p>
          </div>
          <ScreenshotFrame src="/screenshots/integrations-installed.png" alt="Installed integrations view" />
        </div>
      </section>

      <section className="section">
        <div className="glass-card">
          <h3 className="card-title">Self-hosted by design</h3>
          <p className="card-desc">
            Every service runs on your own infrastructure with Docker Compose or Helm. Your data
            stays yours: no cloud dependency is required for the core platform.
          </p>
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
