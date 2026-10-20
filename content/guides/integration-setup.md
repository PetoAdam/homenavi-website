# Integration setup

Homenavi is integration-first: devices, dashboards widgets, and automation actions can all be extended by installed integrations. This guide explains how integrations work and how to run one locally.

## How the integration runtime works

- The **integration-proxy** service keeps a registry of installed integrations and proxies their UI and API.
- Integrations declare a **manifest** describing widgets, device extensions, automation extensions, auth, and setup UI.
- Marketplace entries carry **artifact-driven deployment metadata** (Compose files and Helm chart references), so installs are reproducible.
- Verified releases pass a verify/release gate before appearing in the marketplace.

## Install an integration from the marketplace

1. Open the **Integrations** page in the Homenavi app.
2. Browse the marketplace and pick an integration (for example Spotify or LG ThinQ).
3. Install it — the runtime deploys the integration service using its Compose or Helm artifact.
4. Open the integration's setup UI to connect an account or configure devices.

## Run an integration locally (development)

Start from the official template:

```sh
git clone https://github.com/PetoAdam/homenavi-integration-template
cd homenavi-integration-template
docker compose -f compose/docker-compose.dev.yml up
```

The template includes:

- A manifest scaffold (`manifest/`)
- A dev compose file wired to the Homenavi dev stack
- A validation command for the manifest:

```sh
go run ./cmd/validate-manifest
```

## Extension points

| Extension | What it adds |
|---|---|
| Widgets | Dashboard cards rendered by the integration |
| Device extension | Devices that participate in the HDP command/state plane |
| Automation extension | Actions usable inside automation workflows |
| Auth | Account linking (OIDC/OAuth) for the integration |
| Setup UI | Configuration screens inside the app |

## Reference integrations

- [Spotify](https://github.com/PetoAdam/homenavi-spotify) — playback, devices, and playlists from Homenavi.
- [LG ThinQ](https://github.com/PetoAdam/homenavi-lg-thinq) — appliance control and automations.
- [Connector](https://github.com/PetoAdam/homenavi-connector) — blinds and device connectivity.
- [eModul](https://github.com/PetoAdam/homenavi-emodul) — modular device support.

## Troubleshooting an integration

- Confirm the manifest validates (`cmd/validate-manifest`).
- Check the integration-proxy logs for install or proxy errors.
- Verify the integration's compose/helm artifact exists and is reachable.
- See the [troubleshooting guide](/guides/troubleshooting) for common platform issues.
