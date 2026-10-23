import { Metadata } from "next";
import { GlassCard } from "../components/ui";

export const metadata: Metadata = {
  title: "Community",
  description: "Join the Homenavi community: Discord, GitHub issues, and contributions.",
};

export default function CommunityPage() {
  return (
    <>
      <section className="section hero reveal">
        <div className="hero-copy">
          <p className="eyebrow">Community</p>
          <h1 className="hero-title">
            Built in the open, <span className="accent">by people like you</span>.
          </h1>
          <p className="hero-lede">
            Homenavi is open source and shaped by the people who run it. Self-hosters, integration
            authors and device tinkerers all push the platform forward.
          </p>
          <div className="hero-cta">
            <a className="btn primary" href="https://discord.gg/NhrYCtgNWk">Join Discord</a>
            <a className="btn secondary" href="https://github.com/PetoAdam/homenavi">
              GitHub repository
            </a>
          </div>
          <div className="hero-meta">
            <span>MIT-licensed core</span>
            <span className="meta-sep" aria-hidden="true">/</span>
            <span>integration-first</span>
            <span className="meta-sep" aria-hidden="true">/</span>
            <span>support in Discord</span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="grid cols-2">
            <GlassCard>
              <h3 className="card-title">Discord</h3>
              <p className="card-desc">
                Chat with other self-hosters and integration authors. Ask questions, show off your
                dashboards, and get quick help.
              </p>
              <div className="hero-cta">
                <a className="btn primary" href="https://discord.gg/NhrYCtgNWk">Join the server</a>
              </div>
            </GlassCard>
            <GlassCard>
              <h3 className="card-title">GitHub</h3>
              <p className="card-desc">
                File bugs, propose features, and review pull requests on the main repository.
                Integration repos live alongside it.
              </p>
              <div className="hero-cta">
                <a className="btn secondary" href="https://github.com/PetoAdam/homenavi">
                  Repository
                </a>
                <a className="btn ghost" href="https://github.com/PetoAdam/homenavi/issues">
                  Issues
                </a>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      <section className="section reveal">
        <div className="feature-band">
          <div>
            <h2>Contribute an integration</h2>
            <p>
              The easiest way to contribute is to build an integration for a device or service you
              already use. The template repo gives you a working service, manifest, and marketplace
              packaging from day one.
            </p>
            <div className="hero-cta">
              <a className="btn primary" href="/guides/integration-setup">Integration guide</a>
              <a
                className="btn secondary"
                href="https://github.com/PetoAdam/homenavi-integration-template"
                rel="external"
              >
                Template repo
              </a>
            </div>
          </div>
          <div className="code-block">
            <code>
              git clone https://github.com/PetoAdam/homenavi-integration-template
              cd homenavi-integration-template
              npm install && npm run dev
            </code>
          </div>
        </div>
      </section>
    </>
  );
}
