# Deployment guide

Choose the smallest supported Homenavi deployment that you can operate confidently. The interactive [deployment planner](/deploy) turns your hosting, hardware, device-connectivity, voice, and experience choices into a transparent recommendation.

## Supported paths

- **Docker Compose** is the supported starting point for local and small instances. It runs the Homenavi core and bundled dependencies on a host you control.
- **Helm** is the supported Kubernetes path when you already operate a cluster, persistent storage, ingress, and its upgrade lifecycle.
- **Hybrid** and **cloud-first** describe architecture decisions, not a hosted Homenavi service. Use the planner to review their network and device-connectivity consequences before choosing a host.

## Start with hardware you already have

Reuse a capable always-on computer, server, NAS, or existing Kubernetes cluster before buying anything new. A separate gateway is optional. It can help with radio placement, isolation, or independent availability, but it is not required merely because the core runs locally.

Pi-class hardware can suit a small deployment when storage and image support are validated for the specific board. It is not a blanket recommendation for local speech or LLM workloads.

## Protocol guidance

### Zigbee

Homenavi has a supported Zigbee path through a coordinator, Zigbee2MQTT, and the Zigbee adapter. The Compose `hardware` profile is opt-in because coordinator device mapping is host-specific. USB and Ethernet-attached coordinators are both deployment choices; radio placement and interference matter more than requiring a separate SBC.

The [SMLIGHT SLZB-MR3U](https://smlight.tech/product/slzb-mr3u/) is one conditional recommendation when you want a network-attached dual-radio device: its manufacturer documents concurrent Zigbee and Thread radios plus Ethernet and PoE. Use its Zigbee radio through the supported Zigbee2MQTT path. It is not the only workable choice; other compatible coordinators and supported network layouts remain valid.

For a local Homenavi deployment, a separate edge node is not required for the core or the supported Zigbee path. The core stack and Zigbee2MQTT can run on the same host. Add an edge host only for a specific need, such as putting the radio in a better location, isolating a network boundary, or keeping radio connectivity available independently. This does not add a validated Matter or Thread controller path.

### Matter and Thread

Matter support is planned. Thread is a networking technology, while Matter is an application-layer smart-home standard. A Thread radio does not provide a complete Matter controller, commissioning implementation, or persistent controller state. The SLZB-MR3U can be considered for future dual-radio deployments, but its Thread capability does not make Matter-over-Thread a supported Homenavi path today. Homenavi does not currently have a validated Thread Border Router or production Matter commissioning flow.

### Voice

The voice satellite is a proof of concept. Its Raspberry Pi and ReSpeaker configuration covers local wake-word detection and audio capture, but the main Homenavi voice gateway is not yet a supported deployment path and acoustic echo cancellation tuning remains unresolved. Do not select voice hardware as a prerequisite for a normal Homenavi installation.

## Optional remote access

First verify local access and keep Homenavi authentication enabled. For remote access, a [Cloudflare Tunnel with cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) can publish a reviewed external entry point, but it adds Cloudflare to the trust and availability boundary. [Tailscale](https://tailscale.com/kb/1017/install) is an alternative private mesh VPN for authenticated access without opening a public inbound port. Neither option is required for a local deployment, and neither should expose internal service ports directly.

## Compose checklist

Use the [Quickstart](/guides/quickstart) for verified commands. Before relying on the instance, review persistent storage, backups, networking, TLS, secrets, and upgrade strategy. The project `.env.example` is the authoritative configuration template; do not copy undocumented variables from third-party examples.

## Kubernetes checklist

Use the [Self-hosting guide](/guides/self-hosting) and the [main repository Helm runbook](https://github.com/PetoAdam/homenavi/tree/main/helm/homenavi). The chart requires deliberate decisions about StorageClasses, ingress and TLS, external or bundled dependencies, secret injection, monitoring, upgrades, and rollback.

## Reference documentation

- [Main deployment guide](https://github.com/PetoAdam/homenavi/blob/main/doc/deployment_guide.md)
- [Helm chart README](https://github.com/PetoAdam/homenavi/tree/main/helm/homenavi)
- [HA operations](https://github.com/PetoAdam/homenavi/blob/main/doc/helm_ha_operations.md)
- [MCP guide](/guides/mcp)
- [Integration setup](/guides/integration-setup)
