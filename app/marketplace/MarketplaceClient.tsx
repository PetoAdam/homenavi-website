"use client";

import { useState } from "react";
import { Integration, capabilities, formatVersion } from "../../lib/integrations";

type Filter = "all" | "verified" | "featured" | "trending";
type Sort = "name" | "updated" | "downloads";

export default function MarketplaceClient({
  integrations,
  source,
}: {
  integrations: Integration[];
  source: "live" | "cache";
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("updated");

  const counts: Record<Filter, number> = {
    all: integrations.length,
    verified: integrations.filter((i) => i.verified).length,
    featured: integrations.filter((i) => i.featured).length,
    trending: integrations.filter((i) => i.trending_score > 0).length,
  };

  const filtered = integrations
    .filter((i) => {
      if (filter === "verified" && !i.verified) return false;
      if (filter === "featured" && !i.featured) return false;
      if (filter === "trending" && i.trending_score <= 0) return false;
      const q = query.toLowerCase();
      return !q || i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "downloads") return b.downloads - a.downloads;
      const bDate = b.updated_at || b.created_at || "";
      const aDate = a.updated_at || a.created_at || "";
      return bDate < aDate ? -1 : 1;
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
              {f} <span className="filter-count">{counts[f]}</span>
            </button>
          ))}
        </div>
        <label className="marketplace-sort">
          <span>Sort</span>
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="Sort integrations">
            <option value="updated">Recently updated</option>
            <option value="name">Name</option>
            <option value="downloads">Downloads</option>
          </select>
        </label>
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
              <div className="integration-badges">
                {i.verified && <span className="pill success">Verified</span>}
                {i.featured && <span className="pill primary">Featured</span>}
                {i.trending_score > 0 && <span className="pill warning">Trending</span>}
              </div>
            </div>
            <p className="card-desc">{i.description}</p>
            <div className="integration-meta">
              <span>{i.publisher}</span>
              <span>{formatVersion(i.version)}</span>
              <div className="caps">
                {capabilities(i).slice(0, 3).map((c) => (
                  <span key={c}>{c}</span>
                ))}
              </div>
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
