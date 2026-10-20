import { Metadata } from "next";
import { PageHeader, GlassCard } from "../components/ui";

export const metadata: Metadata = {
  title: "Community",
  description: "Join the Homenavi community: Discord, GitHub issues, and contributions.",
};

export default function CommunityPage() {
  return (
    <>
      <section className="section">
        <PageHeader
          title="Community"
          subtitle="Homenavi is open source and built in the open. Get help, share ideas, and contribute."
        />
        <div className="grid cols-3">
          <GlassCard>
            <h3 className="card-title">Discord</h3>
            <p className="card-desc">
              Chat with other self-hosters and integration authors. Ask questions, show off
              your dashboards, and get quick help.
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
              <a className="btn secondary" href="https://github.com/PetoAdam/homenavi">Repository</a>
              <a className="btn ghost" href="https://github.com/PetoAdam/homenavi/issues">Issues</a>
            </div>
          </GlassCard>
          <GlassCard>
            <h3 className="card-title">Contribute</h3>
            <p className="card-desc">
              The easiest way to contribute is to build an integration for a device or service
              you use. Start from the integration template and publish it to the marketplace.
            </p>
            <div className="hero-cta">
              <a className="btn ghost" href="/guides/integration-setup">Integration guide</a>
            </div>
          </GlassCard>
        </div>
      </section>
    </>
  );
}
