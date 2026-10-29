"use client";

import { Background, BaseEdge, EdgeLabelRenderer, Handle, MarkerType, Panel, Position, ReactFlow, type Edge, type EdgeProps, type Node, type NodeProps } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Database, GitBranch, MonitorSmartphone, Network, PlugZap, Radio, Server, ShieldCheck, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";

type FlowKind = "runtime" | "state";
type IconName = "client" | "edge" | "service" | "event" | "integration" | "device" | "database" | "automation";
type HandleSide = "left" | "right" | "top" | "bottom";
type FlowNodeData = { label: string; detail: string; icon: IconName; emphasis?: boolean; vertical?: boolean; compact?: boolean; wide?: boolean; bottomRightSource?: boolean; sourceSide?: HandleSide; targetSide?: HandleSide; sourceSides?: HandleSide[]; targetSides?: HandleSide[] };
type PlaneData = { label: string };
type ArchitectureNode = Node<FlowNodeData, "architecture">;
type PlaneNode = Node<PlaneData, "plane">;

const icons: Record<IconName, LucideIcon> = {
  client: MonitorSmartphone,
  edge: ShieldCheck,
  service: Server,
  event: Network,
  integration: PlugZap,
  device: Radio,
  database: Database,
  automation: GitBranch,
};

const nodeTypes = { architecture: ArchitectureNode, plane: Plane };
const edgeTypes = { mergedHdp: MergedHdpEdge };
const supported = { stroke: "#57c394", strokeWidth: 1.6 };

