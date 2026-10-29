import type { Metadata } from "next";
import DeploymentWizard from "../components/deployment/DeploymentWizard";
import { DEPLOYMENT_PROFILES } from "../../lib/deployment";
import HardwareArchitectureMap from "../components/deployment/HardwareArchitectureMap";

const ARCHITECTURES = [
  { profile: "tryout" as const, title: "Tryout with Compose and mock adapter", status: "Verified", connectivity: ["unsure"] as const, voice: "starter" as const, description: "Verified for local evaluation. Compose runs Homenavi with simulated adapter data, so no home-device integration, radio, or hardware configuration is required." },
  { profile: "compose" as const, title: "Fully self-hosted with Compose", status: "Verified", connectivity: ["ip", "zigbee", "matter-thread"] as const, voice: "starter" as const, description: "Verified on a local Docker host. Homenavi, storage, MQTT, and the edge run together; supported LAN/WAN integrations and Zigbee2MQTT communicate across the home network. Matter is shown as a future path." },
  { profile: "hybrid" as const, title: "Hybrid cloud core with SBC adapters", status: "In progress", connectivity: ["ip", "zigbee", "matter-thread"] as const, voice: "hybrid" as const, description: "In progress: run the Homenavi core in the cloud while an SBC keeps LAN/WAN and radio adapters at home. Keeping the core together is the advised model; splitting it into more parts is possible but not generally supported well." },
  { profile: "kubernetes" as const, title: "Advanced homelab with Helm", status: "Verified", connectivity: ["ip", "zigbee", "matter-thread"] as const, voice: "starter" as const, description: "Verified for an existing Kubernetes operating model. Ingress, persistent storage, observability, and Homenavi services run in the cluster; LAN/WAN and Zigbee integrations remain supported, with Matter shown as future work." },
];

export const metadata: Metadata = {
  title: "Deployment guide",
  description: "Choose a Homenavi deployment profile, review verified Compose and Helm paths, and understand hardware and protocol trade-offs.",
  alternates: { canonical: "/deploy" },
};

export default function DeploymentGuidePage() {
  return (
    <>
      <section className="section deployment-hero reveal">
        <p className="eyebrow">Deployment guide</p>
        <h1>Choose a setup you can operate.</h1>
        <p>Start from the hardware and services you already have. This guide separates supported Homenavi paths from work that is planned, experimental, or dependent on an integration.</p>
        <div className="deployment-hero-links"><a className="btn primary" href="#wizard">Find your deployment</a><a className="btn secondary" href="#profiles">Compare profiles</a></div>
      </section>

      <section className="section" id="wizard" aria-label="Deployment recommendation wizard"><DeploymentWizard /></section>

      <section className="section deployment-profiles" id="profiles" aria-labelledby="profiles-title">
        <p className="eyebrow">Browse without the wizard</p>
        <h2 id="profiles-title">Supported deployment profiles</h2>
        <div className="deployment-profile-table" role="region" aria-label="Deployment profile comparison" tabIndex={0}>
          <table>
            <thead><tr><th>Profile</th><th>Hosting</th><th>Complexity</th><th>Privacy and dependency</th><th>Ideal for</th></tr></thead>
            <tbody>{DEPLOYMENT_PROFILES.map((profile) => <tr key={profile.id}><th scope="row">{profile.name}</th><td>{profile.hosting}</td><td>{profile.complexity}</td><td>{profile.privacy} {profile.cloudDependency}</td><td>{profile.idealFor}</td></tr>)}</tbody>
          </table>
        </div>
      </section>

      <section className="section deployment-architectures" aria-labelledby="architectures-title">
        <p className="eyebrow">Architecture references</p>
        <h2 id="architectures-title">Know where the boundaries are.</h2>
        <p>Each map shows the control path, where devices attach, and the deployment boundary. The Compose tryout, local Compose, and Helm paths are verified; hybrid is in progress. Every production profile supports LAN/WAN integrations and Zigbee; Matter/Thread remains future work. For access outside your LAN, use Cloudflare Tunnel with cloudflared or Tailscale after local access is working and authentication is configured.</p>
        <div className="hardware-architecture-grid">
          {ARCHITECTURES.map((architecture) => <HardwareArchitectureMap key={architecture.profile} title={architecture.title} status={architecture.status} description={architecture.description} profile={architecture.profile} connectivity={[...architecture.connectivity]} voice={architecture.voice ?? "none"} compact />)}
        </div>
      </section>

      <section className="section deployment-reference" aria-labelledby="reference-title">
        <p className="eyebrow">Verified references</p>
        <h2 id="reference-title">Keep the detailed operations documentation close.</h2>
        <div>
          <a href="/guides/quickstart"><strong>Quickstart</strong><span>Verified Docker Compose first-run commands.</span></a>
          <a href="/guides/self-hosting"><strong>Self-hosting</strong><span>Compose, Helm, service boundaries, and operations context.</span></a>
          <a href="/guides/mcp"><strong>MCP guide</strong><span>OAuth-scoped assistant access and available tools.</span></a>
          <a href="https://github.com/PetoAdam/homenavi/blob/main/doc/deployment_guide.md" rel="external"><strong>Main repository runbook</strong><span>Authoritative deployment detail maintained with the platform.</span></a>
        </div>
      </section>
    </>
  );
}
