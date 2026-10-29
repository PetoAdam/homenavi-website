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

type WalkthroughFrame = "mcp" | "security" | "deployment";

type WalkthroughStep = {
  group: string;
  route: string;
  title: string;
  description: string;
  image?: string;
  alt?: string;
  href: string;
  linkLabel: string;
  visual?: WalkthroughFrame;
  roadmap?: string;
  reverse?: boolean;
};

const WALKTHROUGH: WalkthroughStep[] = [
  {
    group: "Configure",
    route: "DASHBOARD → YOUR WORKSPACE",
    title: "Build the dashboard you want to live with.",
    description: "Each person in the household can build a dashboard for their own routines. Resize and rearrange its widgets, then combine core controls with widgets contributed by your integrations.",
    image: "/screenshots/dashboard.png",
    alt: "Homenavi dashboard showing customizable widgets and live home state",
    href: "/features",
    linkLabel: "Explore dashboards",
  },
  {
    group: "Configure",
    route: "PAIR → ORGANIZE → CONTROL",
    title: "Pair once, find every device the same way.",
    description: "The Device Hub brings supported integrations into one device inventory. Assign rooms, tags, and groups so a device can be found by place, purpose, or collection.",
    image: "/screenshots/devices.png",
    alt: "Homenavi device inventory with device state",
    href: "/guides/integration-setup",
    linkLabel: "Read integration setup",
    reverse: true,
  },
  {
    group: "Configure",
    route: "MAP → ROOM → DEVICE LIST",
    title: "See the home as a place, not a pile of devices.",
    description: "Place devices on an interactive floor map, inspect room-level state, and move from spatial context into the room-filtered device inventory without losing your place.",
    image: "/screenshots/map.png",
    alt: "Homenavi floor map showing rooms and device state",
    href: "/features",
    linkLabel: "Explore maps and rooms",
  },
  {
    group: "Operate",
    route: "TRIGGER → CONDITIONS → ACTIONS",
    title: "Build automations with consequences.",
    description: "Compose triggers, conditions, branches, and actions around real device and integration events. Commands retain correlation and acknowledgement data, so workflows can react to outcomes rather than just send requests.",
    image: "/screenshots/automation-edit.png",
    alt: "Homenavi automation editor with workflow steps",
    href: "/guides/automations",
    linkLabel: "Read automation guide",
    reverse: true,
  },
  {
    group: "Operate",
    route: "INTEGRATION → HOMENAVI UI",
    title: "Extend the platform without forking its experience.",
    description: "Integrations run as independently deployed services and declare their capabilities in a manifest. Devices, setup surfaces, widgets, and automation steps appear as part of the same Homenavi system.",
    image: "/screenshots/integrations-marketplace.png",
    alt: "Homenavi marketplace listing available integrations",
    href: "/integrations",
    linkLabel: "Explore integrations",
    roadmap: "Integration MCP support",
  },
  {
    group: "Extend",
    route: "MCP → SCOPED TOOLS → ASSISTANTS",
    title: "Bring an assistant to a system you still control.",
    description: "Model Context Protocol gives compatible assistants scoped tools for Homenavi inventory, history, device and group control, and workflow runs. OAuth 2.1 and PKCE keep the assistant outside your core deployment boundary.",
    href: "/guides/mcp",
    linkLabel: "Read the MCP guide",
    visual: "mcp",
    roadmap: "DIY voice assistant in development",
    reverse: true,
  },
  {
    group: "Extend",
    route: "AUTHENTICATE → AUTHORIZE → OPERATE",
    title: "Keep control boundaries explicit.",
    description: "Authentication, session validation, and role-based access control sit at the edge before protected services receive a request. Device control stays tied to a real identity and explicit permissions.",
    href: "/architecture",
    linkLabel: "Inspect the architecture",
    visual: "security",
  },
  {
    group: "Extend",
    route: "COMPOSE → HELM → HA PROFILE",
    title: "Deploy for the home you run.",
    description: "Start with Docker Compose for a local or small instance, or use Helm and the HA profile when Kubernetes fits your operating model. ARM64 support makes capable Pi-class homelab hardware a documented option.",
    href: "/deploy",
    linkLabel: "Plan your deployment",
    visual: "deployment",
    reverse: true,
  },
  {
    group: "Extend",
    route: "PWA → RESPONSIVE CONTROL → ROADMAP",
    title: "Use the control plane wherever you are.",
    description: "Homenavi is already a mobile-friendly PWA that you can install from a supported browser. A native mobile app and Matter support are planned additions to that same home model.",
    image: "/screenshots/dashboard.png",
    alt: "Homenavi dashboard shown in the web application",
    href: "/features",
    linkLabel: "Explore the platform",
    roadmap: "Native mobile app and Matter support",
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
              <a className="btn secondary" href="/deploy">Find your deployment</a>
            </div>
          </div>
        </header>
        <figure className="hero-product">
          <img src="/screenshots/dashboard.png" alt="Homenavi dashboard showing weather, quick controls, map, climate, media, and automations" />
        </figure>
      </section>

      <section className="section walkthrough reveal" aria-labelledby="walkthrough-title">
        <header className="walkthrough-heading">
          <p className="eyebrow">Product walkthrough</p>
          <h2 id="walkthrough-title">One system for devices, people, and automation.</h2>
          <p>From the first paired device to daily control, assistants, and deployment, Homenavi keeps the home connected without losing your control of it.</p>
        </header>
        {WALKTHROUGH.map((step, index) => (
          <article id={`walk-${index + 1}`} className={`walk-row${step.reverse ? " reverse" : ""}`} data-reveal key={step.route}>
            <span className="walk-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <div className="walk-text" data-reveal-part>
              <p className="walk-route">{step.route}</p>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              {step.roadmap ? <span className="walk-roadmap">On the roadmap: {step.roadmap}</span> : null}
              <a className="walk-link" href={step.href}>{step.linkLabel}</a>
            </div>
            <div className="walk-media" data-reveal-part>
              {step.image ? <ScreenshotFrame src={step.image} alt={step.alt ?? ""} /> : <WalkthroughSystemFrame type={step.visual} />}
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

function WalkthroughSystemFrame({ type }: { type?: "mcp" | "security" | "deployment" }) {
  const frames = {
    mcp: ["MCP client", "OAuth 2.1 + PKCE", "Scoped Homenavi tools"],
    security: ["Identity", "API Gateway", "Protected services"],
    deployment: ["Docker Compose", "Helm", "HA profile"],
  };
  const labels = frames[type ?? "mcp"];

  return (
    <div className={`walk-system-frame ${type ?? "mcp"}`} aria-label={labels.join(" to ")}>
      {labels.map((label, index) => (
        <div key={label}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <strong>{label}</strong>
        </div>
      ))}
    </div>
  );
}
