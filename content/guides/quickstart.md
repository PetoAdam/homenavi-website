# Quickstart

Get a working Homenavi instance in a few minutes with Docker Compose. The quickstart uses prebuilt release images, so no local build is required.

## Prerequisites

- Docker and Docker Compose
- Git
- Ports 80/443 available on your machine

## 1. Clone the repository

```sh
git clone https://github.com/PetoAdam/homenavi.git
cd homenavi
```

## 2. Configure environment

```sh
cp .env.example .env
```

The defaults are enough for a first run. Set `HN_VERSION=vX.Y.Z` in `.env` to pin a specific release.

## 3. Start the stack

```sh
docker compose pull
docker compose up -d
```

This starts the platform: nginx ingress, API gateway, auth, user, dashboard, device-hub, entity registry, history, automation, weather, integration-proxy, EMQX, PostgreSQL, Redis, and SeaweedFS.

## 4. Open the app

```sh
docker compose ps
```

Once the edge services are running, open `http://localhost` in your browser and create an account.

## Optional profiles

- **Mock adapter** — opt-in profile that seeds fake devices so you can explore dashboards and automations without hardware.
- **Zigbee2MQTT** — opt-in through the `hardware` profile. It is disabled by default so a local evaluation never claims a USB coordinator.

## Next steps

- [Deployment guide](/deploy) to choose between local, hybrid, cloud-first, and Kubernetes-oriented paths before expanding the installation.
- [Self-hosting guide](/guides/self-hosting) for production and Kubernetes deployment.
- [Automations guide](/guides/automations) to build your first workflow.
- [Integrations](/integrations) to extend Homenavi with device and service connectors.