export default function ArchitectureFlow({ kind }: { kind: FlowKind }) {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 720px)");
    const update = () => setNarrow(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  const graph = kind === "runtime" ? runtimeGraph(narrow) : stateGraph(narrow);
  return <div className={`architecture-react-flow ${kind} ${narrow ? "narrow" : ""}`} aria-label={kind === "runtime" ? "Homenavi runtime topology diagram" : "Homenavi realtime state path diagram"}>
    <ReactFlow
      key={`${kind}-${narrow ? "narrow" : "wide"}`}
      nodes={graph.nodes}
      edges={graph.edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      fitView
      fitViewOptions={{ padding: narrow ? 0.035 : 0.055 }}
      minZoom={0.45}
      maxZoom={1.2}
      nodesConnectable={false}
      nodesDraggable={false}
      elementsSelectable={false}
      edgesReconnectable={false}
      panOnDrag={false}
      panOnScroll={false}
      preventScrolling={false}
      zoomOnDoubleClick={false}
      zoomOnPinch={false}
      zoomOnScroll={false}
      proOptions={{ hideAttribution: true }}
    >
      <Background color="rgba(233, 238, 244, 0.08)" gap={18} size={1} />
      {kind === "runtime" && !narrow ? <Panel position="bottom-left" className="architecture-flow-note">The API Gateway also has REST routes to Entity Registry Service, History Service, and Automation Service. They are intentionally omitted here to keep the HDP paths readable.</Panel> : null}
    </ReactFlow>
  </div>;
}

function ArchitectureNode({ data }: NodeProps<ArchitectureNode>) {
  const Icon = icons[data.icon];
  const position = (side: HandleSide) => side === "left" ? Position.Left : side === "right" ? Position.Right : side === "top" ? Position.Top : Position.Bottom;
  const targetSides = data.targetSides ?? [];
  const sourceSides = data.sourceSides ?? [];
  return <div className={`architecture-flow-node${data.emphasis ? " emphasis" : ""}${data.compact ? " compact" : ""}${data.wide ? " wide" : ""}`}>
    {targetSides.map((side) => <Handle key={`target-${side}`} id={`target-${side}`} type="target" position={position(side)} className="architecture-flow-handle" />)}
    <span><Icon size={16} strokeWidth={1.8} /></span>
    <div><strong>{data.label}</strong><small>{data.detail}</small></div>
    {sourceSides.map((side) => <Handle key={`source-${side}`} id={`source-${side}`} type="source" position={position(side)} className="architecture-flow-handle" />)}
    {data.bottomRightSource ? <Handle id="source-bottom-right" type="source" position={Position.Bottom} className="architecture-flow-handle" style={{ left: "78%" }} /> : null}
  </div>;
}

function MergedHdpEdge({ data, label, markerEnd, markerStart, sourceX, sourceY, style, targetX, targetY }: EdgeProps) {
  const mergeX = typeof data === "object" && data && "mergeX" in data && typeof data.mergeX === "number" ? data.mergeX : 900;
  const direction = Math.sign(targetY - sourceY) || 1;
  const radius = 6;
  const path = `M ${sourceX} ${sourceY} H ${mergeX + radius} Q ${mergeX} ${sourceY} ${mergeX} ${sourceY + direction * radius} V ${targetY - direction * radius} Q ${mergeX} ${targetY} ${mergeX - radius} ${targetY} H ${targetX}`;
  const labelX = (sourceX + mergeX) / 2;

  return <>
    <BaseEdge path={path} markerEnd={markerEnd} markerStart={markerStart} style={style} />
    {label ? <EdgeLabelRenderer><div className="architecture-flow-edge-label" style={{ transform: `translate(-50%, -50%) translate(${labelX}px, ${sourceY - 10}px)` }}>{label}</div></EdgeLabelRenderer> : null}
  </>;
}

function Plane({ data }: NodeProps<PlaneNode>) {
  return <div className="architecture-plane-label">{data.label}</div>;
}

function node(id: string, x: number, y: number, data: FlowNodeData, parentId?: string): ArchitectureNode {
  return { id, type: "architecture", parentId, extent: parentId ? "parent" : undefined, position: { x, y }, data, draggable: false, selectable: false };
}

function plane(id: string, label: string, x: number, y: number, width: number, height: number): PlaneNode {
  return { id, type: "plane", position: { x, y }, data: { label }, draggable: false, selectable: false, style: { width, height }, className: `architecture-plane ${id}` };
}

function edge(id: string, source: string, target: string, label?: string, sourceHandle?: string, targetHandle?: string, type: "straight" | "smoothstep" | "mergedHdp" = "smoothstep", bidirectional = false): Edge {
  return { id, source, target, label, sourceHandle, targetHandle, type, animated: true, markerEnd: { type: MarkerType.ArrowClosed, color: "#57c394" }, markerStart: bidirectional ? { type: MarkerType.ArrowClosed, color: "#57c394" } : undefined, style: supported, labelStyle: { fill: "#a9b8c5", fontSize: 9 }, labelBgStyle: { fill: "#1b232d", fillOpacity: 0.92 }, labelBgPadding: [3, 2], labelBgBorderRadius: 2, data: type === "mergedHdp" ? { mergeX: 900 } : undefined };
}

function runtimeGraph(narrow: boolean): { nodes: Node[]; edges: Edge[] } {
  if (narrow) {
    const nodes = [
      node("mobile-clients", 72, 18, { label: "Client plane", detail: "Browser and MCP clients", icon: "client", vertical: true, sourceSides: ["bottom"] }),
      node("mobile-core", 72, 150, { label: "Core / control plane", detail: "Nginx, gateway, and services", icon: "edge", emphasis: true, vertical: true, targetSides: ["top"], sourceSides: ["bottom"] }),
      node("mobile-edge", 8, 292, { label: "Edge / device plane", detail: "Adapters and devices", icon: "device", compact: true, vertical: true, targetSides: ["top"] }),
      node("mobile-integrations", 166, 292, { label: "Integration plane", detail: "Proxy and extensions", icon: "integration", compact: true, vertical: true, targetSides: ["top"], sourceSides: ["bottom"] }),
      node("mobile-marketplace", 72, 424, { label: "Marketplace plane", detail: "Catalog and publishing", icon: "service", vertical: true, targetSides: ["top"] }),
    ];
    return { nodes, edges: [
      edge("mobile-client-core", "mobile-clients", "mobile-core", "HTTPS / WSS /mcp", "source-bottom", "target-top"),
      edge("mobile-core-edge", "mobile-core", "mobile-edge", "REST + HDP", "source-bottom", "target-top"),
      edge("mobile-core-integrations", "mobile-core", "mobile-integrations", "/integrations", "source-bottom", "target-top"),
      edge("mobile-integrations-marketplace", "mobile-integrations", "mobile-marketplace", "REST catalog", "source-bottom", "target-top"),
    ] };
  }
  const nodes = [
    plane("client-plane", "Client plane", 16, 16, 200, 570),
    node("mcp-client", 16, 130, { label: "MCP client", detail: "HTTPS /mcp", icon: "client", sourceSides: ["right"] }, "client-plane"),
    node("browser", 16, 340, { label: "Browser dashboard", detail: "HTTPS, WSS, catalog", icon: "client", sourceSides: ["right", "bottom"] }, "client-plane"),
    plane("core-plane", "Core / control plane", 240, 16, 760, 570),
    node("edge", 30, 66, { label: "API Gateway", detail: "REST + WebSocket routes", icon: "edge", emphasis: true, bottomRightSource: true, targetSides: ["bottom"], sourceSides: ["right"] }, "core-plane"),
    node("nginx", 30, 195, { label: "Nginx", detail: "HTTPS, WSS, /mcp, /integrations", icon: "edge", targetSides: ["left"], sourceSides: ["top", "right"] }, "core-plane"),
    node("device-hub", 275, 280, { label: "Device Hub", detail: "HDP commands, state, pairing", icon: "database", wide: true, targetSides: ["left", "right"], sourceSides: ["bottom"] }, "core-plane"),
    node("api-services", 300, 35, { label: "REST API services", detail: "Auth, User, Dashboard, MCP, Weather, Echo", icon: "service", wide: true, targetSides: ["left"], sourceSides: ["right"] }, "core-plane"),
    node("support-services", 535, 35, { label: "Support services", detail: "Email and Profile Picture", icon: "service", targetSides: ["left"], sourceSides: [] }, "core-plane"),
    node("entity-registry-service", 165, 480, { label: "Entity Registry", detail: "HDP metadata and events", icon: "service", targetSides: ["top"], sourceSides: [] }, "core-plane"),
    node("history-service", 350, 480, { label: "History Service", detail: "HDP state ingest", icon: "database", targetSides: ["top"], sourceSides: [] }, "core-plane"),
    node("automation-service", 535, 480, { label: "Automation Service", detail: "HDP triggers and commands", icon: "automation", targetSides: ["top"], sourceSides: [] }, "core-plane"),
    plane("edge-plane", "Edge / device plane", 1024, 16, 300, 280),
    node("devices", 67, 40, { label: "Physical devices", detail: "Adapter protocol", icon: "device", vertical: true, targetSides: ["bottom"] }, "edge-plane"),
    node("adapters", 50, 145, { label: "Device adapters", detail: "HDP metadata, state, events; commands", icon: "device", wide: true, targetSides: [], sourceSides: ["left", "top"] }, "edge-plane"),
    plane("integration-plane", "Integration runtime plane", 1024, 314, 300, 272),
    node("integrations", 67, 30, { label: "Integration Proxy", detail: "Registry and install/update orchestration", icon: "integration", targetSides: ["left"], sourceSides: ["right", "bottom"] }, "integration-plane"),
    node("hdp-integrations", 67, 115, { label: "HDP integrations", detail: "LG ThinQ, eModul, Connector", icon: "integration", targetSides: ["top"], sourceSides: ["left", "bottom"] }, "integration-plane"),
    node("integration-devices", 67, 200, { label: "Integration devices", detail: "Washers, blinds, vendor devices", icon: "device", targetSides: ["top"], sourceSides: [] }, "integration-plane"),
    plane("marketplace-plane", "Marketplace plane", 240, 610, 760, 200),
    node("marketplace", 285, 65, { label: "Marketplace", detail: "REST catalog, releases, and web", icon: "service", targetSides: ["left", "right"], sourceSides: [] }, "marketplace-plane"),
  ];
  return { nodes, edges: [
    edge("mcp-nginx", "mcp-client", "nginx", "HTTPS /mcp", "source-right", "target-left"),
    edge("browser-nginx", "browser", "nginx", "HTTPS + WSS", "source-right", "target-left"),
    edge("nginx-gateway", "nginx", "edge", "/api, /ws, /mcp", "source-top", "target-bottom"),
    edge("gateway-services", "edge", "api-services", "REST routes", "source-right", "target-left"),
    edge("api-support", "api-services", "support-services", "REST", "source-right", "target-left"),
    edge("gateway-hub", "edge", "device-hub", "REST and WS", "source-right", "target-left"),
    edge("hub-ers", "device-hub", "entity-registry-service", "metadata/# + event/#", "source-bottom", "target-top", "smoothstep", true),
    edge("hub-history", "device-hub", "history-service", "state/#", "source-bottom", "target-top"),
    edge("hub-automation", "device-hub", "automation-service", "state/# + command/#", "source-bottom", "target-top", "smoothstep", true),
    edge("adapters-hub", "adapters", "device-hub", "HDP: hello, status, metadata, state, commands", "source-left", "target-right", "mergedHdp", true),
    edge("adapters-devices", "adapters", "devices", "adapter protocol", "source-top", "target-bottom"),
    edge("nginx-integrations", "nginx", "integrations", "/integrations", "source-right", "target-left", "smoothstep"),
    edge("proxy-integrations", "integrations", "hdp-integrations", "REST registry + UI", "source-bottom", "target-top"),
    edge("integrations-hub", "hdp-integrations", "device-hub", "MQTT / HDP", "source-left", "target-right", "mergedHdp", true),
    edge("integrations-devices", "hdp-integrations", "integration-devices", "vendor cloud / LAN", "source-bottom", "target-top", "smoothstep", true),
    edge("proxy-marketplace", "integrations", "marketplace", "REST install artifacts", "source-right", "target-right", "smoothstep"),
    edge("browser-marketplace", "browser", "marketplace", "HTTPS catalog API", "source-bottom", "target-left"),
  ] };
}

function coreServiceData(): FlowNodeData[] {
  return [
    { label: "Auth Service", detail: "Sessions and access", icon: "service" },
    { label: "User Service", detail: "Profiles and roles", icon: "service" },
    { label: "Dashboard Service", detail: "Widgets and layouts", icon: "service" },
    { label: "MCP Service", detail: "Scoped assistant tools", icon: "service" },
    { label: "Device Hub", detail: "State and commands", icon: "database" },
    { label: "Entity Registry Service", detail: "Rooms, tags, bindings", icon: "service" },
    { label: "History Service", detail: "State record and queries", icon: "database" },
    { label: "Automation Service", detail: "Triggers and workflows", icon: "automation" },
    { label: "Weather Service", detail: "Forecast facade", icon: "service" },
    { label: "Email Service", detail: "Transactional mail", icon: "service" },
    { label: "Profile Picture Service", detail: "Avatar lifecycle", icon: "service" },
    { label: "Echo Service", detail: "WebSocket diagnostics", icon: "service" },
  ];
}

function serviceId(data: FlowNodeData): string {
  return data.label.toLowerCase().replaceAll(" ", "-");
}

function stateGraph(narrow: boolean): { nodes: Node[]; edges: Edge[] } {
  const items: FlowNodeData[] = [
    { label: "Physical Device", detail: "A device changes state", icon: "device" },
    { label: "Adapter", detail: "Maps vendor data to HDP", icon: "integration" },
    { label: "EMQX + HDP", detail: "Publishes one shared event", icon: "event", emphasis: true },
    { label: "Device Hub", detail: "Projects current state", icon: "database" },
    { label: "Live surfaces", detail: "Dashboard, history, automation", icon: "client" },
  ];
  const nodes = items.map((item, index) => narrow
    ? node(`state-${index}`, 60, 16 + index * 94, { ...item, vertical: true, targetSides: index === 0 ? [] : ["top"], sourceSides: index === items.length - 1 ? [] : ["bottom"] })
    : node(`state-${index}`, 16 + index * 215, 72, { ...item, targetSides: index === 0 ? [] : ["left"], sourceSides: index === items.length - 1 ? [] : ["right"] })
  );
  return { nodes, edges: nodes.slice(0, -1).map((_, index) => edge(`state-edge-${index}`, `state-${index}`, `state-${index + 1}`)) };
}