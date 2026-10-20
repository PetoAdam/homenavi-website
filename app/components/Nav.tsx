import NavClient from "./NavClient";

const links = [
  { href: "/features", label: "Features" },
  { href: "/integrations", label: "Integrations" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/guides", label: "Guides" },
  { href: "/community", label: "Community" },
  { href: "/changelog", label: "Changelog" },
];

export default function Nav() {
  return (
    <header className="site-nav">
      <div className="container nav-inner">
        <a className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">H</span>
          <span className="brand-name">Homenavi</span>
        </a>
        <NavClient links={links} />
      </div>
    </header>
  );
}
