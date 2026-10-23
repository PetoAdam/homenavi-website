# MCP connections

Homenavi provides a Streamable HTTP MCP endpoint so you can connect a compatible external assistant without embedding that assistant in the platform.

## Authentication

The endpoint uses OAuth 2.1 Authorization Code with PKCE and Dynamic Client Registration. A compatible client can register and complete the authorization flow without a Homenavi-specific client ID.

## Available tools

- Read inventory and history.
- Control devices and groups.
- Create groups.
- Read workflows and run existing workflows.

The server deliberately does not expose pairing, dashboard edits, user changes, automation editing, or event subscriptions over MCP.

## Connect a client

1. Open your MCP-compatible assistant's connection settings.
2. Add the Homenavi MCP endpoint at `/mcp` on your Homenavi deployment.
3. Complete the browser-based OAuth authorization flow.
4. Grant only the scopes the assistant needs.

## Use it well

Keep an assistant scoped to the rooms, devices, and actions you want it to access. MCP can inspect or run an existing workflow, but visual workflow authoring remains in the Homenavi app.