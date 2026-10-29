"use client";

import {
  Background,
  Handle,
  MarkerType,
  Position,
  ReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Cloud, HousePlug, Mic, Network, Radio, Server, Smartphone, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import type { Connectivity, ProfileId, VoiceNeed } from "../../../lib/deployment";

type Props = {
  title: string;
  status: string;
  profile: ProfileId;
  description?: string;
  connectivity?: Connectivity[];
  voice?: VoiceNeed;
  compact?: boolean;
};

type IconName = "cloud" | "core" | "device" | "edge" | "radio" | "voice" | "client";
type EntityData = { label: string; detail: string; icon: IconName; tone?: "caution"; vertical?: boolean; branching?: boolean };
type EntityNode = Node<EntityData, "entity">;
type PlaneNode = Node<{ label: string }, "plane">;

const ICONS: Record<IconName, LucideIcon> = {
  cloud: Cloud,
  core: Server,
  device: HousePlug,
  edge: Network,
  radio: Radio,
  voice: Mic,
  client: Smartphone,
};

const nodeTypes = { entity: Entity, plane: Plane };
const supportedEdge = { stroke: "#57c394", strokeWidth: 1.6 };
const cautionEdge = { stroke: "#e0a45c", strokeWidth: 1.6, strokeDasharray: "5 4" };

export default function HardwareArchitectureMap({ title, status, profile, description, connectivity = ["ip"], voice = "none", compact = false }: Props) {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 720px)");
    const update = () => setNarrow(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  const graph = buildGraph(profile, connectivity, voice, narrow);
  const needsCloudPlane = profile === "hybrid";

  return (
    <article className={`hardware-architecture-map${compact ? " compact" : ""}${narrow ? " narrow" : ""}${needsCloudPlane ? " needs-cloud" : ""}`} aria-label={`${title} hardware architecture`}>
      <header>
        <div><p>Directed deployment graph</p><h3>{title}</h3></div>
        <span className={status === "Verified" ? "verified" : "in-progress"}>{status}</span>
      </header>
      <div className="hardware-flow" aria-label={`${title} directed graph`}>
        <ReactFlow
          key={narrow ? "narrow" : "wide"}
          nodes={graph.nodes}
          edges={graph.edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.1 }}
          minZoom={0.45}
          maxZoom={1.2}
          nodesConnectable={false}
          nodesDraggable={false}
          elementsSelectable={false}
          panOnDrag={false}
          panOnScroll={false}
          preventScrolling={false}
          zoomOnDoubleClick={false}
          zoomOnPinch={false}
          zoomOnScroll={false}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="rgba(233, 238, 244, 0.08)" gap={18} size={1} />
        </ReactFlow>
      </div>
      {description ? <p className="hardware-map-description">{description}</p> : null}
      <footer>
        <span className="hardware-map-legend supported">Supported connection</span>
        {connectivity.includes("matter-ip") || connectivity.includes("matter-thread") || voice !== "none" ? <span className="hardware-map-legend caution">Under development</span> : null}
      </footer>
    </article>
  );
}

function Entity({ data }: NodeProps<EntityNode>) {
  const Icon = ICONS[data.icon];
  return <div className={`flow-entity${data.tone ? ` ${data.tone}` : ""}`}>
    <Handle type="target" position={data.vertical ? Position.Top : Position.Left} className="flow-handle" />
    <span className="flow-entity-icon"><Icon size={16} strokeWidth={1.8} /></span>
    <span><strong>{data.label}</strong><small>{data.detail}</small></span>
    {data.branching ? <>
      <Handle type="source" id="source-lan" position={data.vertical ? Position.Bottom : Position.Right} className="flow-handle" style={data.vertical ? { left: "22%" } : { top: "22%" }} />
      <Handle type="source" id="source-zigbee" position={data.vertical ? Position.Bottom : Position.Right} className="flow-handle" style={data.vertical ? { left: "50%" } : { top: "50%" }} />
      <Handle type="source" id="source-matter" position={data.vertical ? Position.Bottom : Position.Right} className="flow-handle" style={data.vertical ? { left: "78%" } : { top: "78%" }} />
    </> : <Handle type="source" position={data.vertical ? Position.Bottom : Position.Right} className="flow-handle" />}
  </div>;
}

