export type HostingPreference = "tryout" | "self-hosted" | "hybrid" | "homelab";
export type ExistingHardware = "server" | "nas" | "kubernetes" | "sbc" | "none";
export type Connectivity = "ip" | "zigbee" | "matter-ip" | "matter-thread" | "unsure";
export type VoiceNeed = "none" | "starter" | "hybrid" | "offline";
export type Expertise = "beginner" | "intermediate" | "advanced";

export type DeploymentAnswers = {
  hosting: HostingPreference;
  hardware: ExistingHardware;
  connectivity: Connectivity[];
  voice: VoiceNeed;
  expertise: Expertise;
};

export type ProfileId = "tryout" | "compose" | "hybrid" | "kubernetes";

export type DeploymentProfile = {
  id: ProfileId;
  name: string;
  complexity: "Guided" | "Moderate" | "Advanced";
  summary: string;
  pros: string[];
  cons: string[];
  hosting: string;
  privacy: string;
  availability: string;
  cloudDependency: string;
  idealFor: string;
};

export const DEPLOYMENT_PROFILES: DeploymentProfile[] = [
  {
    id: "tryout",
    name: "Tryout with Compose and mock adapter",
    complexity: "Guided",
    summary: "Start Homenavi locally with the opt-in mock adapter profile before connecting home hardware or device services.",
    pros: ["No home-device configuration", "Uses the verified Compose stack", "Safe way to explore the local interface"],
    cons: ["Mock data is not real device control", "You still need Docker Compose on the computer running the tryout"],
    hosting: "Any computer that can run Docker Compose",
    privacy: "The tryout runs locally and uses simulated adapter data.",
    availability: "For local evaluation only; it is not a production deployment profile.",
    cloudDependency: "None for the Homenavi core or mock adapter.",
    idealFor: "Someone who wants to explore Homenavi before configuring devices or buying hardware.",
  },
  {
    id: "compose",
    name: "Fully self-hosted with Compose",
    complexity: "Guided",
    summary: "Run the Homenavi core and its bundled dependencies on hardware you control.",
    pros: ["Local device control", "No required cloud for the core platform", "Smallest supported starting path"],
    cons: ["You operate upgrades, storage, and backups", "Availability depends on your host and network"],
    hosting: "Your local server, NAS, or capable SBC",
    privacy: "Core state and control remain on infrastructure you operate.",
    availability: "One host by default; plan backups before relying on it.",
    cloudDependency: "Optional integrations may use external vendor APIs.",
    idealFor: "A first self-hosted deployment or a small household instance.",
  },
  {
    id: "hybrid",
    name: "Hybrid local control",
    complexity: "Moderate",
    summary: "Keep Homenavi and device connectivity local while intentionally using remote services where they add value.",
    pros: ["Local device control can continue independently", "External AI can reduce local compute needs", "Reuse an existing local server"],
    cons: ["More trust and network boundaries to manage", "Remote features depend on connectivity and provider terms"],
    hosting: "Existing local host plus explicitly chosen remote services",
    privacy: "Device control can remain local; external workloads need separate review.",
    availability: "Local controls and remote features have different outage modes.",
    cloudDependency: "Only the external services you choose, such as remote inference.",
    idealFor: "Someone who wants local control without running every optional workload locally.",
  },
  {
    id: "kubernetes",
    name: "Advanced homelab with Helm",
    complexity: "Advanced",
    summary: "Use the Homenavi Helm chart when Kubernetes, persistent storage, ingress, and observability are already part of your operating model.",
    pros: ["Kubernetes-native lifecycle controls", "HA options for data services and stateless workloads", "Fits established homelab practices"],
    cons: ["More components to operate", "Kubernetes is not the simplest first installation", "Storage and ingress need deliberate configuration"],
    hosting: "An existing Kubernetes cluster",
    privacy: "You control the cluster, network, storage, and secret boundaries.",
    availability: "HA profile options exist; the cluster and storage design determine the outcome.",
    cloudDependency: "Optional, unless you configure external dependencies.",
    idealFor: "A homelab operator who already runs Kubernetes and wants its operational model.",
  },
];

export type Recommendation = {
  profile: DeploymentProfile;
  why: string[];
  requiredHardware: string[];
  optionalHardware: string[];
  services: string[];
  limitations: string[];
  walkthrough: { title: string; purpose: string; command?: string; expected: string; link: string }[];
  hardwareRecommendations: { name: string; role: "Core compute" | "Radio coordinator" | "Voice satellite" | "Topology"; status: "Supported" | "Conditional" | "Proof of concept" | "Wait"; reason: string; href: string }[];
  remoteAccess: { name: string; detail: string; href: string }[];
};

