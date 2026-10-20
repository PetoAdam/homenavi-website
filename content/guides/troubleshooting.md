# Troubleshooting

Common issues and how to resolve them when running Homenavi.

## The app does not load after `docker compose up`

- Run `docker compose ps` and confirm nginx, api-gateway, and auth-service are up.
- Check logs: `docker compose logs nginx api-gateway auth-service`.
- Confirm ports 80/443 are free. Another web server on the host will block ingress.
- If you changed `.env`, restart the stack: `docker compose down && docker compose up -d`.

## MQTT / device state not updating

- Verify EMQX is running: `docker compose ps | grep emqx`.
- Check the HDP topic model in `doc/hdp.md` in the main repository.
- For Zigbee devices, enable the `hardware` profile so zigbee2MQTT starts; it is opt-in by default.
- Confirm the device-hub service has no connection errors in its logs.

## An integration fails to install

- Validate the integration manifest with `go run ./cmd/validate-manifest`.
- Check integration-proxy logs for registry or proxy errors.
- Confirm the deployment artifact (Compose file or Helm chart ref) is reachable.
- Treat docker-socket access as high trust: integrations that need it must be installed in a deployment mode that grants it.

## Login or 2FA problems

- Auth-service uses RS256 JWTs; clock drift on the host can invalidate tokens.
- Lockouts are Redis-backed; if you are locked out, wait for the lockout window or clear Redis state in a dev environment.
- Email 2FA requires a working SMTP configuration in `.env`.

## High memory or slow dashboards

- Dashboards persist layout state in the dashboard-service; large widget counts increase load. Trim unused widgets.
- History-service stores state persistence; prune history retention if storage grows unbounded.
- Prometheus and Jaeger are available for observability — check service metrics before assuming a code issue.

## Getting help

- [GitHub issues](https://github.com/PetoAdam/homenavi/issues) for bugs and feature requests.
- [Discord](https://discord.gg/NhrYCtgNWk) for community support and setup questions.
