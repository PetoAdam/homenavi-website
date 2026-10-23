"use client";

import { useEffect } from "react";

export default function ScrollRail() {
  useEffect(() => {
    const fill = document.getElementById("rail-fill");
    const dot = document.getElementById("rail-dot");
    const label = document.getElementById("rail-label");
    const ticks = document.getElementById("rail-ticks");
    if (!fill || !dot || !label) return;

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("main.container section")
    );

    if (ticks) {
      const total = document.documentElement.scrollHeight || 1;
      for (const s of sections) {
        const tick = document.createElement("span");
        tick.className = "scroll-rail-tick";
        tick.style.top = `${Math.min(100, (s.offsetTop / total) * 100).toFixed(2)}%`;
        ticks.appendChild(tick);
      }
    }

    const update = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0;
      fill.style.height = `${(p * 100).toFixed(2)}%`;
      dot.style.top = `${(p * 100).toFixed(2)}%`;
      label.textContent = `${Math.round(p * 100)}%`;
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div className="scroll-rail" aria-hidden="true">
      <div className="scroll-rail-track">
        <div className="scroll-rail-ticks" id="rail-ticks" />
        <div className="scroll-rail-fill" id="rail-fill" />
        <div className="scroll-rail-dot" id="rail-dot" />
      </div>
      <span className="scroll-rail-label" id="rail-label">top</span>
    </div>
  );
}
