"use client";

import { useState } from "react";

const COMPOSE = `git clone https://github.com/PetoAdam/homenavi.git
cd homenavi
cp .env.example .env
docker compose pull
docker compose up -d`;

const HELM = `git clone https://github.com/PetoAdam/homenavi.git
cd homenavi
helm upgrade --install homenavi ./helm/homenavi \\
  -n homenavi --create-namespace`;

const options = {
  compose: {
    label: "Compose",
    code: COMPOSE,
    note: "The canonical path for local and small instances. Add the opt-in mock-adapter profile to explore without hardware.",
    href: "/guides/quickstart",
  },
  helm: {
    label: "Helm",
    code: HELM,
    note: "The Kubernetes path for core services, persistent storage, and configured HA operations.",
    href: "/guides/self-hosting",
  },
} as const;

type DeploymentOption = keyof typeof options;

export default function DeploymentTabs() {
  const [selected, setSelected] = useState<DeploymentOption>("compose");
  const option = options[selected];

  return (
    <div className="deployment-tabs">
      <div className="deployment-tab-list" role="tablist" aria-label="Deployment options">
        {(Object.keys(options) as DeploymentOption[]).map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={selected === key}
            className={selected === key ? "active" : ""}
            onClick={() => setSelected(key)}
          >
            {options[key].label}
          </button>
        ))}
      </div>
      <div className="terminal" role="tabpanel" aria-label={`${option.label} installation commands`}>
        <div className="terminal-head">
          <span className="terminal-dot" />
          <span className="terminal-name">{option.label.toLowerCase()} deployment</span>
          <span className="terminal-meta">self-hosted</span>
        </div>
        <pre className="terminal-body"><code>{option.code}</code></pre>
      </div>
      <div className="deployment-tab-note">
        <p>{option.note}</p>
        <a className="btn secondary" href={option.href}>Read {option.label} guide</a>
      </div>
    </div>
  );
}