const COMPOSE_WALKTHROUGH: Recommendation["walkthrough"] = [
  { title: "Check the host", purpose: "Confirm Docker and Compose are available, and reserve ports 80 and 443.", command: "docker compose version", expected: "Docker Compose reports a version.", link: "/guides/quickstart" },
  { title: "Clone Homenavi", purpose: "Get the versioned Compose definition and environment template.", command: "git clone https://github.com/PetoAdam/homenavi.git\ncd homenavi", expected: "The repository is available locally.", link: "/guides/quickstart" },
  { title: "Create local configuration", purpose: "Start from the reviewed project defaults before changing security-sensitive settings.", command: "cp .env.example .env", expected: ".env exists. Pin HN_VERSION before a repeatable production deployment.", link: "/guides/quickstart" },
  { title: "Validate images and start", purpose: "Pull the configured release images and start the core stack.", command: "docker compose pull\ndocker compose up -d", expected: "Core services start in the background.", link: "/guides/self-hosting" },
  { title: "Verify the stack", purpose: "Check service status before opening the application.", command: "docker compose ps", expected: "Edge and core services report as running.", link: "/guides/quickstart" },
  { title: "Create the first account", purpose: "Open http://localhost in a browser and complete initial authentication.", expected: "The Homenavi sign-up experience is reachable.", link: "/guides/quickstart" },
];

const TRYOUT_WALKTHROUGH: Recommendation["walkthrough"] = [
  { title: "Check Docker Compose", purpose: "Confirm Docker and Compose are available on the computer where you want to explore Homenavi.", command: "docker compose version", expected: "Docker Compose reports a version.", link: "/guides/quickstart" },
  { title: "Clone Homenavi", purpose: "Get the versioned Compose definition, including the opt-in mock adapter profile.", command: "git clone https://github.com/PetoAdam/homenavi.git\ncd homenavi", expected: "The repository is available locally.", link: "/guides/quickstart" },
  { title: "Start the local tryout", purpose: "Run the core stack with simulated adapter data; no real device integration or radio is configured.", command: "docker compose --profile mock-adapter up -d", expected: "Core services and the mock adapter start in the background.", link: "/guides/quickstart" },
  { title: "Open the local interface", purpose: "Complete the initial account setup and inspect the simulated integration.", expected: "Homenavi is reachable at http://localhost.", link: "/guides/quickstart" },
];

const HELM_WALKTHROUGH: Recommendation["walkthrough"] = [
  { title: "Check the cluster", purpose: "Use an existing Kubernetes cluster with Helm and a suitable StorageClass.", command: "kubectl get nodes\nhelm version", expected: "Cluster nodes and Helm are available.", link: "/guides/self-hosting" },
  { title: "Create the namespace", purpose: "Keep Homenavi resources scoped to a dedicated namespace.", command: "kubectl create namespace homenavi", expected: "The homenavi namespace exists.", link: "/guides/self-hosting" },
  { title: "Render before installing", purpose: "Review the chart output and values for ingress, storage, and dependencies.", command: "helm lint ./helm/homenavi\nhelm template homenavi ./helm/homenavi -n homenavi > /tmp/homenavi.yaml", expected: "The chart lints and renders successfully.", link: "/guides/self-hosting" },
  { title: "Install or upgrade", purpose: "Apply the chart after reviewing your production values.", command: "helm upgrade --install homenavi ./helm/homenavi -n homenavi --create-namespace", expected: "Kubernetes creates the Homenavi resources.", link: "/guides/self-hosting" },
  { title: "Check rollout", purpose: "Confirm the edge is running before configuring ingress and clients.", command: "kubectl -n homenavi get pods\nkubectl -n homenavi rollout status deployment/api-gateway", expected: "Pods become ready and the API Gateway rollout completes.", link: "/guides/self-hosting" },
];

export const DEFAULT_ANSWERS: DeploymentAnswers = {
  hosting: "self-hosted",
  hardware: "server",
  connectivity: ["ip"],
  voice: "none",
  expertise: "beginner",
};

