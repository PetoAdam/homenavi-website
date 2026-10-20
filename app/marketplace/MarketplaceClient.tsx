"use client";

import { useState } from "react";
import { Integration, capabilities } from "../../lib/integrations";

export default function MarketplaceClient({
  integrations,
  source,
}: {
  integrations: Integration[];
  source: "live" | "cache";
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "verified" | "featured" | "trending">("all");

  const filtered = integrations.filter((i) => {
    if (filter === "verified" && !i.verified) return false;
    if (filter === "featured" && !i.featured) return false;
    if (filter === "trending" && i.trending_score <= 0) return false;
    const q = query.toLowerCase();
    return !q || i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q);
  });

  return (
    <div>
      <div className="marketplace-controls">
        <input
          type="search"
          className="search-input"
          placeholder="Search integrations…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search integrations"
        />
        <div className="filter-pills" role="group" aria-label="Filter integrations">
          {(["all", "verified", "featured", "trending"] as const).map((f) => (
            <button
              key={f}
              type="button"
              className={`filter-pill${filter === f ? " active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <p className="marketplace-source">
        {source === "live" ? "Showing live marketplace data." : "Showing cached marketplace data."}
        {filtered.length} integration{filtered.length === 1 ? "" : "s"}.
      </p>

      <div className="grid cols-3">
        {filtered.map((i) => (
          <a key={i.id} className="integration-card" href={`/marketplace/${i.id}`}>
            <div className="integration-card-head">
              <h3>{i.name}</h3>
              <span className="pill neutral">v{i.version}</span>
            </div>
            <p className="card-desc">{i.description}</p>
            <p className="integration-publisher">{i.publisher}</p>
            <div className="integration-badges">
              {i.verified && <span className="pill success">Verified</span>}
              {i.featured && <span className="pill primary">Featured</span>}
              {i.trending_score > 0 && <span className="pill warning">Trending</span>}
              {capabilities(i).slice(0, 3).map((c) => (
                <span key={c} className="pill">{c}</span>
              ))}
            </div>
          </a>
        ))}
        {filtered.length === 0 && (
          <div className="glass-card">
            <p className="card-desc">No integrations match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
