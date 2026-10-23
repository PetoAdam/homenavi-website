import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Homenavi",
    short_name: "Homenavi",
    description: "Open, self-hostable smart-home platform.",
    start_url: "/",
    display: "standalone",
    background_color: "#1b232d",
    theme_color: "#1b232d",
    icons: [
      {
        src: "/icons/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}