export function chooseProfile(answers: DeploymentAnswers): DeploymentProfile {
  if (answers.hosting === "tryout") return DEPLOYMENT_PROFILES.find((profile) => profile.id === "tryout")!;
  if (answers.hosting === "homelab" || answers.hardware === "kubernetes" || answers.expertise === "advanced") {
    return DEPLOYMENT_PROFILES.find((profile) => profile.id === "kubernetes")!;
  }
  if (answers.hosting === "hybrid" || answers.voice === "hybrid") return DEPLOYMENT_PROFILES.find((profile) => profile.id === "hybrid")!;
  return DEPLOYMENT_PROFILES.find((profile) => profile.id === "compose")!;
}

export function getRecommendation(answers: DeploymentAnswers): Recommendation {
  const profile = chooseProfile(answers);
  const isHelm = profile.id === "kubernetes";
  const isTryout = profile.id === "tryout";
  const requiredHardware = isTryout
    ? ["Any computer with Docker Compose. No home-device hardware, radio, or integration configuration is needed for the mock adapter tryout."]
    : answers.hardware === "none"
    ? ["A host for the selected profile. Reuse an existing always-on computer or NAS before buying new hardware."]
    : ["Your selected existing host. A separate gateway is optional, not a baseline requirement."];
  const optionalHardware: string[] = [];
  const limitations: string[] = [];
  const services = ["Homenavi core", "PostgreSQL", "Redis", "EMQX", "SeaweedFS", "Nginx edge"];
  const why = [profile.summary];
  const hardwareRecommendations: Recommendation["hardwareRecommendations"] = [];
  const remoteAccess: Recommendation["remoteAccess"] = [];

  if (isTryout) {
    services.push("Mock adapter profile with simulated integration data");
    hardwareRecommendations.push({ name: "Local Compose tryout", role: "Topology", status: "Supported", reason: "Runs the verified Compose stack with the opt-in mock adapter. It does not configure or control real home devices.", href: "/guides/quickstart" });
  } else if (answers.hardware === "server" || answers.hardware === "nas") {
    hardwareRecommendations.push({ name: "Use the existing always-on host", role: "Core compute", status: "Supported", reason: "Your selected server or NAS runs the Homenavi core and its local services. It is the preferred first host before adding another computer.", href: "/guides/quickstart" });
  }
  if (answers.hardware === "sbc") {
    hardwareRecommendations.push({ name: "Pi-class single-board computer", role: "Core compute", status: "Conditional", reason: "Runs a small Homenavi stack after validating the exact images, storage, and attached hardware path. It is not a local AI recommendation.", href: "https://github.com/PetoAdam/homenavi#can-i-run-it-on-a-raspberry-pi" });
  }
  if (answers.hardware === "none") {
    hardwareRecommendations.push({ name: "Choose a host after sizing the workload", role: "Core compute", status: "Conditional", reason: "Runs the Homenavi core. Start with a host that can run Docker and keep ports 80 and 443 available; reuse an existing computer or NAS before buying hardware.", href: "/guides/deployment" });
  }
  if (!isTryout) {
    hardwareRecommendations.push({ name: "No separate edge node for a local deployment", role: "Topology", status: "Supported", reason: "The Homenavi core and the supported Zigbee2MQTT path can run on the same local host. Add an edge host only for a specific need such as radio placement, network isolation, or independent availability. This does not make Matter or Thread a validated Homenavi path today.", href: "/guides/deployment" });
    remoteAccess.push({ name: "Cloudflare Tunnel (cloudflared)", detail: "An optional tunnel for publishing a reviewed remote entry point. It adds Cloudflare to the trust and availability boundary, so configure authentication and avoid exposing internal services directly.", href: "https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/" });
    remoteAccess.push({ name: "Tailscale", detail: "An optional private mesh VPN for authenticated remote access without opening a public inbound port. Keep Homenavi authentication enabled and limit access to the intended devices and users.", href: "https://tailscale.com/kb/1017/install" });
  }
  if (!isTryout && answers.hardware === "sbc") {
    limitations.push("Pi-class hardware can run a small deployment when storage and image support are validated for the specific board. It is not a recommendation for local AI workloads.");
  }
  if (!isTryout && answers.connectivity.includes("zigbee")) {
    requiredHardware.push("A compatible Zigbee coordinator and a supported Zigbee2MQTT path.");
    optionalHardware.push("An Ethernet-attached coordinator can help with radio placement; it does not require a separate SBC.");
    services.push("Zigbee2MQTT and the Zigbee adapter through the optional hardware profile");
    hardwareRecommendations.push({ name: "Compatible Zigbee coordinator", role: "Radio coordinator", status: "Supported", reason: "Prefer Ethernet or Wi-Fi coordinators over USB for flexible placement and fewer host-specific mappings. The SMLIGHT SLZB-MR3U is a strong dual-radio option with Zigbee and Thread radios, external antennas, and Ethernet/PoE. Use its Zigbee radio through Zigbee2MQTT; its Thread radio does not add a validated Matter controller or commissioning flow. Other compatible coordinators work too.", href: "https://smlight.tech/product/slzb-mr3u/" });
  }
  if (!isTryout && answers.connectivity.includes("matter-ip")) {
    limitations.push("Matter support is planned. Do not treat Matter-over-IP selection as a validated controller or commissioning flow today.");
  }
  if (!isTryout && answers.connectivity.includes("matter-thread")) {
    limitations.push("Thread radio hardware is not a complete Matter controller. Homenavi has no validated Thread Border Router or production commissioning flow today.");
  }
  if (!isTryout && (answers.voice === "starter" || answers.voice === "hybrid" || answers.voice === "offline")) {
    limitations.push("The voice satellite is a proof of concept. Its tested Raspberry Pi and ReSpeaker configuration still depends on an unimplemented main-platform voice gateway, and AEC tuning remains unresolved.");
    hardwareRecommendations.push({ name: "Raspberry Pi with ReSpeaker 4-Mic Array", role: "Voice satellite", status: "Proof of concept", reason: "Acts as a room audio endpoint for wake-word detection and audio capture. It is the tested satellite combination, not an end-to-end supported voice installation.", href: "https://github.com/PetoAdam/homenavi-voice-satellite" });
  }
  if (!isTryout && answers.voice === "offline") {
    optionalHardware.push("Additional CPU, memory, storage, and possibly a GPU for local speech or LLM workloads. Requirements depend on the chosen models, quantization, concurrency, and latency target.");
  }
  return {
    profile,
    why,
    requiredHardware,
    optionalHardware,
    services,
    limitations,
    walkthrough: isTryout ? TRYOUT_WALKTHROUGH : isHelm ? HELM_WALKTHROUGH : COMPOSE_WALKTHROUGH,
    hardwareRecommendations,
    remoteAccess,
  };
}