function Plane({ data }: NodeProps<PlaneNode>) {
  return <div className="flow-plane-label">{data.label}</div>;
}

function plane(id: string, label: string, x: number, y: number, width: number, height: number): PlaneNode {
  return {
    id,
    type: "plane",
    position: { x, y },
    data: { label },
    selectable: false,
    draggable: false,
    style: { width, height },
    className: id === "cloud-plane" ? "flow-plane cloud-plane" : id === "client-plane" ? "flow-plane client-plane" : "flow-plane local-plane",
  };
}

function entity(id: string, parentId: string, x: number, y: number, data: EntityData): EntityNode {
  return { id, type: "entity", parentId, extent: "parent", position: { x, y }, data, draggable: false, selectable: false };
}

function directed(id: string, source: string, target: string, caution = false, sourceHandle?: string): Edge {
  return {
    id,
    source,
    sourceHandle,
    target,
    type: "straight",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed, color: caution ? "#e0a45c" : "#57c394" },
    style: caution ? cautionEdge : supportedEdge,
  };
}

function buildGraph(profile: ProfileId, connectivity: Connectivity[], voice: VoiceNeed, narrow: boolean): { nodes: Node[]; edges: Edge[] } {
  return narrow ? buildNarrowGraph(profile, connectivity, voice) : buildWideGraph(profile, connectivity, voice);
}

function buildWideGraph(profile: ProfileId, connectivity: Connectivity[], voice: VoiceNeed): { nodes: Node[]; edges: Edge[] } {
  const hasZigbee = connectivity.includes("zigbee");
  const hasMatter = connectivity.includes("matter-ip") || connectivity.includes("matter-thread");
  const hasVoice = voice !== "none";
  const hybrid = profile === "hybrid";
  const tryout = profile === "tryout";
  const remoteCoreProfile = hybrid;
  const localX = remoteCoreProfile ? 430 : 210;
  const localWidth = 720;
  const localHeight = hasMatter ? 380 : 290;
  const nodes: Node[] = [
    plane("client-plane", "Clients", 16, 16, 170, hasVoice ? 250 : 170),
    entity("clients", "client-plane", 10, 55, { label: "PWA / mobile / MCP", detail: "Browser, app, and scoped clients", icon: "client" }),
    plane("local-plane", remoteCoreProfile ? "Home / SBC adapter plane" : "Local / home plane", localX, 16, localWidth, localHeight),
  ];
  const edges: Edge[] = [];
  const coreData = tryout
    ? { label: "Homenavi tryout", detail: "Compose stack with mock adapter", icon: "core" as const }
    : profile === "kubernetes"
    ? { label: "Homenavi cluster", detail: "Helm release, ingress, and storage", icon: "core" as const }
    : { label: "Homenavi core", detail: "Compose services, MQTT, and storage", icon: "core" as const };

  if (remoteCoreProfile) {
    nodes.push(plane("cloud-plane", "Cloud / remote plane", 210, 16, 250, 250));
  }

  if (remoteCoreProfile) {
    nodes.push(entity("remote-core", "cloud-plane", 42, 75, { label: hybrid ? "Cloud Homenavi core" : "Remote Homenavi core", detail: hybrid ? "Core stays together by default" : "TLS edge, services, backups", icon: "cloud" }));
    nodes.push(entity("secure-edge", "local-plane", 24, 145, { label: hybrid ? "SBC adapter host" : "Secure edge", detail: hybrid ? "LAN/WAN and radio adapters" : "Reviewed home-to-cloud path", icon: "edge" }));
    nodes.push(entity("lan-adapter", "local-plane", 230, 48, { label: "Integrations", detail: "LAN/WAN adapter; e.g. LG ThinQ", icon: "edge" }));
    nodes.push(entity("lan-devices", "local-plane", 462, 48, { label: "Core Devices", detail: "Built-in adapters: Zigbee; Matter planned", icon: "device" }));
    edges.push(directed("client-to-cloud", "clients", "remote-core"));
    edges.push(directed("cloud-to-edge", "remote-core", "secure-edge"));
    edges.push(directed("edge-to-lan", "secure-edge", "lan-adapter"));
    edges.push(directed("lan-to-devices", "lan-adapter", "lan-devices"));
    if (hasZigbee) addZigbee(nodes, edges, "local-plane", 230, 165, 462, 165, "secure-edge");
  } else {
    nodes.push(entity("core", "local-plane", 24, 145, coreData));
    nodes.push(entity("lan-adapter", "local-plane", 230, 48, tryout ? { label: "Mock adapter", detail: "Simulated integration data", icon: "edge" } : { label: "Integrations", detail: "LAN/WAN adapter; e.g. LG ThinQ", icon: "edge" }));
    nodes.push(entity("lan-devices", "local-plane", 462, 48, tryout ? { label: "Simulated devices", detail: "No home hardware configured", icon: "device" } : { label: "Core Devices", detail: "Built-in adapters: Zigbee; Matter planned", icon: "device" }));
    edges.push(directed("client-to-core", "clients", "core"));
    edges.push(directed("core-to-lan", "core", "lan-adapter"));
    edges.push(directed("lan-to-devices", "lan-adapter", "lan-devices"));
    if (hasZigbee) addZigbee(nodes, edges, "local-plane", 230, 165, 462, 165, "core");
  }

  if (hasMatter) addThread(nodes, edges, "local-plane", 230, 280, remoteCoreProfile ? "secure-edge" : "core");
  if (hasVoice) addVoiceClient(nodes, edges, "client-plane", 10, 145, remoteCoreProfile ? "remote-core" : "core");
  return { nodes, edges };
}

