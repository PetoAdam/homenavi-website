export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-col">
          <h4>Homenavi</h4>
          <p className="footer-tag">Open smart-home platform with a microservice core, MQTT/HDP realtime plane, and integration-first extensibility.</p>
        </div>
        <div className="footer-col">
          <h4>Product</h4>
          <ul>
            <li><a href="/features">Features</a></li>
            <li><a href="/demo">Live demo</a></li>
            <li><a href="/marketplace">Marketplace</a></li>
            <li><a href="/integrations">Integrations</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Docs</h4>
          <ul>
            <li><a href="/guides/quickstart">Quickstart</a></li>
            <li><a href="/guides/self-hosting">Self-hosting</a></li>
            <li><a href="/guides/automations">Automations</a></li>
            <li><a href="/guides/troubleshooting">Troubleshooting</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Community</h4>
          <ul>
            <li><a href="https://github.com/PetoAdam/homenavi" rel="external">GitHub</a></li>
            <li><a href="https://github.com/PetoAdam/homenavi/issues" rel="external">Issues</a></li>
            <li><a href="https://discord.gg/NhrYCtgNWk" rel="external">Discord</a></li>
            <li><a href="/community">Community page</a></li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Homenavi</span>
        <a href="https://github.com/PetoAdam/homenavi" rel="external">Source on GitHub</a>
      </div>
    </footer>
  );
}
