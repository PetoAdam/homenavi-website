# Self-hosting

Homenavi is designed to run on your own infrastructure. There are two supported deployment paths: Docker Compose for local and small instances, and Helm for Kubernetes clusters.

## Docker Compose (canonical path)

```sh
git clone https://github.com/PetoAdam/homenavi.git
cd homenavi
cp .env.example .env
docker compose pull
docker compose up -d
```

To explore the platform without hardware, start the opt-in mock adapter profile, which publishes a simulated device tree over MQTT:

```sh
docker compose up -d --profile mock-adapter
```

Notes:

- Compose pulls prebuilt release images from GitHub Container Registry. Use `docker compose up --build` only when developing from source.
- The stack defaults to EMQX as the MQTT backbone.
- Nginx handles HTTPS/WSS ingress; dev modes are documented in the nginx guide.
- Nginx is the ingress, so once the edge services are up the platform is reachable at `http://localhost`.

## Kubernetes (Helm)

```sh
helm upgrade --install homenavi ./helm/homenavi -n homenavi --create-namespace
```

The Helm chart covers the current Kubernetes path for all core services. Runbooks exist for a Minikube MVP and for HA operations.

## Service map

| Domain | Services | Responsibility |
|---|---|---|
| Ingress and edge API | nginx, api-gateway | Public HTTPS/WSS ingress, auth checks, route and websocket dispatch |
| Identity and access | auth-service, user-service | Login/session/JWT, lockouts/2FA, RBAC-aware profiles and roles |
| Home model and state | entity-registry-service, device-hub, history-service | Canonical inventory, rooms/tags/groups/map metadata, HDP command/state plane, historical persistence |
| Automation and UI model | automation-service, dashboard-service | Workflow engine, run stream, widget and dashboard persistence |
| Integrations runtime | integration-proxy, installed integrations | Registry, UI/API proxying, install/update orchestration, action execution |
| Messaging and data infra | EMQX, PostgreSQL, Redis, SeaweedFS | MQTT backbone, relational storage, cache/rate-limit state, object storage |

## Observability

- Prometheus scrape endpoints on core services.
- Jaeger traces exported from all core services.
- Correlation IDs propagated through gateway and service hops.
- Shared OpenTelemetry bootstrap wired into each service bootstrap.

## Security posture

- RS256 JWT signing and verification.
- Email-based 2FA and lockout policy.
- Redis-backed rate limiting and lockout state.
- Integration runtime privilege boundaries depend on deployment mode; treat docker-socket access as high trust.

## Reference docs

- Production deployment guide: `doc/deployment_guide.md` in the main repository.
- MQTT broker topologies: `doc/mqtt_broker_topologies.md`.
- HDP contract and topic model: `doc/hdp.md`.
