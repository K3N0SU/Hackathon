import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Milpa",
    short_name: "Milpa",
    description:
      "Photograph a pesticide label and get the safety details in your language.",
    start_url: "/scan",
    scope: "/",
    display: "standalone",
    background_color: "#f8f5ec",
    theme_color: "#1f4a33",
    orientation: "portrait",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icon-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
