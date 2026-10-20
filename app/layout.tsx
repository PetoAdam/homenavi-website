import { Metadata } from "next";
import "./globals.css";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.homenavi.org"),
  title: {
    default: "Homenavi — Your smart home, on your terms",
    template: "%s | Homenavi",
  },
  description:
    "Homenavi is an open, self-hostable smart-home platform with realtime device control, dashboards, automation workflows, and an integration marketplace.",
  openGraph: {
    title: "Homenavi — Your smart home, on your terms",
    description:
      "Open smart-home platform with a microservice core, MQTT/HDP realtime plane, and integration-first extensibility.",
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
    <html lang="en">
      <body>
        <Nav />
        <main id="main" className="container">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
