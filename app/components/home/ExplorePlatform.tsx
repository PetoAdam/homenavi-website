const destinations = [
  { href: "/guides/mcp", label: "MCP", detail: "Connect an assistant with scoped OAuth access to Homenavi." },
  { href: "/features", label: "Features", detail: "Device control, dashboards, maps, and automation." },
  { href: "/marketplace", label: "Marketplace", detail: "Browse integration releases and capability metadata." },
  { href: "/integrations", label: "Integrations", detail: "See how external services extend the platform." },
  { href: "/architecture", label: "Architecture", detail: "Follow the realtime data, command, and service paths." },
  { href: "/guides", label: "Guides", detail: "Deploy, configure, and operate Homenavi." },
];

export default function ExplorePlatform() {
  return (
    <section className="section explore-platform reveal" aria-labelledby="explore-title">
      <div className="explore-heading">
        <p className="eyebrow">Continue exploring</p>
        <h2 id="explore-title">Choose the path that matches your next question.</h2>
      </div>
      <div className="explore-featured">
        <article className="explore-feature explore-feature-demo">
          <p>SEE THE PRODUCT</p>
          <h3>Inspect the interface before you deploy.</h3>
          <span>Open the evaluation experience or browse the dashboard, device, and automation screens.</span>
          <a className="btn primary" href="/demo">Open demo</a>
        </article>
        <article className="explore-feature explore-feature-deploy">
          <p>DEPLOY IT YOURSELF</p>
          <h3>Start with the hardware and control boundary you already have.</h3>
          <span>Answer a few practical questions, compare supported paths, and follow verified Compose or Helm steps.</span>
          <a className="btn secondary" href="/deploy">Find your deployment</a>
        </article>
      </div>
      <nav className="explore-links" aria-label="Explore Homenavi">
        {destinations.map((destination) => (
          <a href={destination.href} key={destination.href}>
            <span>{destination.label}</span>
            <small>{destination.detail}</small>
          </a>
        ))}
      </nav>
    </section>
  );
}
