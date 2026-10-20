import { GlassCard } from "./components/ui";

export default function NotFound() {
  return (
    <section className="section">
      <GlassCard>
        <h1 className="page-title">Page not found</h1>
        <p className="page-subtitle">
          The page you are looking for does not exist. Try one of the main sections below.
        </p>
        <div className="hero-cta">
          <a className="btn primary" href="/">Home</a>
          <a className="btn secondary" href="/features">Features</a>
          <a className="btn ghost" href="/marketplace">Marketplace</a>
          <a className="btn ghost" href="/guides">Guides</a>
        </div>
      </GlassCard>
    </section>
  );
}