function buildNarrowGraph(profile: ProfileId, connectivity: Connectivity[], voice: VoiceNeed): { nodes: Node[]; edges: Edge[] } {
  const hasZigbee = connectivity.includes("zigbee");
  const hasMatter = connectivity.includes("matter-ip") || connectivity.includes("matter-thread");
  const hasVoice = voice !== "none";
  const hybrid = profile === "hybrid";
  const tryout = profile === "tryout";
  const remoteCoreProfile = hybrid;
  const clientHeight = hasVoice ? 220 : 100;
  const cloudY = clientHeight + 24;
  const localY = remoteCoreProfile ? cloudY + 160 : clientHeight + 24;
  const localHeight = hasMatter ? 480 : 340;
  const narrowEntity = (id: string, parentId: string, x: number, y: number, data: EntityData) => entity(id, parentId, x, y, { ...data, vertical: true });
  const nodes: Node[] = [
    plane("client-plane", "Clients", 16, 16, 300, clientHeight),
    narrowEntity("clients", "client-plane", 72, 28, { label: "PWA / mobile / MCP", detail: "Browser, app, and scoped clients", icon: "client" }),
    plane("local-plane", remoteCoreProfile ? "Home / SBC adapter plane" : "Local / home plane", 16, localY, 300, localHeight),
  ];
  const edges: Edge[] = [];

  if (remoteCoreProfile) nodes.push(plane("cloud-plane", "Cloud / remote plane", 16, cloudY, 300, 130));

  if (remoteCoreProfile) {
    nodes.push(narrowEntity("remote-core", "cloud-plane", 72, 36, { label: hybrid ? "Cloud Homenavi core" : "Remote Homenavi core", detail: hybrid ? "Core stays together by default" : "TLS edge, services, backups", icon: "cloud" }));
    nodes.push(narrowEntity("secure-edge", "local-plane", 72, 40, { label: hybrid ? "SBC adapter host" : "Secure edge", detail: hybrid ? "LAN/WAN and radio adapters" : "Reviewed home-to-cloud path", icon: "edge", branching: true }));
    nodes.push(narrowEntity("lan-adapter", "local-plane", 150, 140, { label: "Integrations", detail: "LAN/WAN adapter; e.g. LG ThinQ", icon: "edge" }));
    nodes.push(narrowEntity("lan-devices", "local-plane", 150, 240, { label: "Integration Devices", detail: "LG ThinQ and supported services", icon: "device" }));
    edges.push(directed("client-to-cloud", "clients", "remote-core"));
    edges.push(directed("cloud-to-edge", "remote-core", "secure-edge"));
    edges.push(directed("edge-to-lan", "secure-edge", "lan-adapter", false, "source-lan"));
    edges.push(directed("lan-to-devices", "lan-adapter", "lan-devices"));
    if (hasZigbee) addZigbee(nodes, edges, "local-plane", 20, 140, 20, 240, "secure-edge", true, "source-zigbee");
  } else {
    const coreData = tryout
      ? { label: "Homenavi tryout", detail: "Compose stack with mock adapter", icon: "core" as const }
      : profile === "kubernetes"
      ? { label: "Homenavi cluster", detail: "Helm release, ingress, and storage", icon: "core" as const }
      : { label: "Homenavi core", detail: "Compose services, MQTT, and storage", icon: "core" as const };
    nodes.push(narrowEntity("core", "local-plane", 72, 40, { ...coreData, branching: hasZigbee || hasMatter }));
    nodes.push(narrowEntity("lan-adapter", "local-plane", 150, 140, tryout ? { label: "Mock adapter", detail: "Simulated integration data", icon: "edge" } : { label: "Integrations", detail: "LAN/WAN adapter; e.g. LG ThinQ", icon: "edge" }));
    nodes.push(narrowEntity("lan-devices", "local-plane", 150, 240, tryout ? { label: "Simulated devices", detail: "No home hardware configured", icon: "device" } : { label: "Integration Devices", detail: "LG ThinQ and supported services", icon: "device" }));
    edges.push(directed("client-to-core", "clients", "core"));
    if (hybrid) {
      nodes.push(narrowEntity("remote-service", "cloud-plane", 72, 36, { label: "Remote service", detail: "Optional inference or vendor API", icon: "cloud" }));
      edges.splice(0, 1, directed("client-to-cloud", "clients", "remote-service"));
      edges.push(directed("cloud-to-core", "remote-service", "core"));
    }
    edges.push(directed("core-to-lan", "core", "lan-adapter", false, hasZigbee || hasMatter ? "source-lan" : undefined));
    edges.push(directed("lan-to-devices", "lan-adapter", "lan-devices"));
    if (hasZigbee) addZigbee(nodes, edges, "local-plane", 20, 140, 20, 240, "core", true, "source-zigbee");
  }

  if (hasMatter) addThread(nodes, edges, "local-plane", 150, 340, remoteCoreProfile ? "secure-edge" : "core", true, "source-matter");
  if (hasVoice) addVoiceClient(nodes, edges, "client-plane", 72, 128, remoteCoreProfile ? "remote-core" : "core", true);
  return { nodes, edges };
}

