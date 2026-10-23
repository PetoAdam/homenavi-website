import { Metadata } from "next";
import { PageHeader } from "../components/ui";

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
          <a className="btn secondary" href="/guides/self-hosting">Read self-hosting options</a>
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

      <section className="section architecture-system reveal" aria-labelledby="runtime-title">
        <div className="architecture-heading">
          <p className="eyebrow">Runtime topology</p>
          <h2 id="runtime-title">One public edge, a realtime backbone, and explicit service boundaries.</h2>
          <p>Every browser request enters through Nginx and the API Gateway. Realtime device traffic travels independently through EMQX using HDP, so services can react without sharing databases.</p>
        </div>
        <div className="architecture-system-map" aria-label="Homenavi runtime system map">
          <div className="architecture-system-column">
            <p>CLIENTS</p>
            <div className="architecture-system-node"><strong>Browser dashboard</strong><span>HTTPS and WSS</span></div>
            <div className="architecture-system-node"><strong>MCP client</strong><span>Scoped HTTP tools</span></div>
          </div>
          <div className="architecture-system-link"><span>HTTPS · WSS</span></div>
          <div className="architecture-system-core">
            <div className="architecture-system-node core"><strong>Nginx + API Gateway</strong><span>Public entry, authentication, routing, WebSocket proxy</span></div>
            <div className="architecture-system-services">
              <div className="architecture-system-node"><strong>Auth Service + Entity Registry Service</strong><span>Sessions, users, rooms, tags, groups</span></div>
              <div className="architecture-system-node"><strong>Device Hub + Automation Service</strong><span>HDP state, command lifecycle, workflows</span></div>
              <div className="architecture-system-node"><strong>Dashboard Service + History Service</strong><span>Widgets, queries, durable state record</span></div>
            </div>
            <div className="architecture-event-bus"><span>EMQX</span><strong>HDP realtime event backbone</strong><em>state · commands · lifecycle</em></div>
          </div>
          <div className="architecture-system-link reverse"><span>MQTT · HDP</span></div>
          <div className="architecture-system-column">
            <p>RUNTIME</p>
            <div className="architecture-system-node"><strong>Adapters + Physical Devices</strong><span>Zigbee, vendor clouds, local hardware</span></div>
            <div className="architecture-system-node"><strong>Integration Proxy + Extensions</strong><span>Manifests, extension containers, vendor APIs</span></div>
          </div>
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
        <div className="architecture-state-track" aria-label="Physical device event sequence">
          <div className="architecture-state-node"><span>01</span><strong>Physical Device</strong><em>A light, sensor, switch, or integration device changes state.</em></div>
          <div className="architecture-state-arrow"><span>vendor event</span></div>
          <div className="architecture-state-node"><span>02</span><strong>Adapter</strong><em>Maps the vendor event to a protocol-neutral HDP message.</em></div>
          <div className="architecture-state-arrow"><span>HDP publish</span></div>
          <div className="architecture-state-node emphasis"><span>03</span><strong>EMQX</strong><em>Routes the shared HDP state event to every subscribed service.</em></div>
          <div className="architecture-state-arrow"><span>state stream</span></div>
          <div className="architecture-state-node"><span>04</span><strong>Device Hub</strong><em>Projects current state and records command lifecycle outcomes.</em></div>
          <div className="architecture-state-arrow"><span>WSS / API</span></div>
          <div className="architecture-state-node"><span>05</span><strong>Live Surfaces</strong><em>Dashboard, History Service, and Automation Service react from the same event.</em></div>
        </div>
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