export function renderSetupPlanMarkdown(answers: DeploymentAnswers): string {
  const recommendation = getRecommendation(answers);
  const list = (items: string[]) => items.map((item) => `- ${item}`).join("\n");
  const walkthrough = recommendation.walkthrough.map((item, index) => {
    const command = item.command ? `\n\n\`\`\`sh\n${item.command}\n\`\`\`` : "";
    return `## ${index + 1}. ${item.title}\n\n${item.purpose}${command}\n\n**Expected:** ${item.expected}\n\n[Detailed guide](${item.link})`;
  }).join("\n\n");
  const hardware = recommendation.hardwareRecommendations.length
    ? recommendation.hardwareRecommendations.map((item) => `- **${item.name}** (${item.role}; ${item.status}): ${item.reason}`).join("\n")
    : "- No additional hardware is implied by these answers.";

  const remoteAccess = recommendation.remoteAccess.length ? recommendation.remoteAccess.map((item) => `- **[${item.name}](${item.href})**: ${item.detail}`).join("\n") : "- Not needed for the local mock-adapter tryout.";
  return `# Homenavi setup plan\n\n## Recommended profile\n\n**${recommendation.profile.name}** (${recommendation.profile.complexity} complexity)\n\n${recommendation.profile.summary}\n\n## Why it fits\n\n${list(recommendation.why)}\n\n## Required hardware\n\n${list(recommendation.requiredHardware)}\n\n## Hardware recommendations\n\n${hardware}\n\n## Optional remote access\n\n${remoteAccess}\n\n## Services involved\n\n${list(recommendation.services)}\n\n## Known limitations\n\n${recommendation.limitations.length ? list(recommendation.limitations) : "- No additional limitations identified by the selected answers."}\n\n# Verified setup walkthrough\n\n${walkthrough}\n\n## References\n\n- [Deployment planner](https://www.homenavi.org/deploy)\n- [Quickstart](https://www.homenavi.org/guides/quickstart)\n- [Self-hosting](https://www.homenavi.org/guides/self-hosting)\n`;
}
