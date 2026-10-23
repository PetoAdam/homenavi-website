"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function NavClient({ links }: { links: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.body.classList.add("nav-open");
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("nav-open");
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pathname = usePathname();

  return (
    <nav className={`nav-links${open ? " open" : ""}`} aria-label="Primary">
      <div className="nav-pill-group">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className={`nav-pill${pathname.startsWith(l.href) ? " active" : ""}`}
          >
            {l.label}
          </a>
        ))}
      </div>
      <a href="/demo" className="btn demo-cta">Try the live demo</a>
      <button
        type="button"
        className="nav-toggle"
        aria-label="Toggle navigation menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        ☰
      </button>
    </nav>
  );
}
