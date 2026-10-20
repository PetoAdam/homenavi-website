import { PageHeader, GlassCard, ScreenshotFrame } from "../components/ui";

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
        <div className="grid cols-2">
          <div className="glass-card">
            <h3 className="card-title">Realtime device control</h3>
            <p className="card-desc">
              Devices connect through the device hub and EMQX broker using the Homenavi Device
              Protocol (HDP) over MQTT. State changes propagate instantly to every connected
              client, so toggling a light or reading a sensor feels immediate.
            </p>
          </div>
          <ScreenshotFrame src="/screenshots/devices.png" alt="Device inventory view" />
        </div>
      </section>

      <section className="section">
        <div className="grid cols-2">
          <ScreenshotFrame src="/screenshots/dashboard.png" alt="Dashboard with resizable widgets" />
          <div className="glass-card">
            <h3 className="card-title">Visual dashboards</h3>
            <p className="card-desc">
              Build a home overview with widgets for weather, devices, integrations, and maps.
              Widgets are resizable and rearrangeable, and integrations can contribute their own
              widgets to any dashboard.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="grid cols-2">
          <div className="glass-card">
            <h3 className="card-title">Groups and floor maps</h3>
            <p className="card-desc">
              Organize devices into groups and place them on an interactive floor map. Groups let
              you act on many devices at once — turn off every light in the bedroom with one action.
            </p>
          </div>
          <ScreenshotFrame src="/screenshots/map.png" alt="Floor map editor with device placement" />
        </div>
      </section>

      <section className="section">
        <div className="grid cols-2">
          <ScreenshotFrame src="/screenshots/auotmation.png" alt="Automation workflow editor" />
          <div className="glass-card">
            <h3 className="card-title">Automation workflows</h3>
            <p className="card-desc">
              The automation service chains triggers and actions into workflows. Sensor events,
              schedules, and integration events can all drive scenes, device commands, and
              notifications.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="grid cols-2">
          <div className="glass-card">
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
    </>
  );
}
