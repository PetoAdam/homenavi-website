import { Metadata } from "next";
import { Inter, JetBrains_Mono, Manrope } from "next/font/google";
import "./globals.css";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import ScrollRail from "./components/ScrollRail";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

// Manrope 800 mirrors the Homenavi app sidebar brand treatment.
const brand = Manrope({
  subsets: ["latin"],
  weight: "800",
  variable: "--font-brand",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.homenavi.org"),
  applicationName: "Homenavi",
  category: "Smart home software",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
  title: {
    default: "Homenavi — Your smart home, on your terms",
    template: "%s | Homenavi",
  },
  description:
    "Homenavi is an open, self-hostable smart-home platform with realtime device control, dashboards, automation workflows, and an integration marketplace.",
  keywords: ["smart home", "self-hosted", "home automation", "MQTT", "HDP", "MCP", "dashboards", "integrations"],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: {
    title: "Homenavi — Your smart home, on your terms",
    description:
      "Open source smart-home platform with a microservice core, MQTT/HDP realtime plane, and integration-first extensibility.",
    url: "https://www.homenavi.org",
    siteName: "Homenavi",
    images: [{ url: "/screenshots/dashboard.png", width: 1200, height: 800 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Homenavi — Your smart home, on your terms",
    description:
      "Realtime device control, dashboards, automation, and an integration marketplace in one self-hostable platform.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable} ${brand.variable}`}>
      <body>
        <Nav />
        <ScrollRail />
        <main id="main" className="container">{children}</main>
        <Footer />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                if (!("IntersectionObserver" in window)) return;
                const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                if (reduce) return;
                const targets = document.querySelectorAll(".section:not(.reveal)");
                const io = new IntersectionObserver(function (entries) {
                  entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                      entry.target.classList.add("reveal");
                      io.unobserve(entry.target);
                    }
                  });
                }, { threshold: 0.12 });
                targets.forEach(function (t) { io.observe(t); });

                const walkthroughRows = document.querySelectorAll("[data-reveal]");
                const rowObserver = new IntersectionObserver(function (entries) {
                  entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                      entry.target.classList.add("is-revealed");
                      rowObserver.unobserve(entry.target);
                    }
                  });
                }, { threshold: 0.18, rootMargin: "0px 0px -8%" });
                walkthroughRows.forEach(function (row) {
                  row.classList.add("is-reveal-ready");
                  rowObserver.observe(row);
                });
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
