import { Metadata } from "next";
import { PageHeader, GlassCard, CodeBlock } from "../components/ui";

export const metadata: Metadata = {
  title: "About",
  description: "How Homenavi works: microservice core, realtime MQTT/HDP plane, and integrations.",
};

export default function AboutPage() {
  return (
    <>
      <section className="section">
        <PageHeader
          title="About Homenavi"
          subtitle="An open smart-home platform with a microservice core, MQTT/HDP realtime plane, and integration-first extensibility."
        />

        <div className="grid cols-2">
          <GlassCard>
            <h3 className="card-title">Microservice architecture</h3>
            <p className="card-desc">
              Homenavi is composed of focused services: an API gateway, auth and user services,
              a device hub, automation and dashboard services, an integration proxy, and supporting
              infrastructure (EMQX, PostgreSQL, Redis, SeaweedFS). Each service can be deployed,
              scaled, and observed independently.
            </p>
          </GlassCard>
          <GlassCard>
            <h3 className="card-title">Realtime device plane</h3>
            <p className="card-desc">
              Devices communicate over MQTT with the Homenavi Device Protocol (HDP). State updates
              stream in realtime, which is what makes dashboards, groups, and automation triggers
              feel instant.
            </p>
          </GlassCard>
          <GlassCard>
            <h3 className="card-title">Integrations, not plugins</h3>
            <p className="card-desc">
              Integrations are self-contained services with a manifest declaring widgets, device
              extensions, automation extensions, auth, and setup UI. The integration proxy deploys
              them from Compose or Helm artifacts and registers them with the platform.
            </p>
          </GlassCard>
          <GlassCard>
            <h3 className="card-title">Self-hosted by design</h3>
            <p className="card-desc">
              Run the whole stack on your own hardware with Docker Compose or Helm. Your data stays
              on your infrastructure, and the demo mode lets you try the platform without any
              physical devices.
            </p>
          </GlassCard>
        </div>

        <div className="section">
          <GlassCard>
            <h3 className="card-title">Observability and security</h3>
            <p className="card-desc">
              The platform ships with Prometheus metrics, Jaeger tracing, and correlation IDs across
              services. Authentication uses RS256 JWTs with optional email 2FA, and Redis-backed
              rate limiting protects the API surface.
            </p>
          </GlassCard>
        </div>
      </section>
    </>
  );
}
