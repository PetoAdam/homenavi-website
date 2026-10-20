import { Pill } from "./Pill";

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="page-header">
      <h1 className="page-title">{title}</h1>
      {subtitle ? <p className="page-subtitle">{subtitle}</p> : null}
    </header>
  );
}

export function GlassCard({ children, hero = false }: { children: React.ReactNode; hero?: boolean }) {
  return <div className={`glass-card${hero ? " hero" : ""}`}>{children}</div>;
}

export function ScreenshotFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <figure className="screenshot-frame">
      <img src={src} alt={alt} loading="lazy" />
    </figure>
  );
}

export function CodeBlock({ code }: { code: string }) {
  return <pre className="code-block"><code>{code}</code></pre>;
}

export { Pill };
