# Automations

Homenavi's automation engine lets you compose workflows from triggers, branches, loops, sleeps, and device or integration actions.

## Trigger types

- **Manual** — run a workflow on demand from the UI.
- **Device state** — fire when a device changes state (via the HDP state plane).
- **Schedule** — run at a time, interval, or cron-like cadence.

## Building a workflow

1. Open **Automations** in the app.
2. Create a workflow and pick a trigger.
3. Drag nodes onto the canvas: branches, loops, sleeps, device commands, and integration actions.
4. Target devices by room, tag, or group — selector semantics resolve the inventory automatically.
5. Save and watch the live run stream to verify behavior.

## Example: evening lighting routine

```text
Trigger: schedule 21:30
  ├─ Command: living-room lights -> off
  ├─ Sleep: 10m
  └─ Command: hallway lights -> dim 20%
```

## Integration actions

Integrations expose actions through the runtime metadata, so automation workflows can call things like Spotify playback commands or LG ThinQ appliance routines directly.

## Tips

- Use the run stream websocket to debug workflows in realtime.
- Test with the mock adapter profile before wiring real hardware.
- Keep workflows small and composable; branches are easier to debug than monolithic chains.
