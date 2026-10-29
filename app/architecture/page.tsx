import { Metadata } from "next";
import { PageHeader } from "../components/ui";
import ArchitectureFlow from "../components/ArchitectureFlow";

export const metadata: Metadata = {
  title: "Architecture",
  description: "How Homenavi connects the home model, automation engine, integrations, and MCP tools on infrastructure you control.",
  alternates: { canonical: "/architecture" },
};

const OWNERSHIP = [
  ["Identity and access", "Auth Service issues RS256 sessions; API Gateway validates issuer, audience, token type, and signature before routing protected API traffic."],
  ["Home inventory", "Entity Registry owns user-facing metadata: rooms, tags, groups, map placement, and HDP bindings. It does not replace realtime device state."],
  ["Device state and commands", "Device Hub owns HDP devices, current state, capabilities, pairing, and persisted command lifecycles. Correlation IDs tie requests to acknowledged outcomes."],
  ["Historical record", "History consumers ingest HDP state changes for charts and queries without making the dashboard poll the device runtime."],
  ["Automation execution", "Automation resolves targets, subscribes to triggers, publishes commands, and persists workflow runs. Integration actions are resolved from the proxy's catalog."],
  ["Integration lifecycle", "Integration Proxy maintains the installed integration runtime and exposes manifests, setup surfaces, widgets, and automation-step metadata to the platform."],
];

export default function ArchitecturePage() {
  return (
    <>
      <section className="section reveal">
        <p className="eyebrow">For operators and builders</p>
        <PageHeader
          title="A home platform with clear boundaries."
          subtitle="Homenavi separates the control surface, home model, device protocol, workflows, and integrations so the system can grow without turning into a tangle."
        />
      </section>

      <section className="section architecture-split reveal" aria-labelledby="deployments-title">
        <div>
          <p className="eyebrow">Deployment choices</p>
          <h2 id="deployments-title">From small hardware to resilient clusters.</h2>
          <p>
            The Go microservices ship for ARM64 as well as x86, making a locally running core stack
            practical on capable Raspberry Pi-class homelab hardware. Validate storage and image
            support for your specific board before deployment.
          </p>
          <p>
            Use Docker Compose for a local or small instance. Use the Helm chart when Kubernetes is
            the right fit; its HA profile scales selected stateless services, uses shared MQTT
            consumer groups, and supports CNPG PostgreSQL and Redis Sentinel.
          </p>
          <a className="btn secondary" href="/deploy">Plan your deployment</a>
        </div>
        <div className="architecture-deployment-panel" aria-label="Homenavi deployment paths">
          <div><span>01</span><strong>Compose</strong><p>Local and small instances</p></div>
          <div><span>02</span><strong>Helm</strong><p>Kubernetes deployment path</p></div>
          <div><span>03</span><strong>HA profile</strong><p>Configured replicas and resilient data services</p></div>
        </div>
      </section>

      <section className="section architecture-split reverse architecture-mcp-section reveal" aria-labelledby="mcp-title">
        <div>
          <p className="eyebrow">MCP, scoped by design</p>
          <h2 id="mcp-title">Bring your own assistant.</h2>
          <p>
            Homenavi exposes a Streamable HTTP MCP endpoint with OAuth 2.1, PKCE, and dynamic
            client registration. Connect a compatible assistant without making that assistant part
            of your core deployment.
          </p>
          <p>
            Scoped tools can read inventory and history, control devices and groups, create groups,
            and inspect or run workflows. Pairing, users, dashboards, events, and integrations are
            planned MCP surfaces that remain under development.
          </p>
          <a className="btn secondary" href="/guides/mcp">Read the MCP guide</a>
        </div>
        <div className="architecture-mcp-panel" aria-label="MCP access boundaries">
          <div><span>READ</span><strong>Inventory and history</strong></div>
          <div><span>CONTROL</span><strong>Devices and groups</strong></div>
          <div><span>RUN</span><strong>Existing workflows</strong></div>
          <div className="architecture-mcp-roadmap"><span>UNDER DEVELOPMENT</span><strong>Pairing, users, dashboards, events, integrations</strong></div>
        </div>
      </section>

      <section className="section architecture-state-flow reveal" aria-labelledby="state-title">
        <div className="architecture-heading">
          <p className="eyebrow">Realtime state path</p>
          <h2 id="state-title">From a physical device to every live surface.</h2>
          <p>
            A device change is translated once, published as an HDP event, and then used by each
            relevant surface. The live dashboard, history, and automation engine consume the same
            event instead of polling a vendor-specific device API.
          </p>
        </div>
        <ArchitectureFlow kind="state" />
      </section>

      <section className="section architecture-microservices reveal" aria-labelledby="microservices-title">
        <div>
          <p className="eyebrow">Go microservices</p>
          <h2 id="microservices-title">A platform that can evolve without a monolithic knot.</h2>
          <p>Focused Go services own the parts of the platform they operate. HDP events carry state changes across service boundaries, so independently operated workloads do not need to share a runtime database.</p>
        </div>
        <dl>
          <div><dt>Focused ownership</dt><dd>Identity, home inventory, device control, dashboards, automation, and history have clear responsibilities.</dd></div>
          <div><dt>Realtime contracts</dt><dd>EMQX and HDP let services react to the same event while preserving their own data models.</dd></div>
          <div><dt>Practical operations</dt><dd>Compose starts small; Helm can scale selected stateless services when Kubernetes is already the right fit.</dd></div>
        </dl>
      </section>

      <section className="section architecture-system reveal" aria-labelledby="runtime-title">
        <div className="architecture-heading">
          <p className="eyebrow">Detailed service topology</p>
          <h2 id="runtime-title">The platform, mapped by responsibility and transport.</h2>
          <p className="architecture-desktop-note">Client traffic enters the Core plane through Nginx and the API Gateway. This desktop map is still a simplified view, focused on how the core feature set works across the main service and transport boundaries.</p>
          <p className="architecture-mobile-note">On mobile, the diagram intentionally collapses to a plane-level view so the transport boundaries remain readable.</p>
        </div>
        <ArchitectureFlow kind="runtime" />
      </section>

      <section className="section architecture-ownership reveal" aria-labelledby="ownership-title">
        <div className="architecture-heading">
          <p className="eyebrow">Service boundaries</p>
          <h2 id="ownership-title">Services own their data; consumers use contracts.</h2>
        </div>
        <dl>
          {OWNERSHIP.map(([term, definition]) => (
            <div key={term}>
              <dt>{term}</dt>
              <dd>{definition}</dd>
            </div>
          ))}
        </dl>
      </section>

    </>
  );
}