function addZigbee(nodes: Node[], edges: Edge[], parentId: string, adapterX: number, adapterY: number, deviceX: number, deviceY: number, source: string, vertical = false, sourceHandle?: string) {
  nodes.push(entity("zigbee-edge", parentId, adapterX, adapterY, { label: "Zigbee edge", detail: "Coordinator + Zigbee2MQTT", icon: "radio", vertical }));
  nodes.push(entity("zigbee-devices", parentId, deviceX, deviceY, { label: "Zigbee devices", detail: "Supported device mesh", icon: "device", vertical }));
  edges.push(directed("source-to-zigbee", source, "zigbee-edge", false, sourceHandle));
  edges.push(directed("zigbee-to-devices", "zigbee-edge", "zigbee-devices"));
}

function addThread(nodes: Node[], edges: Edge[], parentId: string, x: number, y: number, source: string, vertical = false, sourceHandle?: string) {
  nodes.push(entity("thread-todo", parentId, x, y, { label: "Matter / Thread", detail: "TODO: controller and commissioning", icon: "radio", tone: "caution", vertical }));
  edges.push(directed("source-to-thread", source, "thread-todo", true, sourceHandle));
}

function addVoiceClient(nodes: Node[], edges: Edge[], parentId: string, x: number, y: number, target: string, vertical = false) {
  nodes.push(entity("voice", parentId, x, y, { label: "Voice assistant (MCP)", detail: "Client today; device role planned", icon: "voice", tone: "caution", vertical }));
  edges.push(directed("voice-to-core", "voice", target, true));
}
