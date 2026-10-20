"use client";

export default function NavClient({ links }: { links: { href: string; label: string }[] }) {
  return (
    <nav className="nav-links" aria-label="Primary">
      <div className="nav-pill-group">
        {links.map((l) => (
          <a key={l.href} href={l.href} className="nav-pill">{l.label}</a>
        ))}
      </div>
      <a href="/demo" className="btn demo-cta">Try the live demo</a>
      <button
        type="button"
        className="nav-toggle"
        aria-label="Toggle navigation menu"
        aria-expanded="false"
        onClick={(e) => {
          const el = e.currentTarget;
          const open = el.getAttribute("aria-expanded") === "true";
          el.setAttribute("aria-expanded", open ? "false" : "true");
          el.closest(".nav-links")?.classList.toggle("open", !open);
        }}
      >
        ☰
      </button>
    </nav>
  );
}
