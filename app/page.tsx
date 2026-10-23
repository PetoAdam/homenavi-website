import { ScreenshotFrame } from "./components/ui";
import type { Metadata } from "next";
import { loadMarketplace, formatVersion } from "../lib/marketplace";
import DeploymentTabs from "./components/DeploymentTabs";
import ExplorePlatform from "./components/home/ExplorePlatform";

export const metadata: Metadata = {
  title: "Open, self-hostable smart-home platform",
  description: "Homenavi provides realtime device control, dashboards, automations, integrations, and MCP support on infrastructure you control.",
  alternates: { canonical: "/" },
};

const WALKTHROUGH = [
  {
    route: "DEVICE → ROOM → DASHBOARD",
    title: "Pair a device, place it in a room, put it on a dashboard.",
    description: "Pairing runs through the device hub: commissioning, capability negotiation, and a room hint. The dashboard picks the device up immediately, with live state and manual controls.",
    image: "/screenshots/devices.png",
    alt: "Device list with live state in the Homenavi app",
  },
  {
    route: "DASHBOARD → SPATIAL STATE",
    title: "Investigate state in the rooms where it matters.",
    description: "The map is the spatial view for understanding the home at a glance: rooms, devices, and their current state remain tied to the places they affect.",
    image: "/screenshots/map.png",
    alt: "Homenavi map showing spatial device state",
    reverse: true,
  },
  {
    route: "GROUP OR TAG → AUTOMATION",
    title: "Target an automation by group, tag, room, or device.",
    description: "Groups are explicit device collections; tags are labels; rooms describe location. Each is independently selectable, so rules can follow how your home is organized.",
    image: "/screenshots/groups.png",
    alt: "Device groups and rooms in the Homenavi app",
  },
  {
    route: "CONDITION → ACTION → RESULT",
    title: "Every step reports back.",
    description: "Commands carry correlation IDs and acknowledgements, so a workflow can branch on whether a light actually changed, not just whether a command was sent.",
    image: "/screenshots/automation-edit.png",
    alt: "Automation editor with condition and action steps",
    reverse: true,
  },
  {
    route: "INTEGRATION → MARKETPLACE",
    title: "Install a brand, get its devices.",
    description: "Integrations declare their capabilities in a manifest and run as their own service. Installing one adds devices, widgets, or workflows without changing the core platform.",
    image: "/screenshots/integrations-marketplace.png",
    alt: "Homenavi marketplace listing installable integrations",
  },
];

export default async function HomePage() {
  const marketplace = await loadMarketplace();
  const rosterIntegrations = marketplace.integrations.slice(0, 5);

  return (
    <>
      <section className="home-stage section reveal" aria-labelledby="home-stage-title">
        <header className="hero-intro">
          <div className="hero-intro-copy">
            <p>OPEN SOURCE SMART-HOME PLATFORM</p>
            <h1 id="home-stage-title">Run your home on infrastructure you control.</h1>
          </div>
          <div className="hero-intro-detail">
            <span>
              Realtime device state, customizable dashboards, automations, and integrations on a
              stack you operate.
            </span>
            <div className="hero-actions">
              <a className="btn primary" href="/demo">Explore the demo</a>
              <a className="btn secondary" href="/features">See the platform</a>
            </div>
          </div>
        </header>
        <figure className="hero-product">
          <img src="/screenshots/dashboard.png" alt="Homenavi dashboard showing weather, quick controls, map, climate, media, and automations" />
        </figure>
      </section>

      <section className="section walkthrough reveal" aria-label="How Homenavi connects devices, spaces, automations, and integrations">
        {WALKTHROUGH.map((step, index) => (
          <article className={`walk-row${step.reverse ? " reverse" : ""}`} data-reveal key={step.route}>
            <span className="walk-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <div className="walk-text" data-reveal-part>
              <p className="walk-route">{step.route}</p>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
            <div className="walk-media" data-reveal-part>
              <ScreenshotFrame src={step.image} alt={step.alt} />
            </div>
          </article>
        ))}
      </section>

      <ExplorePlatform />

      {/* Deployment station. */}
      <section className="section deploy-station reveal" aria-labelledby="deploy-title">
        <h2 id="deploy-title">Run Homenavi your way.</h2>
        <p className="page-subtitle">
          Start with Compose for a local or small instance, or move directly to Helm when your
          homelab already runs Kubernetes.
        </p>
        <DeploymentTabs />
      </section>

      {/* Compact integration roster instead of three equal cards. */}
      <section className="section roster reveal" aria-labelledby="roster-title">
        <h2 id="roster-title">Integration roster</h2>
        <p className="roster-count">
          Showing {rosterIntegrations.length} of {marketplace.integrations.length} integrations
          <span className="roster-source">
            {marketplace.source === "live" ? "from marketplace.homenavi.org" : "cached snapshot"}
          </span>
        </p>
        <ul className="roster-list">
          {rosterIntegrations.map((item) => (
            <li className="roster-row" key={item.id}>
              <a href={`/marketplace/${item.id}`}>{item.name}</a>
              <span className="roster-desc">{item.description}</span>
              <span className="roster-version">{formatVersion(item.version)}</span>
            </li>
          ))}
        </ul>
        <a className="btn primary" href="/integrations">Explore all integrations</a>
      </section>
    </>
  );
}
